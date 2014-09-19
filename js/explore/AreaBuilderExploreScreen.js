// Copyright 2002-2014, University of Colorado Boulder

/**
 * The 'Explore' screen in the Area Builder simulation. Conforms to the contract specified in joist/Screen.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // imports
  var AreaBuilderExplorationModel = require( 'AREA_BUILDER/explore/model/AreaBuilderExplorationModel' );
  var AreaBuilderExplorationView = require( 'AREA_BUILDER/explore/view/AreaBuilderExplorationView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var exploreString = require( 'string!AREA_BUILDER/explore' );

  // images
  var exploreIcon = require( 'image!AREA_BUILDER/explore-icon.png' );

  // constants
  var BACKGROUND_COLOR = 'rgb( 225, 255, 255 )';

  /**
   * @constructor
   */
  function AreaBuilderExploreScreen() {
    Screen.call( this,
      exploreString,
      new Image( exploreIcon ),
      function() { return new AreaBuilderExplorationModel(); },
      function( model ) { return new AreaBuilderExplorationView( model ); },
      { backgroundColor: BACKGROUND_COLOR }
    );
  }

  return inherit( Screen, AreaBuilderExploreScreen );
} );