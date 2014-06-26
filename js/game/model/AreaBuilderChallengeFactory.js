// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderGameChallenge = require( 'AREA_BUILDER/game/model/AreaBuilderGameChallenge' );
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

  // No constructor - this is a static type with a set of functions.
  return  {
    // @private
    generateChallenge: function( level ) {
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
            new ShapeCreatorNode( SQUARE_SHAPE, 'red', function() {} )
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
    generateChallengeSet: function( level, numChallenges ) {
      var self = this;
      var challengeSet = [];
      _.times( numChallenges, function() {
        challengeSet.push( self.generateChallenge( level ) );
      } );
      return challengeSet;
    }
  };
} );