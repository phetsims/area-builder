// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model of a rectangular board (like a white board or bulletin board) upon
 * which various smaller shapes can be placed.
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var DISTANCE_COMPARE_THRESHOLD = 1E-5;
  var WILDCARD_PLACEMENT_ARRAY = [ '*' ];

  var MOVEMENT_VECTORS = {
    // This sim is using screen conventions, meaning positive Y indicates down.
    up: new Vector2( 0, -1 ),
    down: new Vector2( 0, 1 ),
    left: new Vector2( -1, 0 ),
    right: new Vector2( 1, 0 )
  };

  var SCAN_AREA_MOVEMENT_FUNCTIONS = [
    null,                                           // 0
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
    null                                           // 15
  ];

  /**
   * @param {Dimension2} size
   * @param {Number} unitSquareLength
   * @param {Vector2} position
   * @param {String || Color} colorHandled
   * @constructor
   */
  function ShapePlacementBoard( size, unitSquareLength, position, colorHandled ) {

    // The size should be an integer number of unit squares for both dimensions.
    assert && assert( size.width % unitSquareLength === 0 && size.height % unitSquareLength === 0, 'ShapePlacementBoard dimensions must be integral numbers of unit square dimensions' );

    var self = this;

    PropertySet.call( this, {
      // Boolean property that controls whether or not the placement grid is visible
      gridVisible: false,

      // Read-only property that indicates the area of the composite shape
      area: 0,

      // Read-only property that indicates the perimeter of the composite shape
      perimeter: 0,

      // Read-only set of points that define the outer perimeter of the composite shape
      outerPerimeterPoints: [],

      // Read-only set of sets of points that define interior perimeters
      interiorPerimeters: []
    } );

    // Non-dynamic public values.
    this.unitSquareLength = unitSquareLength; // @public
    this.position = position; // @public
    this.colorHandled = colorHandled; // @public

    // Private variables
    this.bounds = new Bounds2( position.x, position.y, position.x + size.width, position.y + size.height ); // @private
    this.residentShapes = new ObservableArray(); // @private
    this.validPlacementLocations = WILDCARD_PLACEMENT_ARRAY; // @private
    this.numRows = size.height / unitSquareLength; // @private
    this.numColumns = size.width / unitSquareLength; // @private
    this.releaseAllInProgress = false; // @private
    this.orphanReleaseInProgress = false; // @private
    this.incomingShapes = []; // @private, list of shapes that are animating to a spot on this board but aren't here yet

    // Non-dynamic properties that are externally visible
    this.size = size; // @public

    // Update the area and perimeter when the list of resident shapes changes.
    this.residentShapes.addItemAddedListener( function( addedShape ) {
      self.updateArea();
      self.updateCellsAdded( addedShape );
      self.updatePerimeterInfo();
    } );
    this.residentShapes.addItemRemovedListener( function( removedShape ) {
      self.updateArea();
      self.updateCellsRemoved( removedShape );

      // The following guard prevents having a zillion computationally
      // intensive updates when the board is cleared, and all prevents
      // undesireable recursion in some situations.
      if ( !( self.releaseAllInProgress || self.orphanReleaseInProgress ) ) {
        self.updatePerimeterInfo();
        self.updateValidPlacementLocations();
        self.releaseAnyOrphans();
      }
    } );

    // For efficiency and simplicity in evaluating the interior and exterior
    // perimeter, locating orphans, and so forth, a 2D array is used to track
    // various state information about the 'cells' that correspond to the
    // locations on this board where shapes may be placed.  This array has a
    // buffer of always-empty cells around it so that the 'marching squares'
    // algorithm can be used even if this placement board is filled up.
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

    /**
     * Place the provide shape on this board.  Returns false if the color does
     * not match the handled color or if the shape is not partially over the
     * board.
     * @public
     * @param {MovableShape} movableShape A model shape
     */
    placeShape: function( movableShape ) {
      assert && assert( movableShape.userControlled === false, 'Shapes can\'t be place when still controlled by user.' );
      var self = this;

      var shapeBounds = new Bounds2( movableShape.position.x, movableShape.position.y, movableShape.position.x + movableShape.shape.bounds.getWidth(), movableShape.position.y + movableShape.shape.bounds.getHeight() );

      // See if shape is of the correct color and overlapping with the board.
      if ( movableShape.color !== this.colorHandled || !this.bounds.intersectsBounds( shapeBounds ) || this.validPlacementLocations.length === 0 ) {
        return false;
      }

      // Choose a location for the shape
      if ( this.validPlacementLocations === WILDCARD_PLACEMENT_ARRAY ) {

        // This is the first shape to be added, so put it anywhere on the grid
        var xPos = Math.round( ( movableShape.position.x - this.position.x ) / this.unitSquareLength ) * this.unitSquareLength + this.position.x;
        xPos = Math.max( Math.min( xPos, this.bounds.maxX - this.unitSquareLength ), this.bounds.minX );
        var yPos = Math.round( ( movableShape.position.y - this.position.y ) / this.unitSquareLength ) * this.unitSquareLength + this.position.y;
        yPos = Math.max( Math.min( yPos, this.bounds.maxY - this.unitSquareLength ), this.bounds.minY );
        movableShape.setDestination( new Vector2( xPos, yPos ), true );
      }
      else {
        // Choose the closest valid location.
        var closestValidLocation = this.validPlacementLocations[ 0 ];
        this.validPlacementLocations.forEach( function( candidatePosition ) {
          if ( movableShape.position.distance( candidatePosition ) < movableShape.position.distance( closestValidLocation ) ) {
            closestValidLocation = candidatePosition;
          }
        } );
        movableShape.setDestination( closestValidLocation, true );
      }

      // The remaining code in this function assumes that the shape is
      // animating to the new location, and will cause odd results if it
      // isn't, so we check it here.
      assert && assert( movableShape.animating, 'Shape is not animating after being placed.' );

      // The shape is moving to a spot on the board.  We don't want to add it
      // to the list of resident shapes yet, or we may trigger a change to the
      // exterior and interior perimeters, but we need to keep a reference to
      // it so that the valid placement locations can be updated, especially
      // in multi-touch environments.  So, basically, there is an intermediate
      // 'holding place' for incoming shapes.
      this.incomingShapes.push( movableShape );

      // Update the valid locations for the next placement.
      self.updateValidPlacementLocations();

      // Create a listener that will move this shape from the incoming shape
      // list to the resident list once the animation completes.
      var animationCompleteListener = function( animating ) {
        assert && assert( !animating, 'Error: The animating property changed to true when expected to change to false.' );
        if ( !animating ) {
          self.incomingShapes.splice( self.incomingShapes.indexOf( movableShape ), 1 );
          self.residentShapes.push( movableShape );
        }

        // Set up a listener to remove this shape when the user grabs is.
        var removalListener = function( userControlled ) {
          assert && assert( userControlled === true, 'Should only see shapes become user controlled after being added to a placement board.' );
          self.residentShapes.remove( movableShape );
        };
        self.tagListener( removalListener );
        removalListener.placementBoardRemovalListener = true;
        movableShape.userControlledProperty.once( removalListener );
      };

      // Tag the listener so that it can be removed without firing if needed,
      // such as when the board is cleared due to reset.
      this.tagListener( animationCompleteListener );

      // Hook up the listener.
      movableShape.animatingProperty.once( animationCompleteListener );

      // If we made it to here, placement succeeded.
      return true;
    },

    // @private, tag a listener for removal
    tagListener: function( listener ) {
      listener.shapePlacementBoard = this;
    },

    // @private, check if listener function was tagged by this instance
    listenerTagMatches: function( listener ) {
      return ( listener.shapePlacementBoard && listener.shapePlacementBoard === this );
    },

    // TODO: This is rather ugly.  Work with SR to improve or find
    // TODO: alternative, or to bake into Axon.
    // @private, remove all observers from a property that have been tagged
    // by this shape placement board.
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
     * Update the array of cells with a newly added shape.
     * @private
     */
    updateCellsAdded: function( addedShape ) {
      var xIndex = Math.round( ( addedShape.destination.x - this.position.x ) / this.unitSquareLength ) + 1;
      var yIndex = Math.round( ( addedShape.destination.y - this.position.y ) / this.unitSquareLength ) + 1;
      assert && assert( this.cells[ xIndex ][ yIndex ].occupiedBy === null, 'Attempt made to add square to occupied location.' );
      this.cells[ xIndex ][ yIndex ].occupiedBy = addedShape;
    },

    /**
     * Update the array of cells due to a removed shape.
     * @private
     */
    updateCellsRemoved: function( removedShape ) {
      var xIndex = Math.round( ( removedShape.destination.x - this.position.x ) / this.unitSquareLength ) + 1;
      var yIndex = Math.round( ( removedShape.destination.y - this.position.y ) / this.unitSquareLength ) + 1;
      assert && assert( this.cells[ xIndex ][ yIndex ].occupiedBy === removedShape, 'Removed shape was not marked in occupied spaces.' );
      this.cells[ xIndex ][ yIndex ].occupiedBy = null;
    },

    updateArea: function() {
      this.area = this.residentShapes.length;
    },

    /**
     * Release all the shapes that are currently on this board and send them
     * to their home location.
     * @public
     */
    releaseAllShapes: function( animate ) {
      var self = this;
      this.releaseAllInProgress = true;

      var shapesToSendHome = [];

      // Remove all listeners added to the shapes by this placement board.
      this.residentShapes.forEach( function( shape ) {
        self.removeTaggedObservers( shape.userControlledProperty );
        shapesToSendHome.push( shape );
      } );
      this.incomingShapes.forEach( function( shape ) {
        self.removeTaggedObservers( shape.animatingProperty );
        shapesToSendHome.push( shape );
      } );

      // Clear out all references to shapes placed on this board.
      this.residentShapes.clear();
      this.incomingShapes.length = 0;

      // Send the shapes to their origin.
      shapesToSendHome.forEach( function( shape ) { shape.goHome( animate ); } );

      // Update board state.
      this.updateValidPlacementLocations();
      this.releaseAllInProgress = false;
      this.updatePerimeterInfo();
    },

    // @private
    releaseShape: function( shape ) {
      if ( this.residentShapes.contains( shape ) ) {
        this.removeTaggedObservers( shape.userControlledProperty );
        this.residentShapes.remove( shape );
      }
      else if ( this.incomingShapes.indexOf( shape ) >= 0 ) {
        this.removeTaggedObservers( shape.animatingProperty );
        this.incomingShapes.splice( this.incomingShapes.indexOf( shape ), 1 );
      }
      else {
        //TODO: Remove this clause and warning once this method and its usage is fully tested.
        console.log( 'Error: An attempt was made to release a shape that is not present.' );
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

    modelToCellCoords: function( x, y ) {
      return new Vector2( ( x - this.position.x ) / this.unitSquareLength + 1, ( y - this.position.y ) / this.unitSquareLength + 1 );
    },

    roundVector: function( vector ) {
      vector.setXY( Math.round( vector.x ), Math.round( vector.y ) );
    },

    createShapeFromPerimeterPoints: function( perimeterPoints ) {
      var perimeterShape = new Shape();
      perimeterShape.moveToPoint( perimeterPoints[ 0 ] );
      for ( var i = 1; i < perimeterPoints.length; i++ ) {
        perimeterShape.lineToPoint( perimeterPoints[i] );
      }
      perimeterShape.close(); // Shouldn't be needed, but best to be sure.
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
     * Update the total perimeter value as well as the points that define its
     * shape.
     */
    updatePerimeterInfo: function() {

      var self = this;

      if ( this.residentShapes.length === 0 ) {
        this.perimeter = 0;
        this.interiorPerimetersProperty.reset();
        this.outerPerimeterPointsProperty.reset();
      }
      else {

        // Find the top left occupied square to use as a starting point.
        var row;
        var column;
        var firstOccupiedCell = null;
        for ( row = 1; row < ( this.numRows + 1 ) && firstOccupiedCell === null; row++ ) {
          for ( column = 1; column < this.numColumns + 1; column++ ) {
            if ( this.cells[column][row].occupiedBy ) {
              firstOccupiedCell = new Vector2( column, row );
              break;
            }
          }
        }

        // Scan the outer perimeter.
        var currentOuterPerimeter = this.scanPerimeter( this.cells, firstOccupiedCell );

        // Scan for empty spaces enclosed within the outer perimeter.
        var outlineShape = this.createShapeFromPerimeterPoints( currentOuterPerimeter );
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

        // Update externally visible properties.  Only update the perimeters
        // if they have changed in order to minimize work done in the view.
        if ( !this.perimeterPointsEqual( currentOuterPerimeter, this.outerPerimeterPoints ) ) {
          this.outerPerimeterPoints = currentOuterPerimeter;
        }
        if ( !this.perimeterListsEqual( interiorPerimeters, this.interiorPerimeters ) ) {
          this.interiorPerimeters = interiorPerimeters;
        }
        var totalPerimeterAccumulator = this.outerPerimeterPoints.length;
        interiorPerimeters.forEach( function( interiorPerimeter ) {
          totalPerimeterAccumulator += interiorPerimeter.length;
        } );
        this.perimeter = totalPerimeterAccumulator;
      }
    },

    perimeterPointsEqual: function( perimeter1, perimeter2 ) {
      assert && assert( perimeter1 instanceof Array && perimeter2 instanceof Array, 'Invalid parameters for perimeterPointsEqual' );
      if ( perimeter1.length !== perimeter2.length ) {
        return false;
      }
      return perimeter1.every( function( point, index ) {
        return( point.equals( !perimeter2[ index ] ) );
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
      assert && assert( startCell.occupiedBy !== null, 'Usage error: Unoccupied cell passed to group identification.' )
      assert && assert( !startCell.cataloged, 'Usage error: Cataloged cell passed to group identification algorithm.' )
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
      for ( var column = 1; column <= this.numColumns; column++ ) {
        for ( var row = 1; row <= this.numRows; row++ ) {
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
      var self = this;
      this.orphanReleaseInProgress = true;
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
              self.releaseShape( movableShape );
              movableShape.goHome( true );
            } );
          }
        } );
      }
      this.orphanReleaseInProgress = false;
      self.updatePerimeterInfo();
      self.updateValidPlacementLocations();
    },

    /**
     * Update the list of locations where shapes can be placed where they will
     * be adjacent to the existing shapes, won't overlap, and won't be off the
     * board.
     * @private
     */
    updateValidPlacementLocations: function() {
      var self = this;

      if ( self.residentShapes.length + self.incomingShapes.length === 0 ) {
        this.validPlacementLocations = WILDCARD_PLACEMENT_ARRAY;
      }
      else {

        // Clear previous list.
        self.validPlacementLocations = [];

        // Create a list of all locations that share an edge with a resident or incoming shape.
        var adjacentLocations = [];
        var residentAndIncomingShapes = [];
        self.residentShapes.forEach( function( shape ) { residentAndIncomingShapes.push( shape ); } );
        self.incomingShapes.forEach( function( shape ) { residentAndIncomingShapes.push( shape ); } );
        residentAndIncomingShapes.forEach( function( shape ) {
          for ( var angle = 0; angle < 2 * Math.PI; angle += Math.PI / 2 ) {
            var newPosition = shape.destination.plus( new Vector2.createPolar( self.unitSquareLength, angle ) );
            if ( newPosition.x < self.bounds.maxX && newPosition.x >= self.bounds.minX && newPosition.y < self.bounds.maxY && newPosition.y >= self.bounds.minY ) {
              adjacentLocations.push( newPosition );
            }
          }
        } );

        // Eliminate locations that are occupied.
        adjacentLocations.forEach( function( adjacentLocation ) {
          var isOccupied = false;
          for ( var i = 0; i < residentAndIncomingShapes.length; i++ ) {
            if ( residentAndIncomingShapes[ i ].destination.distance( adjacentLocation ) < DISTANCE_COMPARE_THRESHOLD ) {
              isOccupied = true;
              break;
            }
          }
          if ( !isOccupied ) {
            self.validPlacementLocations.push( adjacentLocation );
          }
        } );
      }
    }
  } );
} );