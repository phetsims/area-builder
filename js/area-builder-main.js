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
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simTitle = require( 'string!AREA_BUILDER/area-builder.title' );

  var simOptions = {
    credits: {
      leadDesign: 'Karina K. R. Hensberry',
      softwareDevelopment: 'John Blanco',
      team: 'Bryce Gruneich, Amanda McGarry, Ariel Paul, Kathy Perkins, Beth Stade',
      qualityAssurance: 'Steele Dalton, Oliver Nix, Oliver Orejola, Arnab Purkayastha,\n Amy Rouinfar, Bryan Yoelin'
    }
  };

  SimLauncher.launch( function() {
    // create and start the sim
    new Sim( simTitle, [ new AreaBuilderExploreScreen(), new AreaBuilderGameScreen() ], simOptions ).start();
  } );
} );