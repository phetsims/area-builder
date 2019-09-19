// Copyright 2014-2017, University of Colorado Boulder

/**
 * The 'Game' screen in the Area Builder simulation. Conforms to the contract specified in joist/Screen.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // imports
  const areaBuilder = require( 'AREA_BUILDER/areaBuilder' );
  const AreaBuilderChallengeFactory = require( 'AREA_BUILDER/game/model/AreaBuilderChallengeFactory' );
  const AreaBuilderGameModel = require( 'AREA_BUILDER/game/model/AreaBuilderGameModel' );
  const AreaBuilderGameView = require( 'AREA_BUILDER/game/view/AreaBuilderGameView' );
  const AreaBuilderIconFactory = require( 'AREA_BUILDER/common/view/AreaBuilderIconFactory' );
  const AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );
  const QuizGameModel = require( 'AREA_BUILDER/game/model/QuizGameModel' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const gameString = require( 'string!AREA_BUILDER/game' );

  // images
  const gameIcon = require( 'image!AREA_BUILDER/game-icon.png' );

  function AreaBuilderGameScreen( tandem ) {

    const options = {
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