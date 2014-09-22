// Copyright 2002-2014, University of Colorado Boulder

/**
 * The 'Explore' screen in the Area Builder simulation. Conforms to the contract specified in joist/Screen.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // imports
  var AreaBuilderExploreModel = require( 'AREA_BUILDER/explore/model/AreaBuilderExploreModel' );
  var AreaBuilderExploreView = require( 'AREA_BUILDER/explore/view/AreaBuilderExploreView' );
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
      { backgroundColor: AreaBuilderSharedConstants.BACKGROUND_COLOR }
    );
  }

  return inherit( Screen, AreaBuilderExploreScreen );
} );