// Copyright 2014-2020, University of Colorado Boulder

/**
 * Defines a simple grid with horizontal and vertical lines, and no enclosing
 * lines on the outer edges.
 *
 * @author John Blanco
 */

import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import areaBuilder from '../../areaBuilder.js';

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

inherit( Path, Grid );
export default Grid;