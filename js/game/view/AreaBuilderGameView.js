// Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Game' screen of the Area Builder simulation.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var StartGameLevelNode = require( 'AREA_BUILDER/game/view/StartGameLevelNode' );
  var ReturnToLevelSelectButton = require( 'SCENERY_PHET/ReturnToLevelSelectButton' );

  // images
  var gameScreenStubImage = require( 'image!AREA_BUILDER/gameScreenStubImage/game-screen-stub.jpg' );

  /**
   * @param {AreaBuilderGameModel} model
   * @constructor
   */
  function AreaBuilderGameView( model ) {

    var thisScreen = this;
    ScreenView.call( thisScreen );

    var showLevelSelectionScreen = new BooleanProperty( true );

    var iconFont = new PhetFont( { size: 24, weight: 'bold' } );

    function makeIcon( color, number ) {
      var background = new Rectangle( 0, 0, 30, 30, 0, 0, { fill: color } );
      background.addChild( new Text( number, { font: iconFont, center: background.center } ) );
      return background;
    }

    var startGameLevelNode = new StartGameLevelNode(
      function() {
        showLevelSelectionScreen.toggle();
      },
      function() { console.log( 'reset function called in StartGameLevelNode' ); },
      new Property( true ),
      new Property( true ),
      [
        makeIcon( '#34E16E', 1 ),
        makeIcon( '#E0B7E1', 2 ),
        makeIcon( '#FE8E5C', 3 ),
        makeIcon( '#fdfd96', 4 ),
        makeIcon( '#ff6961', 5 )
      ],
      [
        new Property( 0 ),
        new Property( 0 ),
        new Property( 0 ),
        new Property( 0 ),
        new Property( 0 )
      ],
      {
        numLevels: 5,
        numStarsOnButtons: 6
      }
    );
    this.addChild( startGameLevelNode );

    var gameScreenStub = new Image( gameScreenStubImage, { scale: 0.85 } );
    this.addChild( gameScreenStub );

    var returnButton = new ReturnToLevelSelectButton(
      {
        listener: function() { showLevelSelectionScreen.reset(); },
        top: 13,
        left: 15
      } );
    this.addChild( returnButton );

    showLevelSelectionScreen.link( function( showLevelSelection ) {
      startGameLevelNode.visible = showLevelSelection;
      gameScreenStub.visible = !showLevelSelection;
      returnButton.visible = !showLevelSelection;
    } );
  }


  return inherit( ScreenView, AreaBuilderGameView );
} );
