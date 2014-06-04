// Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Game' screen of the Area Builder simulation.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var StartGameLevelNode = require( 'AREA_BUILDER/game/view/StartGameLevelNode' );

  /**
   * @param {AreaBuilderGameModel} model
   * @constructor
   */
  function AreaBuilderGameView( model ) {

    var thisScreen = this;
    ScreenView.call( thisScreen );

    var iconFont = new PhetFont( { size: 24, weight: 'bold' } );
    this.addChild( new StartGameLevelNode(
      function() { console.log( 'start game function called in StartGameLevelNode' ) },
      function() { console.log( 'reset function called in StartGameLevelNode' ) },
      new Property( true ),
      new Property( true ),
      [
        new Text( '1', { font: iconFont } ),
        new Text( '2', { font: iconFont } ),
        new Text( '3', { font: iconFont } ),
        new Text( '4', { font: iconFont } ),
        new Text( '5', { font: iconFont } )
      ],
      [ new Property( 0 ),
        new Property( 0 ),
        new Property( 0 ),
        new Property( 0 ),
        new Property( 0 )
      ],
      {
        numLevels: 5,
        numStarsOnButtons: 6
      }
    ) );
  }

  return inherit( ScreenView, AreaBuilderGameView );
} );
