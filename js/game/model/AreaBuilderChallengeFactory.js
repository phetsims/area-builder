// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var AreaBuilderGameChallenge = require( 'AREA_BUILDER/game/model/AreaBuilderGameChallenge' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var ShapeCreatorNode = require( 'AREA_BUILDER/game/view/ShapeCreatorNode' );

  // strings
  var buildItString = require( 'string!AREA_BUILDER/buildIt' );

  // constants
  var UNIT_SQUARE_LENGTH = 35; // In screen coords TODO consolidate with others if they all end up the same in the end.
  var SQUARE_SHAPE = new Shape()
    .moveTo( 0, 0 )
    .lineTo( UNIT_SQUARE_LENGTH, 0 )
    .lineTo( UNIT_SQUARE_LENGTH, UNIT_SQUARE_LENGTH )
    .lineTo( 0, UNIT_SQUARE_LENGTH )
    .close();

  // TODO: temp stuff for demo
  var longRectangle = new Rectangle( 0, 0, 70, 35, 0, 0, { fill: AreaBuilderSharedConstants.GREENISH_COLOR, stroke: 'green' } );
  longRectangle.addChild( new Line( 35, 0, 35, 35, { stroke: 'black', lineDash: [2] } ) );
  var triangleShape = new Shape().moveTo( 35, 0 ).lineTo( 35, 35 ).lineTo( 0, 35 ).close();
  var triangle = new Path( triangleShape, { fill: AreaBuilderSharedConstants.GREENISH_COLOR, stroke: 'green' } );

  // No constructor - this is a static type with a set of functions.
  return  {
    // @private
    generateChallenge: function( level, model ) {
      if ( level === 0 ) {
        return new AreaBuilderGameChallenge(
          // Title of challenge
          buildItString,

          // Tool control
          {
            gridControl: true,
            dimensionsControl: true,
            decompositionToolControl: true
          },

          // Keypad visibility flag
          false,

          // Kit contents
          [
            new ShapeCreatorNode(
              SQUARE_SHAPE,
              AreaBuilderSharedConstants.GREENISH_COLOR,
              model
            ),
            // The ones below are fake, basically for demo purposes
            longRectangle,
            triangle
          ],

          // Build spec, i.e. what the user should try to build, if anything.
          { area: 12, perimeter: 4 },

          // Color prompts
          null,
          null,

          // Background shape
          null,

          // Check specification, i.e. what gets checked with the user submits their attempt.
          'areaConstructed',

          // Flag for whether or not this is a fake challenge TODO remove once game is working
          false
        );
      }
      else {
        // Create a fake challenge for the other levels.
        return new AreaBuilderGameChallenge(
          'Fake Challenge',
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          true
        );
      }
    },

    // @public
    generateChallengeSet: function( level, numChallenges, model ) {
      var self = this;
      var challengeSet = [];
      _.times( numChallenges, function() {
        challengeSet.push( self.generateChallenge( level, model ) );
      } );
      return challengeSet;
    }
  };
} );