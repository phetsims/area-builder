// Copyright 2014-2015, University of Colorado Boulder

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
  var Tandem = require( 'TANDEM/Tandem' );

  // strings
  var areaBuilderTitleString = require( 'string!AREA_BUILDER/area-builder.title' );

  // constants
  var tandem = Tandem.createRootTandem();

  var simOptions = {
    credits: {
      leadDesign: 'Karina K. R. Hensberry',
      softwareDevelopment: 'John Blanco',
      team: 'Bryce Gruneich, Amanda McGarry, Ariel Paul, Kathy Perkins, Beth Stade',
      qualityAssurance: 'Steele Dalton, Amanda Davis, Oliver Nix, Oliver Orejola, \n Arnab Purkayastha, Amy Rouinfar, Bryan Yoelin'
    }
  };

  SimLauncher.launch( function() {
    // create and start the sim
    new Sim( areaBuilderTitleString, [
      new AreaBuilderExploreScreen( tandem.createTandem( 'exploreScreen' ) ),
      new AreaBuilderGameScreen( tandem.createTandem( 'gameScreen' ) )
    ], simOptions ).start();
  } );
} );