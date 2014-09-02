// Copyright 2002-2014, University of Colorado Boulder

/**
 * Defines a simple grid with horizontal and vertical lines, and no enclosing
 * lines on the outer edges.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   * @param {Number} spacing
   * @param {Object} options
   * @constructor
   */
  function Grid( x, y, width, height, spacing, options ) {
    var gridShape = new Shape();

    // Add the vertical lines
    for ( var i = x + spacing; i < x + width; i += spacing ) {
      gridShape.moveTo( i, y );
      gridShape.lineTo( i, y + height );
    }

    // Add the horizontal lines
    for ( i = y + spacing; i < y + height; i += spacing ) {
      gridShape.moveTo( x, i );
      gridShape.lineTo( x + width, i );
    }

    Path.call( this, gridShape, options );
  }

  return inherit( Path, Grid );
} );