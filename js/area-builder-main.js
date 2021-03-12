// Copyright 2014-2020, University of Colorado Boulder

/**
 * Main entry point for the 'Area Builder' sim.
 *
 * @author John Blanco
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import areaBuilderStrings from './areaBuilderStrings.js';
import AreaBuilderExploreScreen from './explore/AreaBuilderExploreScreen.js';
import AreaBuilderGameScreen from './game/AreaBuilderGameScreen.js';

const areaBuilderTitleString = areaBuilderStrings[ 'area-builder' ].title;

// constants
const tandem = Tandem.ROOT;

const simOptions = {
  credits: {
    leadDesign: 'Karina K. R. Hensberry',
    softwareDevelopment: 'John Blanco',
    team: 'Bryce Gruneich, Amanda McGarry, Ariel Paul, Kathy Perkins, Beth Stade',
    qualityAssurance: 'Steele Dalton, Amanda Davis, Oliver Nix, Oliver Orejola, Arnab Purkayastha, ' +
                      'Amy Rouinfar, Bryan Yoelin'
  }
};

simLauncher.launch( () => {
  // create and start the sim
  new Sim( areaBuilderTitleString, [
    new AreaBuilderExploreScreen( tandem.createTandem( 'exploreScreen' ) ),
    new AreaBuilderGameScreen( tandem.createTandem( 'gameScreen' ) )
  ], simOptions ).start();
} );