// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var AreaBuilderGameChallenge = require( 'AREA_BUILDER/game/model/AreaBuilderGameChallenge' );
  var PerimeterShape = require( 'AREA_BUILDER/common/model/PerimeterShape' );
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
    ),

    // Basic rectangular shape
    new PerimeterShape(
      // Exterior perimeters
      [
        [
          new Vector2( 0, 0 ),
          new Vector2( UNIT_SQUARE_LENGTH * 6, 0 ),
          new Vector2( UNIT_SQUARE_LENGTH * 6, UNIT_SQUARE_LENGTH * 3 ),
          new Vector2( 0, UNIT_SQUARE_LENGTH * 3 )
        ]
      ],

      // Interior perimeters
      [],

      // Unit size
      UNIT_SQUARE_LENGTH
    ),

    // Thin rectangular shape
    new PerimeterShape(
      // Exterior perimeters
      [
        [
          new Vector2( 0, 0 ),
          new Vector2( UNIT_SQUARE_LENGTH * 10, 0 ),
          new Vector2( UNIT_SQUARE_LENGTH * 10, UNIT_SQUARE_LENGTH ),
          new Vector2( 0, UNIT_SQUARE_LENGTH )
        ]
      ],

      // Interior perimeters
      [],

      // Unit size
      UNIT_SQUARE_LENGTH
    ),

    // Tall rectangular shape
    new PerimeterShape(
      // Exterior perimeters
      [
        [
          new Vector2( 0, 0 ),
          new Vector2( UNIT_SQUARE_LENGTH, 0 ),
          new Vector2( UNIT_SQUARE_LENGTH, UNIT_SQUARE_LENGTH * 6 ),
          new Vector2( 0, UNIT_SQUARE_LENGTH * 6 )
        ]
      ],

      // Interior perimeters
      [],

      // Unit size
      UNIT_SQUARE_LENGTH
    )
  ];

  // Specifications for area-only build challenges.
  var BUILD_AREA_ONLY_SPECS = [
    {
      areaToBuild: 8,
      exampleSolution: [
        {
          cellColumn: 5,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 8,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 5,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 8,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        }
      ]
    },
    {
      areaToBuild: 9,
      exampleSolution: [
        {
          cellColumn: 5,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 5,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 5,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        }
      ]
    },
    {
      areaToBuild: 12,
      exampleSolution: [
        {
          cellColumn: 5,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 8,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 5,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 8,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 5,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 8,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        }
      ]
    },
    {
      areaToBuild: 15,
      exampleSolution: [
        {
          cellColumn: 4,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 5,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 8,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 4,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 5,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 8,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 4,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 5,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 8,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        }
      ]
    },
    {
      areaToBuild: 20,
      exampleSolution: [
        {
          cellColumn: 4,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 5,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 8,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 4,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 5,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 8,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 4,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 5,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 8,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 4,
          cellRow: 6,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 5,
          cellRow: 6,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 6,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 6,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 8,
          cellRow: 6,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        }
      ]
    }
  ];
  var BUILD_AREA_AND_PERIMETER_SPECS = [
    {
      areaToBuild: 9,
      perimeterToBuild: 12,
      exampleSolution: [
        {
          cellColumn: 5,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 5,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 5,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        }
      ]
    },
    {
      areaToBuild: 12,
      perimeterToBuild: 14,
      exampleSolution: [
        {
          cellColumn: 5,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 8,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 5,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 8,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 5,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 8,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        }
      ]
    },
    {
      areaToBuild: 15,
      perimeterToBuild: 16,
      exampleSolution: [
        {
          cellColumn: 4,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 5,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 8,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 4,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 5,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 8,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 4,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 5,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 8,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        }
      ]
    },
    {
      areaToBuild: 20,
      perimeterToBuild: 18,
      exampleSolution: [
        {
          cellColumn: 4,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 5,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 8,
          cellRow: 3,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 4,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 5,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 8,
          cellRow: 4,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 4,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 5,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 8,
          cellRow: 5,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 4,
          cellRow: 6,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 5,
          cellRow: 6,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 6,
          cellRow: 6,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 7,
          cellRow: 6,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        },
        {
          cellColumn: 8,
          cellRow: 6,
          color: AreaBuilderSharedConstants.GREENISH_COLOR
        }
      ]
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

      // Create the shape kit used for these challenges.
      var buildItShapeKit = [
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
      ];

      // Create a unique challenge
      var challengeIsUnique = false;
      var challenge;
      while ( !challengeIsUnique ) {
        var areaToBuild;
        // TODO: This is temporary, eventually these challenges should be algorithmically generated.
        // TODO: Also, difficulty is ignored.
        var spec = randomElement( BUILD_AREA_ONLY_SPECS );
        challenge = AreaBuilderGameChallenge.createBuildAreaChallenge( spec.areaToBuild, buildItShapeKit, spec.exampleSolution );
        challengeIsUnique = this.isChallengeUnique( challenge );
      }
      return challenge;
    },

    generateBuildAreaAndPerimeterChallenge: function( model, difficulty ) {
      // Create the shape kit used for these challenges.
      var buildItShapeKit = [
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
      ];

      // Create a unique challenge
      var challengeIsUnique = false;
      var challenge;
      while ( !challengeIsUnique ) {
        var areaToBuild;
        // TODO: This is temporary, eventually these challenges should be algorithmically generated.
        // TODO: Also, difficulty is ignored.
        var spec = randomElement( BUILD_AREA_AND_PERIMETER_SPECS );
        challenge = AreaBuilderGameChallenge.createBuildAreaAndPerimeterChallenge( spec.areaToBuild, spec.perimeterToBuild, buildItShapeKit, spec.exampleSolution );
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

          // Example solution for 'build it' style challenges
          null,

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