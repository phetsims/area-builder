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
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var DISTANCE_COMPARE_THRESHOLD = 1E-5;
  var WILDCARD_PLACEMENT_ARRAY = [ '*' ];

  function ShapePlacementBoard( size, unitSquareLength, position, colorHandled ) {

    this.unitSquareLength = unitSquareLength; // @public
    this.position = position; // @public
    this.colorHandled = colorHandled; // @private
    this.bounds = new Bounds2( position.x, position.y, position.x + size.width, position.y + size.height ); // @private
    this.residentShapes = []; // @private
    this.validPlacementLocations = WILDCARD_PLACEMENT_ARRAY; // @private

    // The size should be an integer number of unit squares for both dimensions.
    assert && assert( size.width % unitSquareLength === 0 && size.height % unitSquareLength === 0, 'ShapePlacementBoard dimensions must be integral numbers of unit square dimensions' );

    PropertySet.call( this, {
      // Boolean property that controls whether or not the placement grid is visible
      gridVisible: false
    } );

    // Non-dynamic properties that are externally visible
    this.size = size; // @public
  }

  return inherit( PropertySet, ShapePlacementBoard, {

    /**
     * Place the provide shape on this board.  Returns false if the color does
     * not match the handled color or if the shape is not partially over the
     * board.
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

      // Add this shape to the list of shapes that are on this board.
      this.residentShapes.push( shape );

      // Set up a listener to remove this shape when the user grabs is.
      shape.userControlledProperty.once( function( userControlled ) {
        assert && assert( userControlled === true, 'Should only see shapes become user controlled after being added to a placement board.' );
        self.residentShapes.splice( self.residentShapes.indexOf( shape ), 1 );
        self.updateValidPlacementLocations();
      } );

      // Update the valid locations for the next placement.
      this.updateValidPlacementLocations();

      // If we made it to here, placement succeeded.
      return true;
    },

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
            if ( self.residentShapes[ i ].position.distance( adjacentLocation ) < DISTANCE_COMPARE_THRESHOLD ) {
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