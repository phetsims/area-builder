[object Promise]

/**
 * The 'Game' screen in the Area Builder simulation. Conforms to the contract specified in joist/Screen.
 *
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Image from '../../../scenery/js/nodes/Image.js';
import gameIcon from '../../images/game-icon_png.js';
import areaBuilder from '../areaBuilder.js';
import areaBuilderStrings from '../areaBuilderStrings.js';
import AreaBuilderSharedConstants from '../common/AreaBuilderSharedConstants.js';
import AreaBuilderIconFactory from '../common/view/AreaBuilderIconFactory.js';
import AreaBuilderChallengeFactory from './model/AreaBuilderChallengeFactory.js';
import AreaBuilderGameModel from './model/AreaBuilderGameModel.js';
import QuizGameModel from './model/QuizGameModel.js';
import AreaBuilderGameView from './view/AreaBuilderGameView.js';

const gameString = areaBuilderStrings.game;

class AreaBuilderGameScreen extends Screen {

  constructor( tandem ) {

    const options = {
      name: gameString,
      backgroundColorProperty: new Property( AreaBuilderSharedConstants.BACKGROUND_COLOR ),
      homeScreenIcon: new ScreenIcon( new Image( gameIcon ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: AreaBuilderIconFactory.createGameScreenNavBarIcon(),
      tandem: tandem
    };

    super(
      () => new QuizGameModel( new AreaBuilderChallengeFactory(), new AreaBuilderGameModel() ),
      model => new AreaBuilderGameView( model ),
      options
    );
  }
}

areaBuilder.register( 'AreaBuilderGameScreen', AreaBuilderGameScreen );
export default AreaBuilderGameScreen;