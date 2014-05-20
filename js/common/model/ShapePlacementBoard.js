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

  function ShapePlacementBoard( size, unitSquareLength, position, colorHandled ) {

    this.unitSquareLength = unitSquareLength; // @public
    this.position = position; // @public
    this.colorHandled = colorHandled; // @private
    this.bounds = new Bounds2( position.x, position.y, position.x + size.width, position.y + size.height ); // @private
    this.residentShapes = []; // @private
    this.validPlacementLocations = [ '*' ]; // @private

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
    }
  } );
} );