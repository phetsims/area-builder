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
   * @param {Dimension2} size
   * @param {Number} spacing Space between the lines that comprise the grid, used for both x and y directions
   * @param {Object} lineOptions
   * @constructor
   */
  function Grid( size, spacing, lineOptions ) {
    Node.call( this );

    _.extend( {
      // defaults
      stroke: 'gray'
    }, lineOptions );

    // Add the lines
    for ( var i = spacing; i < size.width; i += spacing ) {
      // Add a vertical line
      this.addChild( new Line( i, 0, i, size.height, lineOptions ) );
    }
    for ( i = spacing; i < size.height; i += spacing ) {
      // Add a horizontal line
      this.addChild( new Line( 0, i, size.width, i, lineOptions ) );
    }
  }

  return inherit( Node, Grid );
} );