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
      outerPerimeterPoints: []
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

    // Non-dynamic properties that are externally visible
    this.size = size; // @public

    // Update the area and perimeter when the list of resident shapes changes.
    this.residentShapes.addItemAddedListener( function( addedShape ) {
      self.area = self.residentShapes.length;
      self.updateOccupiedAdded( addedShape );
      self.updatePerimeterInfo();

    } );
    this.residentShapes.addItemRemovedListener( function( removedShape ) {
      self.area = self.residentShapes.length;
      self.updateOccupiedRemoved( removedShape );
      self.updatePerimeterInfo();
    } );

    // For efficiency and simplicity in evaluating the perimeter, we use a 2D
    // array that maps integer indexed cells to shapes.  This array has a buffer
    // of always-empty cells around it so that the 'marching squares'
    // algorithm can be used even if this placement board is filled up.
    this.occupiedCells = [];
    for ( var columns = 0; columns < this.numColumns + 2; columns++ ) {
      var currentRow = [];
      for ( var rows = 0; rows < this.numRows + 2; rows++ ) {
        currentRow.push( null );
      }
      this.occupiedCells.push( currentRow );
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
     * Update the array of occupied cells with a newly added shape.
     * @private
     */
    updateOccupiedAdded: function( addedShape ) {
      var xIndex = Math.round( ( addedShape.position.x - this.position.x ) / this.unitSquareLength ) + 1;
      var yIndex = Math.round( ( addedShape.position.y - this.position.y ) / this.unitSquareLength ) + 1;
      assert && assert( this.occupiedCells[ xIndex ][ yIndex ] === null, 'Attempt made to add square to occupied location.' );
      this.occupiedCells[ xIndex ][ yIndex ] = addedShape;
    },

    /**
     * Update the array of occupied cells due to a removed shape.
     * @private
     */
    updateOccupiedRemoved: function( removedShape ) {
      var xIndex = Math.round( ( removedShape.position.x - this.position.x ) / this.unitSquareLength ) + 1;
      var yIndex = Math.round( ( removedShape.position.y - this.position.y ) / this.unitSquareLength ) + 1;
      assert && assert( this.occupiedCells[ xIndex ][ yIndex ] === removedShape, 'Removed shape was not marked in occupied spaces.' );
      this.occupiedCells[ xIndex ][ yIndex ] = null;
    },

    /**
     * Release all the shapes that are currently on this board.  This does
     * not send the shapes anywhere - it is up to some external entity to "put
     * them away".
     * @public
     */
    releaseAllShapes: function() {
      this.residentShapes.clear();
      this.updateValidPlacementLocations();

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

    occupiedArrayToModelCoords: function( x, y ) {
      return new Vector2( ( x - 1 ) * this.unitSquareLength + this.position.x, ( y - 1 ) * this.unitSquareLength + this.position.y );
    },

    /**
     * Update the total perimeter value as well as the points that define its
     * shape.  This implements a 'marching squares' algorithm in order to
     * detect the perimeter, see:
     * http://devblog.phillipspiess.com/2010/02/23/better-know-an-algorithm-1-marching-squares/
     */
    updatePerimeterInfo: function() {

      var self = this;

      if ( this.residentShapes.length === 0 ) {
        this.perimeter = 0;
        this.outerPerimeterPointsProperty.reset();
      }
      else {

        // Find the top left occupied square to use as a starting point.
        var row;
        var column;
        var firstOccupiedCell = null;
        for ( row = 1; row < ( this.numRows + 1 ) && firstOccupiedCell === null; row++ ) {
          for ( column = 1; column < this.numColumns + 1; column++ ) {
            if ( this.occupiedCells[column][row] ) {
              firstOccupiedCell = new Vector2( column, row );
              break;
            }
          }
        }

        // Set initial location of 4-pixel area.
        var scanWindow = firstOccupiedCell;
        var startCell = scanWindow.copy();

        // Create the array where the external perimeter points will be accumulated.
        var outerPerimeterPoints = [];

        var scanComplete = false;
        while ( !scanComplete ) {

          // Scan the current four-pixel area.
          var upLeft = this.occupiedCells[ scanWindow.x - 1 ][ scanWindow.y - 1 ];
          var upRight = this.occupiedCells[ scanWindow.x ][ scanWindow.y - 1 ];
          var downLeft = this.occupiedCells[ scanWindow.x - 1 ][ scanWindow.y ];
          var downRight = this.occupiedCells[ scanWindow.x ][ scanWindow.y ];

          // Map the scan to the one of 16 possible states.
          var marchingSquaresState = 0;
          if ( upLeft !== null ) { marchingSquaresState |= 1 }
          if ( upRight !== null ) { marchingSquaresState |= 2 }
          if ( downLeft !== null ) { marchingSquaresState |= 4 }
          if ( downRight !== null ) { marchingSquaresState |= 8 }

          assert && assert( marchingSquaresState !== 0 && marchingSquaresState !== 15, 'Marching squares algorithm reached invalid state.' );

          // Convert and add this point to the perimeter points.
          outerPerimeterPoints.push( this.occupiedArrayToModelCoords( scanWindow.x, scanWindow.y ) );

          // Move the scan window to the next location.
          scanWindow.addXY( SCAN_AREA_MOVEMENT_VECTORS[ marchingSquaresState ].x, SCAN_AREA_MOVEMENT_VECTORS[ marchingSquaresState ].y );

          if ( scanWindow.equals( startCell ) ) {
            scanComplete = true;
          }
        }
        this.outerPerimeterPoints = outerPerimeterPoints;

        // Scan for horizontally enclosed spaces.
        var horizontallyEnclosedSpaces = [];
        var potentiallyEnclosed = false;
        var potentiallyEnclosedSpaces = [];
        for ( row = 1; row < this.numRows - 1; row++ ) {
          potentiallyEnclosed = false;
          potentiallyEnclosedSpaces.length = 0;
          for ( column = 1; column < this.numColumns - 1; column++ ) {
            if ( !potentiallyEnclosed && this.occupiedCells[column][row] !== null ) {
              // Found an edge
              potentiallyEnclosed = true;
            }
            else if ( potentiallyEnclosed && this.occupiedCells[column][row] === null ) {
              // This space might be enclosed
              potentiallyEnclosedSpaces.push( new Vector2( column, row ) );
            }
            else if ( potentiallyEnclosed && this.occupiedCells[column][row] !== null && potentiallyEnclosedSpaces.length > 0 ) {
              // Found a closing edge, so the accumulated spaces are horizontally enclosed.
              potentiallyEnclosedSpaces.forEach( function( p ) { horizontallyEnclosedSpaces.push( p ) } );
            }
          }
        }

        // Scan for vertically enclosed spaces.
        var verticallyEnclosedSpaces = [];
        for ( column = 1; column < this.numColumns - 1; column++ ) {
          potentiallyEnclosed = false;
          potentiallyEnclosedSpaces.length = 0;
          for ( row = 1; row < this.numRows - 1; row++ ) {
            if ( !potentiallyEnclosed && this.occupiedCells[column][row] !== null ) {
              // Found an edge
              potentiallyEnclosed = true;
            }
            else if ( potentiallyEnclosed && this.occupiedCells[column][row] === null ) {
              // This space might be enclosed
              potentiallyEnclosedSpaces.push( new Vector2( column, row ) );
            }
            else if ( potentiallyEnclosed && this.occupiedCells[column][row] !== null && potentiallyEnclosedSpaces.length > 0 ) {
              // Found a closing edge, so the accumulated spaces are horizontally enclosed.
              potentiallyEnclosedSpaces.forEach( function( p ) { verticallyEnclosedSpaces.push( p ) } );
            }
          }
        }

        // Merge the vertically and horizontally enclosed spaces into one array
        var enclosedSpaces = [];
        for ( var i = 0; i < horizontallyEnclosedSpaces.length; i++ ) {
          for ( var j = 0; j < verticallyEnclosedSpaces.length; j++ ) {
            if ( horizontallyEnclosedSpaces[i].equals( verticallyEnclosedSpaces[j] ) ) {
              enclosedSpaces.push( horizontallyEnclosedSpaces[ i ] );
            }
          }
        }

        // Update the properties that are externally visible.
        this.perimeter = outerPerimeterPoints.length;
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