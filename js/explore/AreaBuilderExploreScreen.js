// Copyright 2014-2015, University of Colorado Boulder

/**
 * The 'Explore' screen in the Area Builder simulation. Conforms to the contract specified in joist/Screen.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // imports
  var areaBuilder = require( 'AREA_BUILDER/areaBuilder' );
  var AreaBuilderExploreModel = require( 'AREA_BUILDER/explore/model/AreaBuilderExploreModel' );
  var AreaBuilderExploreView = require( 'AREA_BUILDER/explore/view/AreaBuilderExploreView' );
  var AreaBuilderIconFactory = require( 'AREA_BUILDER/common/view/AreaBuilderIconFactory' );
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var exploreString = require( 'string!AREA_BUILDER/explore' );

  // images
  var exploreIcon = require( 'image!AREA_BUILDER/explore-icon.png' );

  /**
   * @constructor
   */
  function AreaBuilderExploreScreen() {
    Screen.call( this,
      exploreString,
      new Image( exploreIcon ),
      function() { return new AreaBuilderExploreModel(); },
      function( model ) { return new AreaBuilderExploreView( model ); },
      {
        backgroundColor: AreaBuilderSharedConstants.BACKGROUND_COLOR,
        navigationBarIcon: AreaBuilderIconFactory.createExploreScreenNavBarIcon()
      }
    );
  }

  areaBuilder.register( 'AreaBuilderExploreScreen', AreaBuilderExploreScreen );

  return inherit( Screen, AreaBuilderExploreScreen );
} );