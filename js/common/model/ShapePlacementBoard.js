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

  function ShapePlacementBoard( size, unitSquareLength, position, colorHandled ) {

    var self = this;
    this.unitSquareLength = unitSquareLength; // @public
    this.position = position; // @public
    this.colorHandled = colorHandled; // @private
    this.bounds = new Bounds2( position.x, position.y, position.x + size.width, position.y + size.height ); // @private
    this.residentShapes = new ObservableArray(); // @private
    this.validPlacementLocations = WILDCARD_PLACEMENT_ARRAY; // @private

    // The size should be an integer number of unit squares for both dimensions.
    assert && assert( size.width % unitSquareLength === 0 && size.height % unitSquareLength === 0, 'ShapePlacementBoard dimensions must be integral numbers of unit square dimensions' );

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

    // For efficiency and simplicity in evaluating the perimeter, we need a 2D
    // array that tracks whether a cell is occupied.  This array has a buffer
    // of always empty cells around it so that the 'marching squares'
    // algorithm can be used.
    this.occupiedSquares = [];
    for ( var columns = 0; columns < size.width / unitSquareLength + 2; columns++ ) {
      var currentRow = [];
      for ( var rows = 0; rows < size.height / unitSquareLength + 2; rows++ ) {
        currentRow.push( false );
      }
      this.occupiedSquares.push( currentRow );
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

    updateOccupiedAdded: function( addedShape ) {
      var xIndex = Math.round( ( addedShape.position.x - this.position.x ) / this.unitSquareLength ) + 1;
      var yIndex = Math.round( ( addedShape.position.y - this.position.y ) / this.unitSquareLength ) + 1;
      assert && assert( this.occupiedSquares[ xIndex ][ yIndex ] === false, 'Attempt made to add square to occupied location.' );
      this.occupiedSquares[ xIndex ][ yIndex ] = true;
    },

    updateOccupiedRemoved: function( addedShape ) {
      var xIndex = Math.round( ( addedShape.position.x - this.position.x ) / this.unitSquareLength ) + 1;
      var yIndex = Math.round( ( addedShape.position.y - this.position.y ) / this.unitSquareLength ) + 1;
      assert && assert( this.occupiedSquares[ xIndex ][ yIndex ] === true, 'Removed shape was not marked in occupied spaces.' );
      this.occupiedSquares[ xIndex ][ yIndex ] = false;
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

    // @private util
    addIfNotRedundant: function( position, positionList ) {
      for ( var i = 0; i < positionList.length; i++ ) {
        if ( positionList[i].equals( position ) ) {
          return;
        }
      }
      positionList.push( position );
    },

    /**
     * Update the total perimeter value as well as the points that define its
     * shape.
     */
    updatePerimeterInfo: function() {

      var self = this;

      if ( this.residentShapes.length === 0 ) {
        this.perimeter = 0;
        this.outerPerimeterPointsProperty.reset();
      }
      else {

        // Set up some convenience/efficiency variables
        var oneDown = new Vector2( 0, this.unitSquareLength );
        var oneRight = new Vector2( this.unitSquareLength, 0 );
        var leftEdgePoints = [];
        var rightEdgePoints = [];
        var topEdgePoints = [];
        var bottomEdgePoints = [];

        // Scan by row to find the left and right edge points.
        for ( var row = 0; row <= this.size.height; row += this.unitSquareLength ) {
          var leftMostShapeInRow = null;
          var rightMostShapeInRow = null;
          var yPos = row + this.position.y;
          this.residentShapes.forEach( function( shape ) {
            if ( shape.position.y === yPos ) {
              // This shape is in this row, see if it is more left than previously found shape.
              if ( leftMostShapeInRow === null || shape.position.x < leftMostShapeInRow.position.x ) {
                leftMostShapeInRow = shape;
              }
              // Now see if it is more right than previously found shape.
              if ( rightMostShapeInRow === null || shape.position.x > rightMostShapeInRow.position.x ) {
                rightMostShapeInRow = shape;
              }
            }
          } );

          if ( leftMostShapeInRow !== null ) {
            this.addIfNotRedundant( leftMostShapeInRow.position, leftEdgePoints );
            this.addIfNotRedundant( leftMostShapeInRow.position.plus( oneDown ), leftEdgePoints );
          }

          if ( rightMostShapeInRow !== null ) {
            this.addIfNotRedundant( rightMostShapeInRow.position.plus( oneRight ), rightEdgePoints );
            this.addIfNotRedundant( rightMostShapeInRow.position.plus( oneRight ).plus( oneDown ), rightEdgePoints );
          }
        }

        // Scan by column to find the top and bottom edge points.
        for ( var column = 0; column <= this.size.width; column += this.unitSquareLength ) {
          var topMostShapeInColumn = null;
          var bottomMostShapeInColumn = null;
          var xPos = column + this.position.x;
          this.residentShapes.forEach( function( shape ) {
            if ( shape.position.x === xPos ) {
              // This shape is in this column, see if it is higher than previously found shape.
              if ( topMostShapeInColumn === null || shape.position.y < topMostShapeInColumn.position.y ) {
                topMostShapeInColumn = shape;
              }
              // Now see if it is lower than previously found shape.
              if ( bottomMostShapeInColumn === null || shape.position.y > bottomMostShapeInColumn.position.y ) {
                bottomMostShapeInColumn = shape;
              }
            }
          } );

          if ( topMostShapeInColumn !== null ) {
            this.addIfNotRedundant( topMostShapeInColumn.position, topEdgePoints );
            this.addIfNotRedundant( topMostShapeInColumn.position.plus( oneRight ), topEdgePoints );
          }

          if ( bottomMostShapeInColumn !== null ) {
            this.addIfNotRedundant( bottomMostShapeInColumn.position.plus( oneDown ), bottomEdgePoints );
            this.addIfNotRedundant( bottomMostShapeInColumn.position.plus( oneRight ).plus( oneDown ), bottomEdgePoints );
          }
        }

        // Now assemble all points into a single array of perimeter points
        // that starts in the upper left and proceeds counter-clockwise around
        // the perimeter with no redundant points.
        rightEdgePoints.reverse();
        topEdgePoints.reverse();
        var outerPerimeterPoints = [];
        leftEdgePoints.forEach( function( point ) {
          self.addIfNotRedundant( point, outerPerimeterPoints );
        } );
        bottomEdgePoints.forEach( function( point ) {
          self.addIfNotRedundant( point, outerPerimeterPoints );
        } );
        rightEdgePoints.forEach( function( point ) {
          self.addIfNotRedundant( point, outerPerimeterPoints );
        } );
        topEdgePoints.forEach( function( point ) {
          self.addIfNotRedundant( point, outerPerimeterPoints );
        } );

        // Update the properties that are externally visible.
        this.outerPerimeterPoints = outerPerimeterPoints;
        this.perimeter = outerPerimeterPoints.length;
        console.log( '---------------------' );
        console.log( this.perimeter );
        console.log( outerPerimeterPoints );
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