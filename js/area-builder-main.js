// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main entry point for the 'Area Builder' sim.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderExplorationModel = require( 'AREA_BUILDER/explore/model/AreaBuilderExplorationModel' );
  var AreaBuilderExplorationView = require( 'AREA_BUILDER/explore/view/AreaBuilderExplorationView' );
  var AreaBuilderGameModel = require( 'AREA_BUILDER/game/model/AreaBuilderGameModel' );
  var AreaBuilderGameView = require( 'AREA_BUILDER/game/view/AreaBuilderGameView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Screen = require( 'JOIST/Screen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simTitle = require( 'string!AREA_BUILDER/area.name' );
  var exploreString = require( 'string!AREA_BUILDER/explore' );
  var gameString = require( 'string!AREA_BUILDER/game' );
  var exploreIcon = require( 'image!AREA_BUILDER/explore-icon.png' );
  var gameIcon = require( 'image!AREA_BUILDER/game-icon.png' );

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
        function() {return new AreaBuilderExplorationModel();},
        function( model ) {return new AreaBuilderExplorationView( model );},
        { backgroundColor: BACKGROUND_COLOR }
      ),
      new Screen( gameString, new Image( gameIcon ),
        function() {return new AreaBuilderGameModel();},
        function( model ) {return new AreaBuilderGameView( model );},
        { backgroundColor: BACKGROUND_COLOR }
      )
    ], simOptions ).start();
  } );
} );