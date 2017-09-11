// Copyright 2014-2015, University of Colorado Boulder

/**
 * The 'Game' screen in the Area Builder simulation. Conforms to the contract specified in joist/Screen.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // imports
  var areaBuilder = require( 'AREA_BUILDER/areaBuilder' );
  var AreaBuilderChallengeFactory = require( 'AREA_BUILDER/game/model/AreaBuilderChallengeFactory' );
  var AreaBuilderGameModel = require( 'AREA_BUILDER/game/model/AreaBuilderGameModel' );
  var AreaBuilderGameView = require( 'AREA_BUILDER/game/view/AreaBuilderGameView' );
  var AreaBuilderIconFactory = require( 'AREA_BUILDER/common/view/AreaBuilderIconFactory' );
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var QuizGameModel = require( 'AREA_BUILDER/game/model/QuizGameModel' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var gameString = require( 'string!AREA_BUILDER/game' );

  // images
  var gameIcon = require( 'image!AREA_BUILDER/game-icon.png' );

  function AreaBuilderGameScreen( tandem ) {

    var options = {
      name: gameString,
      backgroundColorProperty: new Property( AreaBuilderSharedConstants.BACKGROUND_COLOR ),
      homeScreenIcon: new Image( gameIcon ),
      navigationBarIcon: AreaBuilderIconFactory.createGameScreenNavBarIcon(),
      tandem: tandem
    };

    Screen.call( this,
      function() { return new QuizGameModel( new AreaBuilderChallengeFactory(), new AreaBuilderGameModel() ); },
      function( model ) { return new AreaBuilderGameView( model ); },
      options );
  }

  areaBuilder.register( 'AreaBuilderGameScreen', AreaBuilderGameScreen );

  return inherit( Screen, AreaBuilderGameScreen );
} );