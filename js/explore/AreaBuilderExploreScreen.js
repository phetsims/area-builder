// Copyright 2014-2017, University of Colorado Boulder

/**
 * The 'Explore' screen in the Area Builder simulation. Conforms to the contract specified in joist/Screen.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // imports
  const areaBuilder = require( 'AREA_BUILDER/areaBuilder' );
  const AreaBuilderExploreModel = require( 'AREA_BUILDER/explore/model/AreaBuilderExploreModel' );
  const AreaBuilderExploreView = require( 'AREA_BUILDER/explore/view/AreaBuilderExploreView' );
  const AreaBuilderIconFactory = require( 'AREA_BUILDER/common/view/AreaBuilderIconFactory' );
  const AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const exploreString = require( 'string!AREA_BUILDER/explore' );

  // images
  const exploreIcon = require( 'image!AREA_BUILDER/explore-icon.png' );

  /**
   * @constructor
   */
  function AreaBuilderExploreScreen( tandem ) {

    var options = {
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

  return inherit( Screen, AreaBuilderExploreScreen );
} );