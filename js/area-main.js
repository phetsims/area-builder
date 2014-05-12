// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main entry point for the 'Area' sim.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaExplorationModel = require( 'AREA/explore/model/AreaExplorationModel' );
  var AreaExplorationView = require( 'AREA/explore/view/AreaExplorationView' );
  var AreaGameModel = require( 'AREA/game/model/AreaGameModel' );
  var AreaGameView = require( 'AREA/game/view/AreaGameView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Screen = require( 'JOIST/Screen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simTitle = require( 'string!AREA/area.name' );
  var exploreString = require( 'string!AREA/explore' );
  var gameString = require( 'string!AREA/game' );
  var exploreIcon = require( 'image!AREA/explore-icon.png' );
  var gameIcon = require( 'image!AREA/game-icon.png' );

  // constants
  var BACKGROUND_COLOR = 'rgb( 225, 255, 255 )';

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
    new Sim( simTitle, [
      new Screen( exploreString, new Image( exploreIcon ),
        function() {return new AreaExplorationModel();},
        function( model ) {return new AreaExplorationView( model );},
        { backgroundColor: BACKGROUND_COLOR }
      ),
      new Screen( gameString, new Image( gameIcon ),
        function() {return new AreaGameModel();},
        function( model ) {return new AreaGameView( model );},
        { backgroundColor: BACKGROUND_COLOR }
      )
    ], simOptions ).start();
  } );
} );