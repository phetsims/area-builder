// Copyright 2002-2014, University of Colorado Boulder

/**
 * Defines a simple grid with horizontal and vertical lines, and no enclosing
 * lines on the outer edges.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   * @param {Number} spacing
   * @param {Object} lineOptions
   * @param {Object} nodeOptions
   * @constructor
   */
  function Grid( x, y, width, height, spacing, lineOptions, nodeOptions ) {
    Node.call( this );

    lineOptions = _.extend( {
      // defaults
      lineWidth: 1,
      stroke: 'gray'
    }, lineOptions );

    // Add the lines
    for ( var i = x + spacing; i < x + width; i += spacing ) {
      // Add a vertical line
      this.addChild( new Line( i, y, i, y + height, lineOptions ) );
    }
    for ( i = y + spacing; i < y + height; i += spacing ) {
      // Add a horizontal line
      this.addChild( new Line( x, i, x + width, i, lineOptions ) );
    }

    this.mutate( nodeOptions );
  }

  return inherit( Node, Grid );
} );