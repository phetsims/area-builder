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

  // Array used for moving scan window in 'marching squares' algorithm, see
  // reference below (where algorithm is implemented).
  var SCAN_AREA_MOVEMENT_VECTORS = [
    null,                  // 0
    new Vector2( 0, -1 ),  // 1
    new Vector2( 1, 0 ),   // 2
    new Vector2( 1, 0 ),   // 3
    new Vector2( -1, 0 ),  // 4
    new Vector2( 0, -1 ),  // 5
    new Vector2( -1, 0 ),  // 6
    new Vector2( 1, 0 ),   // 7
    new Vector2( 0, 1 ),   // 8
    new Vector2( 0, -1 ),  // 9
    new Vector2( 0, 1 ),   // 10
    new Vector2( 0, 1 ),   // 11
    new Vector2( -1, 0 ),  // 12
    new Vector2( 0, -1 ),  // 13
    new Vector2( -1, 0 ),  // 14
    null                   // 15
  ];

  var MOVEMENT_VECTORS = {
    // This sim is using screen conventions, meaning positive Y indicates down.
    up: new Vector2( 0, -1 ),
    down: new Vector2( 0, 1 ),
    left: new Vector2( -1, 0 ),
    right: new Vector2( 1, 0 )
  };

  var SCAN_AREA_MOVEMENT_FUNCTIONS = [
    null,                                           // 0
    function() { return MOVEMENT_VECTORS.up },      // 1
    function() { return MOVEMENT_VECTORS.right },   // 2
    function() { return MOVEMENT_VECTORS.right },   // 3
    function() { return MOVEMENT_VECTORS.left },    // 4
    function() { return MOVEMENT_VECTORS.up },      // 5
    function( previousStep ) { return previousStep === MOVEMENT_VECTORS.up ? MOVEMENT_VECTORS.left : MOVEMENT_VECTORS.right },  // 6
    function() { return MOVEMENT_VECTORS.right },   // 7
    function() { return MOVEMENT_VECTORS.down },    // 8
    function( previousStep ) { return previousStep === MOVEMENT_VECTORS.right ? MOVEMENT_VECTORS.up : MOVEMENT_VECTORS.down },  // 9
    function() { return MOVEMENT_VECTORS.down },   // 10
    function() { return MOVEMENT_VECTORS.down },   // 11
    function() { return MOVEMENT_VECTORS.left },   // 12
    function() { return MOVEMENT_VECTORS.up },     // 13
    function() { return MOVEMENT_VECTORS.left },   // 14
    null                                           // 15
  ];

  // Array used for rotating the vector when performing an interior perimeter
  // walk, see explanation in method header below.
  var INTERIOR_PERIMETER_VECTOR_ROTATION = [
    null,          // 0
      -Math.PI / 2,  // 1
      -Math.PI / 2,  // 2
    0,             // 3
      -Math.PI / 2,   // 4
    0,             // 5
      Math.PI / 2,   // 6
      Math.PI / 2,   // 7
      -Math.PI / 2,  // 8
      Math.PI / 2,   // 9
    0,             // 10
      Math.PI / 2,   // 11
    0,             // 12
      Math.PI / 2,   // 13
      Math.PI / 2,   // 14
    null           // 15
  ];

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
    this.numRows = size.height / unitSquareLength;
    this.numColumns = size.width / unitSquareLength;
    this.releaseAllInProgress = false;

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
      if ( !self.releaseAllInProgress ) {
        self.updatePerimeterInfo();
      }
    } );

    // For efficiency and simplicity in evaluating the perimeter, we use a 2D
    // array that maps integer indexed cells to shapes.  This array has a buffer
    // of always-empty cells around it so that the 'marching squares'
    // algorithm can be used even if this placement board is filled up.
    this.cells = [];
    for ( var columns = 0; columns < this.numColumns + 2; columns++ ) {
      var currentRow = [];
      for ( var rows = 0; rows < this.numRows + 2; rows++ ) {
        currentRow.push( null );
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
     * @param {MovableShape} shape A model shape
     */
    placeShape: function( shape ) {
      assert && assert( shape.userControlled === false, 'Shapes can\'t be place when still controlled by user.' );
      var self = this;

      var shapeBounds = new Bounds2( shape.position.x, shape.position.y, shape.position.x + shape.shape.bounds.getWidth(), shape.position.y + shape.shape.bounds.getHeight() );

      // See if shape is of the correct color and overlapping with the board.
      if ( shape.color !== this.colorHandled || !this.bounds.intersectsBounds( shapeBounds ) || this.validPlacementLocations.length === 0 ) {
        return false;
      }

      // Choose a location for the shape
      if ( this.residentShapes.length === 0 ) {

        // This is the first shape to be added, so put it anywhere on the grid
        var xPos = Math.round( ( shape.position.x - this.position.x ) / this.unitSquareLength ) * this.unitSquareLength + this.position.x;
        xPos = Math.max( Math.min( xPos, this.bounds.maxX - this.unitSquareLength ), this.bounds.minX );
        var yPos = Math.round( ( shape.position.y - this.position.y ) / this.unitSquareLength ) * this.unitSquareLength + this.position.y;
        yPos = Math.max( Math.min( yPos, this.bounds.maxY - this.unitSquareLength ), this.bounds.minY );
        shape.position = new Vector2( xPos, yPos );
      }
      else {
        // Choose the closest valid location.
        var closestValidLocation = this.validPlacementLocations[ 0 ];
        this.validPlacementLocations.forEach( function( candidatePosition ) {
          if ( shape.position.distance( candidatePosition ) < shape.position.distance( closestValidLocation ) ) {
            closestValidLocation = candidatePosition;
          }
        } );
        shape.position = closestValidLocation;
      }

      // Add this shape to the list of shapes that are on this board.  It is
      // crucial that the shape be placed before adding it to this array.
      this.residentShapes.push( shape );

      // Set up a listener to remove this shape when the user grabs is.
      var removalListener = function( userControlled ) {
        assert && assert( userControlled === true, 'Should only see shapes become user controlled after being added to a placement board.' );
        self.residentShapes.remove( shape );
        self.updateValidPlacementLocations();
      };
      removalListener.placementBoardRemovalListener = true;
      shape.userControlledProperty.once( removalListener );

      // Update the valid locations for the next placement.
      this.updateValidPlacementLocations();

      // If we made it to here, placement succeeded.
      return true;
    },

    /**
     * Update the array of cells with a newly added shape.
     * @private
     */
    updateCellsAdded: function( addedShape ) {
      var xIndex = Math.round( ( addedShape.position.x - this.position.x ) / this.unitSquareLength ) + 1;
      var yIndex = Math.round( ( addedShape.position.y - this.position.y ) / this.unitSquareLength ) + 1;
      assert && assert( this.cells[ xIndex ][ yIndex ] === null, 'Attempt made to add square to occupied location.' );
      this.cells[ xIndex ][ yIndex ] = addedShape;
    },

    /**
     * Update the array of cells due to a removed shape.
     * @private
     */
    updateCellsRemoved: function( removedShape ) {
      var xIndex = Math.round( ( removedShape.position.x - this.position.x ) / this.unitSquareLength ) + 1;
      var yIndex = Math.round( ( removedShape.position.y - this.position.y ) / this.unitSquareLength ) + 1;
      assert && assert( this.cells[ xIndex ][ yIndex ] === removedShape, 'Removed shape was not marked in occupied spaces.' );
      this.cells[ xIndex ][ yIndex ] = null;
    },

    updateArea: function() {
      this.area = this.residentShapes.length;
    },

    /**
     * Release all the shapes that are currently on this board.  This does
     * not send the shapes anywhere - it is up to some external entity to "put
     * them away".
     * @public
     */
    releaseAllShapes: function() {
      this.releaseAllInProgress = true;
      this.residentShapes.clear();
      this.updateValidPlacementLocations();
      this.releaseAllInProgress = false;
      this.updatePerimeterInfo();

      // NOTE: This operation can leave the user controlled property of this
      // shape still linked to a listener.  As the sim is designed as of
      // 5/21/2014, this doesn't matter, since the shapes will be immediately
      // deleted anyway.  If that behavior changes, better cleanup may be
      // required to avoid any weird side effects.
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

    cellToModelCoords: function( x, y ) {
      return new Vector2( ( x - 1 ) * this.unitSquareLength + this.position.x, ( y - 1 ) * this.unitSquareLength + this.position.y );
    },

    roundVector: function( vector ) {
      vector.setXY( Math.round( vector.x ), Math.round( vector.y ) );
    },

    /**
     * Marching squares algorithm for scanning the edge of the outer perimeter
     * of the shape created by the filled-in squares, see
     * http://devblog.phillipspiess.com/2010/02/23/better-know-an-algorithm-1-marching-squares/
     * @private
     */
    scanExteriorPerimeter: function( cells, windowStart ) {
      console.log( '========= scanExteriorPerimeter ==============' );

      var scanWindow = windowStart.copy();
      var scanComplete = false;
      var perimeterPoints = [];
      var previousMovementVector = null;
      var count = 0;
      while ( !scanComplete ) {
        console.log( '-------------- stepping algorithm, iteration + ' + count + ' --------------------' );
        console.log( 'scanWindow = ' + scanWindow );

        // Scan the current four-pixel area.
        var upLeft = cells[ scanWindow.x - 1 ][ scanWindow.y - 1 ];
        var upRight = cells[ scanWindow.x ][ scanWindow.y - 1 ];
        var downLeft = cells[ scanWindow.x - 1 ][ scanWindow.y ];
        var downRight = cells[ scanWindow.x ][ scanWindow.y ];

        console.log( 'Scan results: ' );
        console.log( ( upLeft === null ? '0' : '1' ) + ( upRight === null ? '0' : '1' ) );
        console.log( ( downLeft === null ? '0' : '1' ) + ( downRight === null ? '0' : '1' ) );

        // Map the scan to the one of 16 possible states.
        var marchingSquaresState = 0;
        if ( upLeft !== null ) { marchingSquaresState |= 1 }
        if ( upRight !== null ) { marchingSquaresState |= 2 }
        if ( downLeft !== null ) { marchingSquaresState |= 4 }
        if ( downRight !== null ) { marchingSquaresState |= 8 }

        assert && assert( marchingSquaresState !== 0 && marchingSquaresState !== 15, 'Marching squares algorithm reached invalid state.' );

        console.log( 'marchingSquaresState = ' + marchingSquaresState );

        // Convert and add this point to the perimeter points.
        perimeterPoints.push( this.cellToModelCoords( scanWindow.x, scanWindow.y ) );

        // Move the scan window to the next location.
        var movementVector = SCAN_AREA_MOVEMENT_FUNCTIONS[ marchingSquaresState ]( previousMovementVector );
        console.log( 'movement vector = ' + movementVector );
        scanWindow.add( movementVector );
        previousMovementVector = movementVector;

        if ( scanWindow.equals( windowStart ) ) {
          scanComplete = true;
        }
        count++;
        if ( count > 100 ) {
          debugger;
        }
      }
      return perimeterPoints;
    },

    /**
     * Method for mapping an interior perimeter given a fully enclosed empty
     * square at the top left of the enclosed space.  The marching squares
     * algorithm didn't work for this purpose, so this is basically a
     * modified version of that algorithm.
     *
     * @param cells
     * @param windowStart
     * @returns {Array}
     * @private
     */
    scanInteriorPerimeter: function( cells, windowStart ) {
      console.log( '========= scanInteriorPerimeter ==============' );

      // Verify that the starting point is correct, otherwise the algorithm won't work.
      assert && assert( cells[ windowStart.x ][ windowStart.y ] === null &&
                        cells[ windowStart.x - 1 ][ windowStart.y ] !== null &&
                        cells[ windowStart.x ][ windowStart.y - 1] !== null,
        'initial conditions incorrect for algorithm'
      );

      var scanWindow = windowStart.copy();
      var scanComplete = false;
      var perimeterPoints = [];
      var motionVector = new Vector2( 0, -1 );
      var count = 0;
      while ( !scanComplete ) {
        console.log( '-------------- stepping algorithm, iteration + ' + count + ' --------------------' );
        console.log( 'scanWindow = ' + scanWindow );

        // Convert and add this point to the perimeter points.
        perimeterPoints.push( this.cellToModelCoords( scanWindow.x, scanWindow.y ) );

        // Scan the current four-pixel area.
        var upLeft = cells[ scanWindow.x - 1 ][ scanWindow.y - 1 ];
        var upRight = cells[ scanWindow.x ][ scanWindow.y - 1 ];
        var downLeft = cells[ scanWindow.x - 1 ][ scanWindow.y ];
        var downRight = cells[ scanWindow.x ][ scanWindow.y ];

        console.log( 'Scan results: ' );
        console.log( ( upLeft === null ? '0' : '1' ) + ( upRight === null ? '0' : '1' ) );
        console.log( ( downLeft === null ? '0' : '1' ) + ( downRight === null ? '0' : '1' ) );

        // Map the scan to the one of 16 possible states.
        var interiorScanState = 0;
        if ( upLeft !== null ) { interiorScanState |= 1 }
        if ( upRight !== null ) { interiorScanState |= 2 }
        if ( downLeft !== null ) { interiorScanState |= 4 }
        if ( downRight !== null ) { interiorScanState |= 8 }

        console.log( 'interiorScanState = ' + interiorScanState );
        assert && assert( interiorScanState !== 0 && interiorScanState !== 15, 'Interior perimeter scan algorithm reached invalid state.' );

        // Rotate the motion vector based on the scan state.
        // TODO: Use mutable version in future if available.
        this.roundVector( motionVector.rotate( INTERIOR_PERIMETER_VECTOR_ROTATION[ interiorScanState ] ) );

        console.log( 'motionVector = ' + motionVector );

        // Move the scan window to the next location.
        scanWindow.addXY( motionVector.x, motionVector.y );

        if ( scanWindow.equals( windowStart ) ) {
          scanComplete = true;
        }
        count++;
        if ( count > 100 ) {
          debugger;
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
            if ( this.cells[column][row] ) {
              firstOccupiedCell = new Vector2( column, row );
              break;
            }
          }
        }
        console.log( 'firstOccupiedCell: ' + firstOccupiedCell );

        // Scan the outer perimeter.
        this.outerPerimeterPoints = this.scanExteriorPerimeter( this.cells, firstOccupiedCell );

        // Scan for empty spaces enclosed within the perimeter.
        var outlineShape = new Shape();
        var enclosedSpaces = [];
        outlineShape.moveToPoint( this.outerPerimeterPoints[ 0 ] );
        for ( var i = 1; i < this.outerPerimeterPoints.length; i++ ) {
          outlineShape.lineToPoint( this.outerPerimeterPoints[i] );
        }
        outlineShape.close();
        for ( row = 1; row < this.numRows - 1; row++ ) {
          for ( column = 1; column < this.numColumns - 1; column++ ) {
            if ( this.cells[ column ][ row ] === null ) {
              // This cell is empty.  Test if it is within the outline perimeter.
              var cellCenterInModel = this.cellToModelCoords( column, row ).addXY( this.unitSquareLength / 2, this.unitSquareLength / 2 );
              if ( outlineShape.containsPoint( cellCenterInModel ) ) {
                enclosedSpaces.push( new Vector2( column, row ) );
              }
            }
          }
        }

        console.log( 'enclosedSpaces.length = ' + enclosedSpaces.length );

        // Map all the internal perimeters
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
          var enclosedPerimeterPoints = this.scanInteriorPerimeter( this.cells, topLeftSpace );
          interiorPerimeters.push( enclosedPerimeterPoints );

          // Remove all empty spaces enclosed by this perimeter.
          var perimeterShape = new Shape();
          perimeterShape.moveToPoint( enclosedPerimeterPoints[ 0 ] );
          enclosedPerimeterPoints.forEach( function( perimeterPoint ) {
            perimeterShape.lineToPoint( perimeterPoint );
          } );
          perimeterShape.close(); // Probably not necessary, but best to be sure.

          var leftoverEmptySpaces = [];
          enclosedSpaces.forEach( function( enclosedSpace ) {
            var topLeftPoint = self.cellToModelCoords( enclosedSpace.x, enclosedSpace.y );
            var centerPoint = topLeftPoint.plusXY( self.unitSquareLength / 2, self.unitSquareLength / 2 );
            if ( !perimeterShape.containsPoint( centerPoint ) ) {
              // This space is not contained in the perimeter that was just mapped.
              leftoverEmptySpaces.push( enclosedSpace );
            }
          } );

          // Set up for the next time through the loop.
          enclosedSpaces = leftoverEmptySpaces;
        }

        this.interiorPerimeters = interiorPerimeters;
        var totalPerimeterAccumulator = this.outerPerimeterPoints.length;
        interiorPerimeters.forEach( function( interiorPerimeter ) {
          totalPerimeterAccumulator += interiorPerimeter.length;
        } );
        this.perimeter = totalPerimeterAccumulator;
      }
    },

    /**
     * Update the list of locations where shapes can be placed where they will
     * be adjacent to the existing shapes, won't overlap, and won't be off the
     * board.
     * @private
     */
    updateValidPlacementLocations: function() {
      var self = this;

      if ( self.residentShapes.length === 0 ) {
        this.validPlacementLocations = WILDCARD_PLACEMENT_ARRAY;
      }
      else {
        // Create a list of all locations that would share an edge with another square.
        var adjacentLocations = [];
        self.residentShapes.forEach( function( residentShape ) {
          for ( var angle = 0; angle < 2 * Math.PI; angle += Math.PI / 2 ) {
            var newPosition = residentShape.position.plus( new Vector2.createPolar( self.unitSquareLength, angle ) );
            if ( newPosition.x < self.bounds.maxX && newPosition.x >= self.bounds.minX && newPosition.y < self.bounds.maxY && newPosition.y >= self.bounds.minY ) {
              adjacentLocations.push( newPosition );
            }
          }
        } );

        self.validPlacementLocations.length = 0;

        adjacentLocations.forEach( function( adjacentLocation ) {
          var isOccupied = false;
          for ( var i = 0; i < self.residentShapes.length; i++ ) {
            if ( self.residentShapes.get( i ).position.distance( adjacentLocation ) < DISTANCE_COMPARE_THRESHOLD ) {
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
} )
;