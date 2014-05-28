// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main entry point for the 'Area Builder' sim.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderExploreScreen = require( 'AREA_BUILDER/explore/AreaBuilderExploreScreen' );
  var AreaBuilderGameScreen = require( 'AREA_BUILDER/game/AreaBuilderGameScreen' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Screen = require( 'JOIST/Screen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simTitle = require( 'string!AREA_BUILDER/area.name' );

  var simOptions = {
    credits: {
      leadDesign: 'Karina Hensberry',
      softwareDevelopment: 'John Blanco',
      designTeam: 'Bryce Gruneich, Ariel Paul, Kathy Perkins, Beth Stade',
      thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team to convert this simulation to HTML5.'
    }
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( window.phetcommon.getQueryParameter( 'dev' ) ) {
    simOptions = _.extend( {
      // add dev-specific options here
      showHomeScreen: false,
      screenIndex: 0
    }, simOptions );
  }

  SimLauncher.launch( function() {
    // create and start the sim
    new Sim( simTitle, [ new AreaBuilderExploreScreen(), new AreaBuilderGameScreen() ], simOptions ).start();
  } );
} );