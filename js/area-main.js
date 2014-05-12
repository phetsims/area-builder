// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main entry point for the 'Area' sim.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // imports
  var AreaScreen = require( 'AREA/common/view/AreaScreen' ),
    DivideScreenIconNode = require( 'AREA/divide/view/DivideScreenIconNode' ),
    MultiplyScreenIconNode = require( 'AREA/multiply/view/MultiplyScreenIconNode' ),
    FactorScreenIconNode = require( 'AREA/factor/view/FactorScreenIconNode' ),
    AreaModel = require( 'AREA/common/model/AreaModel' ),
    Screen = require( 'JOIST/Screen' ),
    Sim = require( 'JOIST/Sim' ),
    SimLauncher = require( 'JOIST/SimLauncher' ),

  // strings and images
    simTitle = require( 'string!AREA/area.name' ),

  // constants
    BACKGROUND_COLOR = 'rgb( 255, 245, 236 )',

    simOptions = {
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
    new Sim( simTitle, [
      new Screen( '', new MultiplyScreenIconNode(),
        function() {return new AreaModel();},
        function( model ) {return new AreaScreen( model );},
        { backgroundColor: BACKGROUND_COLOR }
      ),
      new Screen( '', new FactorScreenIconNode(),
        function() {return new AreaModel();},
        function( model ) {return new AreaScreen( model );},
        { backgroundColor: BACKGROUND_COLOR }
      )
    ], simOptions ).start();
  } );
} );