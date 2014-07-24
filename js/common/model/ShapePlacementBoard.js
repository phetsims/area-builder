// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model of a rectangular board (like a white board or bulletin board) upon which various smaller shapes can be placed.
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var PerimeterShape = require( 'AREA_BUILDER/common/model/PerimeterShape' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var INVALID_VALUE_STRING = '--';
  var MOVEMENT_VECTORS = {
    // This sim is using screen conventions, meaning positive Y indicates down.
    up: new Vector2( 0, -1 ),
    down: new Vector2( 0, 1 ),
    left: new Vector2( -1, 0 ),
    right: new Vector2( 1, 0 )
  };
  var SCAN_AREA_MOVEMENT_FUNCTIONS = [
    null,                                            // 0
    function() { return MOVEMENT_VECTORS.up; },      // 1
    function() { return MOVEMENT_VECTORS.right; },   // 2
    function() { return MOVEMENT_VECTORS.right; },   // 3
    function() { return MOVEMENT_VECTORS.left; },    // 4
    function() { return MOVEMENT_VECTORS.up; },      // 5
    function( previousStep ) { return previousStep === MOVEMENT_VECTORS.up ? MOVEMENT_VECTORS.left : MOVEMENT_VECTORS.right; },  // 6
    function() { return MOVEMENT_VECTORS.right; },   // 7
    function() { return MOVEMENT_VECTORS.down; },    // 8
    function( previousStep ) { return previousStep === MOVEMENT_VECTORS.right ? MOVEMENT_VECTORS.up : MOVEMENT_VECTORS.down; },  // 9
    function() { return MOVEMENT_VECTORS.down; },   // 10
    function() { return MOVEMENT_VECTORS.down; },   // 11
    function() { return MOVEMENT_VECTORS.left; },   // 12
    function() { return MOVEMENT_VECTORS.up; },     // 13
    function() { return MOVEMENT_VECTORS.left; },   // 14
    null                                            // 15
  ];

  /**
   * @param {Dimension2} size
   * @param {Number} unitSquareLength
   * @param {Vector2} position
   * @param {String || Color} colorHandled
   * @param {Property<Boolean>} showGridProperty
   * @param {Property<Boolean>} showDimensionsProperty
   * @constructor
   */
  function ShapePlacementBoard( size, unitSquareLength, position, colorHandled, showGridProperty, showDimensionsProperty ) {

    // The size should be an integer number of unit squares for both dimensions.
    assert && assert( size.width % unitSquareLength === 0 && size.height % unitSquareLength === 0, 'ShapePlacementBoard dimensions must be integral numbers of unit square dimensions' );

    this.showGridProperty = showGridProperty;
    this.showDimensionsProperty = showDimensionsProperty;

    PropertySet.call( this, {
      // @public Read/Write value that controls whether the placement board moves individual shapes that are added to
      // the board such that they form a single, contiguous, composite shape, or if it just snaps them to the grid. The
      // perimeter and area values are only updated when this is set to true.
      formComposite: 'formComposite',

      // @public Read-only property that indicates the area of the composite shape
      area: 0,

      // @public Read-only property that indicates the perimeter of the composite shape
      perimeter: 0,

      // @public Read-only shape defined in terms of perimeter points that describes the composite shape created by
      // all of the individual shapes placed on the board by the user.
      compositeShape: new PerimeterShape( [], [], unitSquareLength ),

      // @public Read-only shape that can be placed on the board, generally as a template over which the user can add
      // other shapes.  The shape is positioned relative to this board, not in absolute model space.
      backgroundShape: new PerimeterShape( [], [], unitSquareLength )
    } );

    // Non-dynamic public values.
    this.unitSquareLength = unitSquareLength; // @public
    this.position = position; // @public
    this.colorHandled = colorHandled; // @public

    // Private variables
    this.bounds = new Bounds2( position.x, position.y, position.x + size.width, position.y + size.height ); // @private
    this.residentShapes = new ObservableArray(); // @private
    this.numRows = size.height / unitSquareLength; // @private
    this.numColumns = size.width / unitSquareLength; // @private
    this.incomingShapes = []; // @private, list of shapes that are animating to a spot on this board but aren't here yet

    // Non-dynamic properties that are externally visible
    this.size = size; // @public

    // For efficiency and simplicity in evaluating the interior and exterior perimeter, locating orphans, and so forth,
    // a 2D array is used to track various state information about the 'cells' that correspond to the locations on this
    // board where shapes may be placed.  This array has a buffer of always-empty cells around it so that the 'marching
    // squares' algorithm can be used to evaluate the perimeters even if this placement board is filled up.
    this.cells = [];
    for ( var column = 0; column < this.numColumns + 2; column++ ) {
      var currentRow = [];
      for ( var row = 0; row < this.numRows + 2; row++ ) {
        currentRow.push( {
          column: column,
          row: row,
          occupiedBy: null,   // the shape occupying this cell, null if none
          cataloged: false,   // used by group identification algorithm
          catalogedBy: null   // used by group identification algorithm
        } );
      }
      this.cells.push( currentRow );
    }
  }

  return inherit( PropertySet, ShapePlacementBoard, {

    shapeOverlapsBoard: function( shape ) {
      var shapeBounds = new Bounds2( shape.position.x, shape.position.y, shape.position.x + shape.shape.bounds.getWidth(), shape.position.y + shape.shape.bounds.getHeight() );
      return this.bounds.intersectsBounds( shapeBounds );
    },

    /**
     * Place the provide shape on this board.  Returns false if the color does not match the handled color or if the
     * shape is not partially over the board.
     * @public
     * @param {MovableShape} movableShape A model shape
     */
    placeShape: function( movableShape ) {
      assert && assert( movableShape.userControlled === false, 'Shapes can\'t be placed when still controlled by user.' );
      var self = this;

      // Only place the shape if it is of the correct color and is positioned so that it overlaps with the board.
      if ( movableShape.color !== this.colorHandled || !this.shapeOverlapsBoard( movableShape ) ) {
        return false;
      }

      // Set the shape's visibility behavior based on whether a composite shape is being depicted.
      movableShape.invisibleWhenStill = this.formComposite;

      // Determine where to place the shape on the board.
      var placementLocation = null;
      for ( var surroundingPointsLevel = 0; surroundingPointsLevel < Math.max( this.numRows, this.numColumns ) && placementLocation === null; surroundingPointsLevel++ ) {
        var surroundingPoints = this.getOuterSurroundingPoints( movableShape.position, surroundingPointsLevel );
        surroundingPoints.sort( function( p1, p2 ) {
          return p1.distance( movableShape.position ) - p2.distance( movableShape.position );
        } );
        for ( var pointIndex = 0; pointIndex < surroundingPoints.length && placementLocation === null; pointIndex++ ) {
          if ( self.isValidToPlace( movableShape, surroundingPoints[ pointIndex ] ) ) {
            placementLocation = surroundingPoints[ pointIndex ];
          }
        }
      }
      movableShape.setDestination( placementLocation, true );

      // The remaining code in this function assumes that the shape is animating to the new location, and will cause
      // odd results if it isn't, so we check it here.
      assert && assert( movableShape.animating, 'Shape is not animating after being placed.' );

      // The shape is moving to a spot on the board.  We don't want to add it to the list of resident shapes yet, or we
      // may trigger a change to the exterior and interior perimeters, but we need to keep a reference to it so that
      // the valid placement locations can be updated, especially in multi-touch environments.  So, basically, there is
      // an intermediate 'holding place' for incoming shapes.
      this.incomingShapes.push( movableShape );

      // Create a listener that will move this shape from the incoming shape list to the resident list once the
      // animation completes.
      var animationCompleteListener = function( animating ) {
        assert && assert( !animating, 'Error: The animating property changed to true when expected to change to false.' );
        if ( !animating ) {
          self.incomingShapes.splice( self.incomingShapes.indexOf( movableShape ), 1 );
          self.addResidentShape( movableShape );
        }

        // Set up a listener to remove this shape when the user grabs is.
        var removalListener = function( userControlled ) {
          assert && assert( userControlled === true, 'Should only see shapes become user controlled after being added to a placement board.' );
          self.removeResidentShape( movableShape );
        };
        self.tagListener( removalListener );
        removalListener.placementBoardRemovalListener = true;
        movableShape.userControlledProperty.once( removalListener );
      };

      // Tag the listener so that it can be removed without firing if needed, such as when the board is cleared due to
      // reset.
      this.tagListener( animationCompleteListener );

      // Hook up the listener.
      movableShape.animatingProperty.once( animationCompleteListener );

      // If we made it to here, placement succeeded.
      return true;
    },

    /**
     * Add a shape directly the to specified cell.  This bypasses the placement process, and is generally used when
     * displaying solutions to challenges.
     *
     * @param cellColumn
     * @param cellRow
     * @param movableShape
     */
    addShapeDirectlyToCell: function( cellColumn, cellRow, movableShape ) {
      var self = this;
      movableShape.invisibleWhenStill = false; // Don't hide the shape when it stops moving.
      movableShape.setDestination( this.cellToModelCoords( cellColumn, cellRow ), true );
      // TODO: Would it work to add it directly to the resident shape list?  Try it.
      this.incomingShapes.push( movableShape );

      // The remaining code in this function assumes that the shape is animating to the new location, and will cause
      // odd results if it isn't, so we check it here.
      assert && assert( movableShape.animating, 'Shape is not animating after being directly added to board.' );

      // Move the shape to the resident list once it has finished animating.
      movableShape.animatingProperty.once( function( animating ) {
        assert && assert( !animating, 'Error: The animating property changed to true when expected to change to false.' );
        if ( !animating ) {
          self.incomingShapes.splice( self.incomingShapes.indexOf( movableShape ), 1 );
          self.addResidentShape( movableShape );
        }
      } );
    },

    // @private, add a shape to the list of residents and make the other updates that go along with this.
    addResidentShape: function( movableShape ) {

      // Make sure that the shape is not moving
      assert && assert( movableShape.position.equals( movableShape.destination ), 'Error: Shapes should not become residents until they have completed animating.' );

      // Made sure that the shape isn't already a resident.
      assert && assert( !this.residentShapes.contains( movableShape ), 'Error: Attempt to add shape that is already a resident.' );

      this.residentShapes.add( movableShape );

      // Make the appropriate updates.
      this.updateCellOccupation( movableShape, 'add' );
      this.releaseAnyOrphans();
      this.updateAll();
    },

    removeResidentShape: function( movableShape ) {
      assert && assert( this.residentShapes.contains( movableShape ), 'Error: Attempt to remove shape that is not a resident.' );
      var self = this;
      this.residentShapes.remove( movableShape );
      self.updateCellOccupation( movableShape, 'remove' );
      self.updateAll();

      if ( movableShape.userControlled ) {

        // Watch the shape so that we can do needed updates when the user releases it.
        movableShape.userControlledProperty.once( function( userControlled ) {
          assert && assert( !userControlled, 'Unexpected transition of userControlled flag.' );
          if ( !self.shapeOverlapsBoard( movableShape ) ) {
            // This shape isn't coming back, so we need to trigger an orphan release.
            self.releaseAnyOrphans();
            self.updateAll();
          }
        } );
      }
    },

    // @private, tag a listener for removal
    tagListener: function( listener ) {
      listener.shapePlacementBoard = this;
    },

    // @private, check if listener function was tagged by this instance
    listenerTagMatches: function( listener ) {
      return ( listener.shapePlacementBoard && listener.shapePlacementBoard === this );
    },

    // TODO: This is rather ugly.  Work with SR to improve or find alternative, or to bake into Axon.  Maybe a map.
    // @private, remove all observers from a property that have been tagged by this shape placement board.
    removeTaggedObservers: function( property ) {
      var self = this;
      var taggedObservers = [];
      property._observers.forEach( function( observer ) {
        if ( self.listenerTagMatches( observer ) ) {
          taggedObservers.push( observer );
        }
      } );
      taggedObservers.forEach( function( taggedObserver ) {
        property.unlink( taggedObserver );
      } );
    },

    /**
     * Set or clear the occupation status of the cells.
     *
     * @param movableShape
     * @param operation
     */
    updateCellOccupation: function( movableShape, operation ) {
      var xIndex = Math.round( ( movableShape.destination.x - this.position.x ) / this.unitSquareLength ) + 1;
      var yIndex = Math.round( ( movableShape.destination.y - this.position.y ) / this.unitSquareLength ) + 1;
      // Mark all cells occupied by this shape.
      for ( var row = 0; row < movableShape.shape.bounds.height / this.unitSquareLength; row++ ) {
        for ( var column = 0; column < movableShape.shape.bounds.width / this.unitSquareLength; column++ ) {
          this.cells[ xIndex + column ][yIndex + row ].occupiedBy = operation === 'add' ? movableShape : null;
        }
      }
    },

    updateAreaAndTotalPerimeter: function() {
      if ( this.compositeShape.exteriorPerimeters.length <= 1 ) {
        var self = this;
        var area = 0;
        this.residentShapes.forEach( function( residentShape ) {
          area += residentShape.shape.bounds.width * residentShape.shape.bounds.height / ( self.unitSquareLength * self.unitSquareLength );
        } );
        this.area = area;
        var totalPerimeterAccumulator = 0;
        this.compositeShape.exteriorPerimeters.forEach( function( exteriorPerimeter ) {
          totalPerimeterAccumulator += exteriorPerimeter.length;
        } );
        this.compositeShape.interiorPerimeters.forEach( function( interiorPerimeter ) {
          totalPerimeterAccumulator += interiorPerimeter.length;
        } );
        this.perimeter = totalPerimeterAccumulator;
      }
      else {
        // Area and perimeter readings are currently invalid.
        this.area = INVALID_VALUE_STRING;
        this.perimeter = INVALID_VALUE_STRING;
      }
    },

    /**
     * Convenience function that handles out of bounds case by simply returning false (unoccupied).
     * @private
     * @param column
     * @param row
     */
    isCellOccupied: function( column, row ) {
      if ( column >= this.numColumns || column < 0 || row >= this.numRows || row < 0 ) {
        return false;
      }
      else {
        return this.cells[ column ][ row ].occupiedBy !== null;
      }
    },

    /**
     * Get the outer layer of grid points surrounding the given point.  The 2nd parameter indicates how many steps away
     * from the center 'shell' should be provided.
     * @private
     * @param point
     * @param levelsRemoved
     */
    getOuterSurroundingPoints: function( point, levelsRemoved ) {
      var self = this;
      var normalizedPoints = [];

      // Get the closest point in cell coordinates.
      var normalizedStartingPoint = new Vector2(
          Math.floor( ( point.x - this.position.x ) / this.unitSquareLength ) - levelsRemoved + 1,
          Math.floor( ( point.y - this.position.y ) / this.unitSquareLength ) - levelsRemoved + 1
      );

      var squareSize = ( levelsRemoved + 1 ) * 2;

      for ( var row = 0; row < squareSize; row++ ) {
        for ( var column = 0; column < squareSize; column++ ) {
          if ( ( row === 0 || row === squareSize - 1 || column === 0 || column === squareSize - 1 ) &&
               ( column + normalizedStartingPoint.x <= this.numColumns && row + normalizedStartingPoint.y <= this.numRows ) ) {
            // This is an outer point, and is valid, so include it.
            normalizedPoints.push( new Vector2( column + normalizedStartingPoint.x, row + normalizedStartingPoint.y ) );
          }
        }
      }

      var outerSurroundingPoints = [];
      normalizedPoints.forEach( function( p ) { outerSurroundingPoints.push( self.cellToModelVector( p ) ); } );
      return outerSurroundingPoints;
    },

    /**
     * Determine whether it is valid to place the given shape at the given location.  For placement to be valid, the
     * shape can't overlap with any other shape, and must share at least one side with an occupied space.
     *
     * @param movableShape
     * @param location
     * @returns {boolean}
     */
    isValidToPlace: function( movableShape, location ) {
      var normalizedLocation = this.modelToCellVector( location );
      var normalizedWidth = movableShape.shape.bounds.width / this.unitSquareLength;
      var normalizedHeight = movableShape.shape.bounds.height / this.unitSquareLength;
      var row;
      var column;

      // Return false if the shape goes off the board.  This has to compensate for the fact that there is an additional
      // invisible row in the cell array (to support the perimeter tracing algorithm.
      if ( normalizedLocation.x <= 0 || normalizedLocation.x + normalizedWidth > this.numColumns + 1 ||
           normalizedLocation.y <= 0 || normalizedLocation.y + normalizedHeight > this.numRows + 1 ) {
        return false;
      }

      // If there are no other shapes on the board, any location is valid.
      if ( this.residentShapes.length === 0 ) {
        return true;
      }

      // Return false if this shape overlaps any existing shapes.
      for ( row = 0; row < normalizedHeight; row++ ) {
        for ( column = 0; column < normalizedWidth; column++ ) {
          if ( this.isCellOccupied( normalizedLocation.x + column, normalizedLocation.y + row ) ) {
            return false;
          }
        }
      }

      // If this board is not set to consolidate shapes, we've done enough, and this location is valid.
      if ( !this.formComposite ) {
        return true;
      }

      // This position is only valid if the shape will share an edge with an already placed shape, since the
      // 'formComposite' mode is enabled.
      for ( row = 0; row < normalizedHeight; row++ ) {
        for ( column = 0; column < normalizedWidth; column++ ) {
          if (
            this.isCellOccupied( normalizedLocation.x + column, normalizedLocation.y + row - 1 ) ||
            this.isCellOccupied( normalizedLocation.x + column - 1, normalizedLocation.y + row ) ||
            this.isCellOccupied( normalizedLocation.x + column + 1, normalizedLocation.y + row ) ||
            this.isCellOccupied( normalizedLocation.x + column, normalizedLocation.y + row + 1 )
            ) {
            return true;
          }
        }
      }

      return false;
    },

    /**
     * Release all the shapes that are currently on this board and send them to their home location.
     * @public
     */
    releaseAllShapes: function( fade ) {
      var self = this;

      var shapesToRelease = [];

      // Remove all listeners added to the shapes by this placement board.
      this.residentShapes.forEach( function( shape ) {
        self.removeTaggedObservers( shape.userControlledProperty );
        shapesToRelease.push( shape );
      } );
      this.incomingShapes.forEach( function( shape ) {
        self.removeTaggedObservers( shape.animatingProperty );
        shapesToRelease.push( shape );
      } );

      // Clear out all references to shapes placed on this board.
      this.residentShapes.clear();
      this.incomingShapes.length = 0;

      // Clear the cell array that tracks occupancy.
      for ( var row = 0; row < this.numRows; row++ ) {
        for ( var column = 0; column < this.numColumns; column++ ) {
          this.cells[ column ][ row ].occupiedBy = null;
        }
      }

      // Send the shapes to their origin.
      if ( fade ) {
        shapesToRelease.forEach( function( shape ) { shape.fadeAway(); } );
      }
      else {
        shapesToRelease.forEach( function( shape ) { shape.goHome( false ); } );
      }

      // Update board state.
      this.updateAll();
    },

    // @private
    releaseShape: function( shape ) {
      assert && assert( this.residentShapes.contains( shape ) || this.incomingShapes.contains( shape ), 'Error: An attempt was made to release a shape that is not present.' );
      if ( this.residentShapes.contains( shape ) ) {
        this.removeTaggedObservers( shape.userControlledProperty );
        this.removeResidentShape( shape );
      }
      else if ( this.incomingShapes.indexOf( shape ) >= 0 ) {
        this.removeTaggedObservers( shape.animatingProperty );
        this.incomingShapes.splice( this.incomingShapes.indexOf( shape ), 1 );
      }
    },

    // @private util TODO: check if still used, delete if not.
    addIfNotRedundant: function( position, positionList ) {
      for ( var i = 0; i < positionList.length; i++ ) {
        if ( positionList[i].equals( position ) ) {
          return;
        }
      }
      positionList.push( position );
    },

    cellToModelCoords: function( column, row ) {
      return new Vector2( ( column - 1 ) * this.unitSquareLength + this.position.x, ( row - 1 ) * this.unitSquareLength + this.position.y );
    },

    cellToModelVector: function( v ) {
      return this.cellToModelCoords( v.x, v.y );
    },

    modelToCellCoords: function( x, y ) {
      return new Vector2( ( x - this.position.x ) / this.unitSquareLength + 1, ( y - this.position.y ) / this.unitSquareLength + 1 );
    },

    modelToCellVector: function( v ) {
      return this.modelToCellCoords( v.x, v.y );
    },

    roundVector: function( vector ) {
      vector.setXY( Math.round( vector.x ), Math.round( vector.y ) );
    },

    //TODO: May be unused, remove if so.
    createShapeFromPerimeterPoints: function( perimeterPoints ) {
      var perimeterShape = new Shape();
      perimeterShape.moveToPoint( perimeterPoints[ 0 ] );
      for ( var i = 1; i < perimeterPoints.length; i++ ) {
        perimeterShape.lineToPoint( perimeterPoints[i] );
      }
      perimeterShape.close(); // Shouldn't be needed, but best to be sure.
      return perimeterShape;
    },

    createShapeFromPerimeterList: function( perimeters ) {
      var perimeterShape = new Shape();
      perimeters.forEach( function( perimeterPoints ) {
        perimeterShape.moveToPoint( perimeterPoints[ 0 ] );
        for ( var i = 1; i < perimeterPoints.length; i++ ) {
          perimeterShape.lineToPoint( perimeterPoints[i] );
        }
        perimeterShape.close(); //TODO: Check with JO that multiple close operations are reasonable on the same shape.
      } );
      return perimeterShape;
    },

    /**
     * Marching squares algorithm for scanning the perimeter of a shape, see
     * http://devblog.phillipspiess.com/2010/02/23/better-know-an-algorithm-1-marching-squares/
     * @private
     */
    scanPerimeter: function( cells, windowStart ) {
      var scanWindow = windowStart.copy();
      var scanComplete = false;
      var perimeterPoints = [];
      var previousMovementVector = MOVEMENT_VECTORS.up; // Init this way allows algorithm to work for interior perimeters.
      while ( !scanComplete ) {

        // Scan the current four-pixel area.
        var upLeft = cells[ scanWindow.x - 1 ][ scanWindow.y - 1 ].occupiedBy;
        var upRight = cells[ scanWindow.x ][ scanWindow.y - 1 ].occupiedBy;
        var downLeft = cells[ scanWindow.x - 1 ][ scanWindow.y ].occupiedBy;
        var downRight = cells[ scanWindow.x ][ scanWindow.y ].occupiedBy;

        // Map the scan to the one of 16 possible states.
        var marchingSquaresState = 0;
        if ( upLeft !== null ) { marchingSquaresState |= 1; }
        if ( upRight !== null ) { marchingSquaresState |= 2; }
        if ( downLeft !== null ) { marchingSquaresState |= 4; }
        if ( downRight !== null ) { marchingSquaresState |= 8; }

        assert && assert( marchingSquaresState !== 0 && marchingSquaresState !== 15, 'Marching squares algorithm reached invalid state.' );

        // Convert and add this point to the perimeter points.
        perimeterPoints.push( this.cellToModelCoords( scanWindow.x, scanWindow.y ) );

        // Move the scan window to the next location.
        var movementVector = SCAN_AREA_MOVEMENT_FUNCTIONS[ marchingSquaresState ]( previousMovementVector );
        scanWindow.add( movementVector );
        previousMovementVector = movementVector;

        if ( scanWindow.equals( windowStart ) ) {
          scanComplete = true;
        }
      }
      return perimeterPoints;
    },

    /**
     * Update the exterior and interior perimeters.
     */
    updatePerimeters: function() {
      var self = this;

      // The perimeters can only be computed for a single consolidated shape.
      if ( !this.formComposite || this.residentShapes.length === 0 ) {
        this.perimeter = 0;
        this.compositeShapeProperty.reset();
      }
      else { // Do the full-blown perimeter calculation
        var row;
        var column;
        var exteriorPerimeters = [];
        var mutableVector = new Vector2();

        // Identify each outer perimeter.  There may be more than one if the user is moving a shape that was previously
        // on this board, since any orphaned shapes are not released until the move is complete.
        var contiguousCellGroups = this.identifyContiguousCellGroups();
        contiguousCellGroups.forEach( function( cellGroup ) {

          // Find the top left square of this group to use as a starting point.
          var topLeftCell = null;
          cellGroup.forEach( function( cell ) {
            if ( topLeftCell === null || cell.row < topLeftCell.row || ( cell.row === topLeftCell.row && cell.column < topLeftCell.column ) ) {
              topLeftCell = cell;
            }
          } );

          // Scan the outer perimeter and add to list.
          mutableVector.setXY( topLeftCell.column, topLeftCell.row );
          exteriorPerimeters.push( self.scanPerimeter( self.cells, mutableVector ) );
        } );

        // Scan for empty spaces enclosed within the outer perimeter(s).
        var outlineShape = this.createShapeFromPerimeterList( exteriorPerimeters );
        var enclosedSpaces = [];
        for ( row = 1; row < this.numRows; row++ ) {
          for ( column = 1; column < this.numColumns; column++ ) {
            if ( this.cells[ column ][ row ].occupiedBy === null ) {
              // This cell is empty.  Test if it is within the outline perimeter.
              var cellCenterInModel = this.cellToModelCoords( column, row ).addXY( this.unitSquareLength / 2, this.unitSquareLength / 2 );
              if ( outlineShape.containsPoint( cellCenterInModel ) ) {
                enclosedSpaces.push( new Vector2( column, row ) );
              }
            }
          }
        }

        // Map the internal perimeters
        var interiorPerimeters = [];
        while ( enclosedSpaces.length > 0 ) {

          // Locate the top left most space
          var topLeftSpace = enclosedSpaces[ 0 ];
          enclosedSpaces.forEach( function( cell ) {
            if ( cell.y < topLeftSpace.y || ( cell.y === topLeftSpace.y && cell.x < topLeftSpace.x ) ) {
              topLeftSpace = cell;
            }
          } );

          // Map the interior perimeter.
          var enclosedPerimeterPoints = this.scanPerimeter( this.cells, topLeftSpace );
          interiorPerimeters.push( enclosedPerimeterPoints );

          // Identify and save all spaces not enclosed by this perimeter.
          var perimeterShape = this.createShapeFromPerimeterPoints( enclosedPerimeterPoints );
          var leftoverEmptySpaces = [];
          enclosedSpaces.forEach( function( enclosedSpace ) {
            var positionPoint = self.cellToModelCoords( enclosedSpace.x, enclosedSpace.y );
            var centerPoint = positionPoint.plusXY( self.unitSquareLength / 2, self.unitSquareLength / 2 );
            if ( !perimeterShape.containsPoint( centerPoint ) ) {
              // This space is not contained in the perimeter that was just mapped.
              leftoverEmptySpaces.push( enclosedSpace );
            }
          } );

          // Set up for the next time through the loop.
          enclosedSpaces = leftoverEmptySpaces;
        }

        // Update externally visible properties.  Only update the perimeters if they have changed in order to minimize
        // work done in the view.
        if ( !( this.perimeterListsEqual( exteriorPerimeters, this.compositeShape.exteriorPerimeters ) &&
                this.perimeterListsEqual( interiorPerimeters, this.compositeShape.interiorPerimeters ) ) ) {
          this.compositeShape = new PerimeterShape( exteriorPerimeters, interiorPerimeters, this.unitSquareLength );
        }
      }
    },

    perimeterPointsEqual: function( perimeter1, perimeter2 ) {
      assert && assert( perimeter1 instanceof Array && perimeter2 instanceof Array, 'Invalid parameters for perimeterPointsEqual' );
      if ( perimeter1.length !== perimeter2.length ) {
        return false;
      }
      return perimeter1.every( function( point, index ) {
        return( point.equals( perimeter2[ index ] ) );
      } );
    },

    perimeterListsEqual: function( perimeterList1, perimeterList2 ) {
      assert && assert( perimeterList1 instanceof Array && perimeterList2 instanceof Array, 'Invalid parameters for perimeterListsEqual' );
      if ( perimeterList1.length !== perimeterList2.length ) {
        return false;
      }
      var self = this;
      return perimeterList1.every( function( perimeterPoints, index ) {
        return self.perimeterPointsEqual( perimeterPoints, perimeterList2[ index ] );
      } );
    },

    /**
     * Identify all cells that are adjacent to the provided cell, intended
     * to be used recursively.
     *
     * @private
     * @param startCell
     * @param cellGroup
     */
    identifyAdjacentCells: function( startCell, cellGroup ) {
      assert && assert( startCell.occupiedBy !== null, 'Usage error: Unoccupied cell passed to group identification.' );
      assert && assert( !startCell.cataloged, 'Usage error: Cataloged cell passed to group identification algorithm.' );
      var self = this;

      // Catalog this cell.
      cellGroup.push( startCell );
      startCell.cataloged = true;

      // Kick off cataloging of adjacent cells.
      Object.keys( MOVEMENT_VECTORS ).forEach( function( key ) {
        var movementVector = MOVEMENT_VECTORS[ key ];
        var adjacentCell = self.cells[ startCell.column + movementVector.x ][ startCell.row + movementVector.y ];
        if ( adjacentCell.occupiedBy !== null && !adjacentCell.cataloged ) {
          self.identifyAdjacentCells( adjacentCell, cellGroup );
        }
      } );
    },

    identifyContiguousCellGroups: function() {

      // Make a list of locations for all occupied cells.
      var ungroupedOccupiedCells = [];
      for ( var row = 1; row <= this.numRows; row++ ) {
        for ( var column = 1; column <= this.numColumns; column++ ) {
          var cell = this.cells[ column ][ row ];
          if ( cell.occupiedBy !== null ) {
            ungroupedOccupiedCells.push( this.cells[ column ][ row ] );
            // Clear the flag used by the search algorithm.
            cell.cataloged = false;
          }
        }
      }

      // Identify the interconnected groups of cells.
      var contiguousCellGroups = [];
      while ( ungroupedOccupiedCells.length > 0 ) {
        var cellGroup = [];
        this.identifyAdjacentCells( ungroupedOccupiedCells[ 0 ], cellGroup );
        contiguousCellGroups.push( cellGroup );
        ungroupedOccupiedCells = _.difference( ungroupedOccupiedCells, cellGroup );
      }

      return contiguousCellGroups;
    },

    releaseAnyOrphans: function() {

      // Orphans can only exist when operating in the 'formComposite' mode.
      if ( this.formComposite ) {
        var self = this;
        var contiguousCellGroups = this.identifyContiguousCellGroups();

        if ( contiguousCellGroups.length > 1 ) {
          // There are orphans that should be released.  Determine which ones.
          var indexOfRetainedGroup = 0;
          contiguousCellGroups.forEach( function( group, index ) {
            if ( group.length > contiguousCellGroups[ indexOfRetainedGroup ].length ) {
              indexOfRetainedGroup = index;
            }
          } );

          contiguousCellGroups.forEach( function( group, groupIndex ) {
            if ( groupIndex !== indexOfRetainedGroup ) {
              group.forEach( function( cell ) {
                var movableShape = cell.occupiedBy;
                if ( movableShape !== null ) { // Need to test in case a previously release shape covered multiple cells.
                  self.releaseShape( movableShape );
                  movableShape.goHome( true );
                }
              } );
            }
          } );
        }
      }
    },

    /**
     * Replace one of the composite shapes that currently resides on this board with a set of unit squares.  This is
     * generally done when a composite shape was placed on the board but we now want it treated as a bunch of smaller
     * unitSquares instead.
     *
     * @param originalShape
     * @param unitSquares Pieces that comprise the original shape, MUST BE CORRECTLY LOCATED since this method does not
     * relocate them to the appropriate places.
     */
    replaceShapeWithUnitSquares: function( originalShape, unitSquares ) {
      assert && assert( this.residentShapes.contains( originalShape ), 'Error: Specified shape to be replaced does not appear to be present.' );
      var self = this;

      // The following add and remove operations do not use the add and remove methods in order to avoid releasing
      // orphans (which could cause undesired behavior) and attribute updates (which are unnecessary).
      this.residentShapes.remove( originalShape );
      this.updateCellOccupation( originalShape, 'remove' );

      unitSquares.forEach( function( movableUnitSquare ) {
        self.residentShapes.push( movableUnitSquare );

        // Set up a listener to remove this shape when the user grabs is.
        // TODO: This code was cut and pasted from another portion of this file.  If kept, should be consolidated.
        var removalListener = function( userControlled ) {
          assert && assert( userControlled === true, 'Should only see shapes become user controlled after being added to a placement board.' );
          self.removeResidentShape( movableUnitSquare );
        };
        self.tagListener( removalListener );
        removalListener.placementBoardRemovalListener = true;
        movableUnitSquare.userControlledProperty.once( removalListener );

        self.updateCellOccupation( movableUnitSquare, 'add' );
      } );
    },

    // Update perimeter points, placement locations, total area, and total perimeter.
    updateAll: function() {
      this.updatePerimeters();
      this.updateAreaAndTotalPerimeter();
    },

    /**
     * Set the background shape.  The shape should be positioned at 0, 0 and can be centered horizontally and
     * vertically when placed on the board.
     * @public
     * @param {PerimeterShape} perimeterShape The new background perimeterShape, or null to set no background
     * perimeterShape.
     * @param {Boolean} centered True if the perimeterShape should be centered on the board (but still aligned with grid).
     */
    setBackgroundShape: function( perimeterShape, centered ) {
      if ( perimeterShape === null ) {
        this.backgroundShapeProperty.reset();
      }
      else {
        assert && assert( perimeterShape instanceof PerimeterShape, 'Background perimeterShape must be a PerimeterShape.' );
        if ( centered ) {
          var xOffset = Math.floor( ( ( this.size.width - perimeterShape.getWidth() ) / 2 ) / this.unitSquareLength ) * this.unitSquareLength;
          var yOffset = Math.floor( ( ( this.size.height - perimeterShape.getHeight() ) / 2 ) / this.unitSquareLength ) * this.unitSquareLength;
          this.backgroundShape = perimeterShape.translated( xOffset, yOffset );
        }
        else {
          this.backgroundShape = perimeterShape;
        }
      }
    }
  } );
} );