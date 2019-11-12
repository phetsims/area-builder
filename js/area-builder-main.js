// Copyright 2014-2019, University of Colorado Boulder

/**
 * Main entry point for the 'Area Builder' sim.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const AreaBuilderExploreScreen = require( 'AREA_BUILDER/explore/AreaBuilderExploreScreen' );
  const AreaBuilderGameScreen = require( 'AREA_BUILDER/game/AreaBuilderGameScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const Tandem = require( 'TANDEM/Tandem' );

  // strings
  const areaBuilderTitleString = require( 'string!AREA_BUILDER/area-builder.title' );

  // constants
  const tandem = Tandem.rootTandem;

  const simOptions = {
    credits: {
      leadDesign: 'Karina K. R. Hensberry',
      softwareDevelopment: 'John Blanco',
      team: 'Bryce Gruneich, Amanda McGarry, Ariel Paul, Kathy Perkins, Beth Stade',
      qualityAssurance: 'Steele Dalton, Amanda Davis, Oliver Nix, Oliver Orejola, Arnab Purkayastha, ' +
                        'Amy Rouinfar, Bryan Yoelin'
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