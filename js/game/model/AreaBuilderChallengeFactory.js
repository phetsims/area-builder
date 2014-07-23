// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var AreaBuilderGameChallenge = require( 'AREA_BUILDER/game/model/AreaBuilderGameChallenge' );
  var Line = require( 'SCENERY/nodes/Line' );
  var PerimeterShape = require( 'AREA_BUILDER/common/model/PerimeterShape' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var ShapeCreatorNode = require( 'AREA_BUILDER/game/view/ShapeCreatorNode' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var UNIT_SQUARE_LENGTH = AreaBuilderSharedConstants.UNIT_SQUARE_LENGTH; // In screen coords

  // TODO: Can I consolidate the creator nodes instead of just the shapes?  Seems like it should work, and would make
  // TODO: the creator code much more compact.
  var SQUARE_SHAPE = new Shape()
    .moveTo( 0, 0 )
    .lineTo( UNIT_SQUARE_LENGTH, 0 )
    .lineTo( UNIT_SQUARE_LENGTH, UNIT_SQUARE_LENGTH )
    .lineTo( 0, UNIT_SQUARE_LENGTH )
    .close();
  var HORIZONTAL_DOUBLE_SQUARE_SHAPE = new Shape()
    .moveTo( 0, 0 )
    .lineTo( UNIT_SQUARE_LENGTH * 2, 0 )
    .lineTo( UNIT_SQUARE_LENGTH * 2, UNIT_SQUARE_LENGTH )
    .lineTo( 0, UNIT_SQUARE_LENGTH )
    .close();
  var VERTICAL_DOUBLE_SQUARE_SHAPE = new Shape()
    .moveTo( 0, 0 )
    .lineTo( UNIT_SQUARE_LENGTH, 0 )
    .lineTo( UNIT_SQUARE_LENGTH, UNIT_SQUARE_LENGTH * 2 )
    .lineTo( 0, UNIT_SQUARE_LENGTH * 2 )
    .close();
  var QUAD_SQUARE_SHAPE = new Shape()
    .moveTo( 0, 0 )
    .lineTo( UNIT_SQUARE_LENGTH * 2, 0 )
    .lineTo( UNIT_SQUARE_LENGTH * 2, UNIT_SQUARE_LENGTH * 2 )
    .lineTo( 0, UNIT_SQUARE_LENGTH * 2 )
    .close();
  var RIGHT_BOTTOM_TRIANGLE_SHAPE = new Shape()
    .moveTo( UNIT_SQUARE_LENGTH, 0 )
    .lineTo( UNIT_SQUARE_LENGTH, UNIT_SQUARE_LENGTH )
    .lineTo( 0, UNIT_SQUARE_LENGTH )
    .lineTo( UNIT_SQUARE_LENGTH, 0 )
    .close();

  var SHAPES_FOR_AREA_FINDING_PROBLEMS = [

    // This shape is from the table in the spec for level 1 (as it was on 7/15/2014), looks like an upside down
    // staircase with three steps.
    new PerimeterShape(
      // Exterior perimeters
      [
        [
          Vector2.ZERO,
          new Vector2( UNIT_SQUARE_LENGTH * 6, 0 ),
          new Vector2( UNIT_SQUARE_LENGTH * 6, UNIT_SQUARE_LENGTH * 3 ),
          new Vector2( UNIT_SQUARE_LENGTH * 4, UNIT_SQUARE_LENGTH * 3 ),
          new Vector2( UNIT_SQUARE_LENGTH * 4, UNIT_SQUARE_LENGTH * 2 ),
          new Vector2( UNIT_SQUARE_LENGTH * 2, UNIT_SQUARE_LENGTH * 2 ),
          new Vector2( UNIT_SQUARE_LENGTH * 2, UNIT_SQUARE_LENGTH ),
          new Vector2( 0, UNIT_SQUARE_LENGTH )
        ]
      ],

      // Interior perimeters
      [],

      // Unit size
      UNIT_SQUARE_LENGTH
    ),

    // This shape is from a mockup in the spec (as is was as of 7/22/2014).  It looks like a somewhat stylized 'F',
    // reversed and lying down, with an angular portion.
    new PerimeterShape(
      // Exterior perimeters
      [
        [
          new Vector2( 0, UNIT_SQUARE_LENGTH * 3 ),
          new Vector2( UNIT_SQUARE_LENGTH * 3, UNIT_SQUARE_LENGTH * 3 ),
          new Vector2( UNIT_SQUARE_LENGTH * 3, 0 ),
          new Vector2( UNIT_SQUARE_LENGTH * 4, 0 ),
          new Vector2( UNIT_SQUARE_LENGTH * 4, UNIT_SQUARE_LENGTH * 3 ),
          new Vector2( UNIT_SQUARE_LENGTH * 5, UNIT_SQUARE_LENGTH * 3 ),
          new Vector2( UNIT_SQUARE_LENGTH * 5, 0 ),
          new Vector2( UNIT_SQUARE_LENGTH * 7, 0 ),
          new Vector2( UNIT_SQUARE_LENGTH * 7, UNIT_SQUARE_LENGTH * 3 ),
          new Vector2( UNIT_SQUARE_LENGTH * 5, UNIT_SQUARE_LENGTH * 5 ),
          new Vector2( 0, UNIT_SQUARE_LENGTH * 5 )
        ]
      ],

      // Interior perimeters
      [],

      // Unit size
      UNIT_SQUARE_LENGTH
    )
  ];

  // TODO: This is temporary, eventually these should be algorithmically generated.
  var AREA_AND_PERIMETER_BUILD_SPECS = [
    {
      area: 2,
      perimeter: 6
    },
    {
      area: 4,
      perimeter: 8
    },
    {
      area: 4,
      perimeter: 10
    },
    {
      area: 5,
      perimeter: 10
    },
    {
      area: 5,
      perimeter: 12
    },
    {
      area: 6,
      perimeter: 10
    },
    {
      area: 6,
      perimeter: 12
    }
  ];

  // private functions
  function randomElement( array ) {
    return array[ Math.floor( Math.random() * array.length ) ];
  }

  // Challenge history, used to make sure unique challenges are generated.
//  var challengeHistory = []; commented out for lint, uncomment when ready

  // No constructor - this is a static type with a set of functions.
  return  {

    // @private
    isChallengeUnique: function( challenge ) {
      return true; // TODO: Check uniqueness
    },

    // @private
    generateBuildAreaChallenge: function( model, difficulty ) {
      var challengeIsUnique = false;
      var challenge;
      while ( !challengeIsUnique ) {
        var areaToBuild;
        // TODO: Need info from design team on ranges here.
        switch( difficulty ) {
          case 'easy':
            areaToBuild = Math.floor( Math.random() * 2 ) + 2;
            break;
          case 'moderate':
            areaToBuild = Math.floor( Math.random() * 2 ) + 4;
            break;
          case 'hard':
            areaToBuild = Math.floor( Math.random() * 2 ) + 6;
            break;
          default:
            assert && assert( false, 'Invalid problem difficulty specified.' );
            areaToBuild = 1;
            break;
        }
        challenge = new AreaBuilderGameChallenge(
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
            new ShapeCreatorNode(
              HORIZONTAL_DOUBLE_SQUARE_SHAPE,
              AreaBuilderSharedConstants.GREENISH_COLOR,
              model,
              { gridSpacing: UNIT_SQUARE_LENGTH }
            ),
            new ShapeCreatorNode(
              VERTICAL_DOUBLE_SQUARE_SHAPE,
              AreaBuilderSharedConstants.GREENISH_COLOR,
              model,
              { gridSpacing: UNIT_SQUARE_LENGTH }
            ),
            new ShapeCreatorNode(
              QUAD_SQUARE_SHAPE,
              AreaBuilderSharedConstants.GREENISH_COLOR,
              model,
              { gridSpacing: UNIT_SQUARE_LENGTH }
            )
          ],

          // Build spec, i.e. what the user should try to build, if anything.
          { area: areaToBuild },

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
        challengeIsUnique = this.isChallengeUnique( challenge );
      }
      return challenge;
    },

    generateBuildAreaAndPerimeterChallenge: function( model, difficulty ) {
      var challengeIsUnique = false;
      var challenge;
      while ( !challengeIsUnique ) {
        challenge = new AreaBuilderGameChallenge(
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
            new ShapeCreatorNode(
              HORIZONTAL_DOUBLE_SQUARE_SHAPE,
              AreaBuilderSharedConstants.GREENISH_COLOR,
              model,
              { gridSpacing: UNIT_SQUARE_LENGTH }
            ),
            new ShapeCreatorNode(
              VERTICAL_DOUBLE_SQUARE_SHAPE,
              AreaBuilderSharedConstants.GREENISH_COLOR,
              model,
              { gridSpacing: UNIT_SQUARE_LENGTH }
            ),
            new ShapeCreatorNode(
              QUAD_SQUARE_SHAPE,
              AreaBuilderSharedConstants.GREENISH_COLOR,
              model,
              { gridSpacing: UNIT_SQUARE_LENGTH }
            )
          ],

          // Build spec, i.e. what the user should try to build, if anything.
          randomElement( AREA_AND_PERIMETER_BUILD_SPECS ),

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
        challengeIsUnique = this.isChallengeUnique( challenge );
      }
      return challenge;
    },

    generateFindTheAreaChallenge: function( model, difficulty ) {
      var challengeIsUnique = false;
      var challenge;
      while ( !challengeIsUnique ) {
        challenge = new AreaBuilderGameChallenge(
          // Tool control
          {
            gridControl: true,
            dimensionsControl: true,
            decompositionToolControl: true
          },

          // Keypad visibility flag
          true,

          // Kit contents
          [
            new ShapeCreatorNode(
              SQUARE_SHAPE,
              AreaBuilderSharedConstants.GREENISH_COLOR,
              model
            ),
            new ShapeCreatorNode(
              HORIZONTAL_DOUBLE_SQUARE_SHAPE,
              AreaBuilderSharedConstants.GREENISH_COLOR,
              model,
              { gridSpacing: UNIT_SQUARE_LENGTH }
            ),
            new ShapeCreatorNode(
              VERTICAL_DOUBLE_SQUARE_SHAPE,
              AreaBuilderSharedConstants.GREENISH_COLOR,
              model,
              { gridSpacing: UNIT_SQUARE_LENGTH }
            ),
            new ShapeCreatorNode(
              RIGHT_BOTTOM_TRIANGLE_SHAPE,
              AreaBuilderSharedConstants.GREENISH_COLOR,
              model
            )
          ],

          // Build spec, i.e. what the user should try to build, if anything.
          null,

          // Color prompts
          null,
          null,

          // Background shape
          randomElement( SHAPES_FOR_AREA_FINDING_PROBLEMS ),

          // Check specification, i.e. what gets checked with the user submits their attempt.
          'areaEntered',

          // Flag for whether or not this is a fake challenge TODO remove once game is working
          false
        );
        challengeIsUnique = this.isChallengeUnique( challenge );
      }
      return challenge;
    },

    // @private
    generateChallenge: function( level, difficulty, model ) {
      if ( level === 0 ) {
        return this.generateBuildAreaChallenge( model, difficulty );
      }
      else if ( level === 1 ) {
        return this.generateBuildAreaAndPerimeterChallenge( model, difficulty );
      }
      else if ( level === 2 ) {
        return this.generateFindTheAreaChallenge( model, difficulty );
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

    mapIndexToDifficulty: function( index, numChallenges ) {
      var mappingValue = index % ( numChallenges / 3 );
      return mappingValue === 0 ? 'easy' : mappingValue === 1 ? 'moderate' : 'hard';
    },

    // @public
    generateChallengeSet: function( level, numChallenges, model ) {
      var self = this;
      var challengeSet = [];
      _.times( numChallenges, function( index ) {
        challengeSet.push( self.generateChallenge( level, self.mapIndexToDifficulty( index, numChallenges ), model ) );
      } );
      return challengeSet;
    }
  };
} );