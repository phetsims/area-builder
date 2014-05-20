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
    this.bounds = new Bounds2( position.x, position.y, position.x + size.x, position.y + size.y ); // @private

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
      if ( shape.color !== this.colorHandled || !this.bounds.intersectsBounds( shape.shape.bounds ) ) {
        return false;
      }
      shape.position = this.position;
    }
  } );
} );