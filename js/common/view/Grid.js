// Copyright 2014-2017, University of Colorado Boulder

/**
 * Defines a simple grid with horizontal and vertical lines, and no enclosing
 * lines on the outer edges.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const areaBuilder = require( 'AREA_BUILDER/areaBuilder' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );

  /**
   * @param {Bounds2} bounds
   * @param {number} spacing
   * @param {Object} [options]
   * @constructor
   */
  function Grid( bounds, spacing, options ) {
    const gridShape = new Shape();

    // Add the vertical lines
    for ( var i = bounds.minX + spacing; i < bounds.minX + bounds.width; i += spacing ) {
      gridShape.moveTo( i, bounds.minY );
      gridShape.lineTo( i, bounds.minY + bounds.height );
    }

    // Add the horizontal lines
    for ( i = bounds.minY + spacing; i < bounds.minY + bounds.height; i += spacing ) {
      gridShape.moveTo( bounds.minX, i );
      gridShape.lineTo( bounds.minX + bounds.width, i );
    }

    Path.call( this, gridShape, options );
  }

  areaBuilder.register( 'Grid', Grid );

  return inherit( Path, Grid );
} );