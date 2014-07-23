// Copyright 2002-2014, University of Colorado Boulder

/**
 * A Scenery node that displays the prompt for the challenges in the Area Builder game.  It looks like a banner with
 * text fields that vary for each of the different challenges.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  var BACKGROUND_FILL_COLOR = '#2A3AFF';
  var TEXT_FILL_COLOR = 'white';

  /**
   * @param {Number} width
   * @param {Number} height
   * @param {Object} options
   * @constructor
   */
  function ChallengePromptBanner( width, height, options ) {
    Node.call( this );
    this.addChild( new Rectangle( 0, 0, width, height, 0, 0, { fill: BACKGROUND_FILL_COLOR } ) );

    // Pass options through to parent class.
    this.mutate( options );
  }

  return inherit( Node, ChallengePromptBanner, {
    //TODO prototypes
  } );
} );