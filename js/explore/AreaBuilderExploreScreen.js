// Copyright 2014-2020, University of Colorado Boulder

/**
 * The 'Explore' screen in the Area Builder simulation. Conforms to the contract specified in joist/Screen.
 *
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import Image from '../../../scenery/js/nodes/Image.js';
import exploreIcon from '../../images/explore-icon_png.js';
import areaBuilderStrings from '../areaBuilderStrings.js';
import areaBuilder from '../areaBuilder.js';
import AreaBuilderSharedConstants from '../common/AreaBuilderSharedConstants.js';
import AreaBuilderIconFactory from '../common/view/AreaBuilderIconFactory.js';
import AreaBuilderExploreModel from './model/AreaBuilderExploreModel.js';
import AreaBuilderExploreView from './view/AreaBuilderExploreView.js';

const exploreString = areaBuilderStrings.explore;


/**
 * @constructor
 */
function AreaBuilderExploreScreen( tandem ) {

  const options = {
    name: exploreString,
    backgroundColorProperty: new Property( AreaBuilderSharedConstants.BACKGROUND_COLOR ),
    homeScreenIcon: new Image( exploreIcon ),
    navigationBarIcon: AreaBuilderIconFactory.createExploreScreenNavBarIcon(),
    tandem: tandem
  };

  Screen.call( this,
    function() { return new AreaBuilderExploreModel(); },
    function( model ) { return new AreaBuilderExploreView( model ); },
    options );
}

areaBuilder.register( 'AreaBuilderExploreScreen', AreaBuilderExploreScreen );

inherit( Screen, AreaBuilderExploreScreen );
export default AreaBuilderExploreScreen;