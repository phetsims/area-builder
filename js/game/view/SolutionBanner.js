// Copyright 2002-2014, University of Colorado Boulder

/**
 * A Scenery node that depicts a banner containing information about solutions for challenges.  This is generally used
 * to show the user information about a challenge that was not correctly solved.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  var FILL_COLOR = '#17BC00';
  var TEXT_FILL_COLOR = 'white';

  /**
   * @param {Number} width
   * @param {Number} height
   * @param {Object} options
   * @constructor
   */
  function SolutionBanner( width, height, options ) {
    Node.call( this );
    this.addChild( new Rectangle( 0, 0, width, height, 0, 0, { fill: FILL_COLOR } ) );

    // Pass options through to parent class.
    this.mutate( options );
  }

  return inherit( Node, SolutionBanner, {
    //TODO prototypes
  } );
} );