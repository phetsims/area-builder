// Copyright 2014-2020, University of Colorado Boulder

/**
 * The 'Game' screen in the Area Builder simulation. Conforms to the contract specified in joist/Screen.
 *
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import Image from '../../../scenery/js/nodes/Image.js';
import gameIcon from '../../images/game-icon_png.js';
import areaBuilderStrings from '../area-builder-strings.js';
import areaBuilder from '../areaBuilder.js';
import AreaBuilderSharedConstants from '../common/AreaBuilderSharedConstants.js';
import AreaBuilderIconFactory from '../common/view/AreaBuilderIconFactory.js';
import AreaBuilderChallengeFactory from './model/AreaBuilderChallengeFactory.js';
import AreaBuilderGameModel from './model/AreaBuilderGameModel.js';
import QuizGameModel from './model/QuizGameModel.js';
import AreaBuilderGameView from './view/AreaBuilderGameView.js';

const gameString = areaBuilderStrings.game;


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

inherit( Screen, AreaBuilderGameScreen );
export default AreaBuilderGameScreen;