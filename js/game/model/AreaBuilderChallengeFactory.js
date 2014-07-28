// Copyright 2002-2014, University of Colorado Boulder

/**
 * A factory object that creates the challenges for the Area Builder game.
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var AreaBuilderGameChallenge = require( 'AREA_BUILDER/game/model/AreaBuilderGameChallenge' );
  var AreaBuilderGameModel = require( 'AREA_BUILDER/game/model/AreaBuilderGameModel' );
  var PerimeterShape = require( 'AREA_BUILDER/common/model/PerimeterShape' );
  var Shape = require( 'KITE/Shape' );
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

  var BASIC_SHAPE_KIT = [
    {
      shape: SQUARE_SHAPE,
      color: AreaBuilderSharedConstants.GREENISH_COLOR
    },
    {
      shape: HORIZONTAL_DOUBLE_SQUARE_SHAPE,
      color: AreaBuilderSharedConstants.GREENISH_COLOR
    },
    {
      shape: VERTICAL_DOUBLE_SQUARE_SHAPE,
      color: AreaBuilderSharedConstants.GREENISH_COLOR
    },
    {
      shape: QUAD_SQUARE_SHAPE,
      color: AreaBuilderSharedConstants.GREENISH_COLOR
    }
  ];

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

    // Basic rectangular shape
    new PerimeterShape(
      // Exterior perimeters
      [
        [
          new Vector2( 0, 0 ),
          new Vector2( UNIT_SQUARE_LENGTH * 5, 0 ),
          new Vector2( UNIT_SQUARE_LENGTH * 5, UNIT_SQUARE_LENGTH * 4 ),
          new Vector2( 0, UNIT_SQUARE_LENGTH * 4 )
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

  // -------------- private functions ---------------------------

  // Select a random element from an array
  function randomElement( array ) {
    return array[ Math.floor( Math.random() * array.length ) ];
  }

  // Create a solution spec (a.k.a. an example solution) that represents a rectangle with the specified orign and size.
  function createRectangularSolutionSpec( x, y, width, height, color ) {
    var solutionSpec = [];
    for ( var column = 0; column < width; column++ ) {
      for ( var row = 0; row < height; row++ ) {
        solutionSpec.push( {
          cellColumn: column + x,
          cellRow: row + y,
          color: color
        } );
      }
    }
    return solutionSpec;
  }

  function createRectangularPerimeterShape( x, y, width, height ) {
    return new PerimeterShape(
      // Exterior perimeters
      [
        [
          new Vector2( x, y ),
          new Vector2( x + width, y ),
          new Vector2( x + width, y + height ),
          new Vector2( x, y + height )
        ]
      ],

      // Interior perimeters
      [],

      // Unit size
      UNIT_SQUARE_LENGTH
    );
  }

  function createLShapedPerimeterShape( x, y, width, height, missingCorner, widthMissing, heightMissing ) {
    assert( width > widthMissing && height > heightMissing, 'Invalid parameters' );

    var exteriorPerimeter = [
      new Vector2(), new Vector2(), new Vector2(), new Vector2(), new Vector2(), new Vector2()
    ];

    switch( missingCorner ) {

      case 'leftTop':
        exteriorPerimeter[ 0 ].setXY( x + widthMissing, y );
        exteriorPerimeter[ 1 ].setXY( x + width, y );
        exteriorPerimeter[ 2 ].setXY( x + width, y + height );
        exteriorPerimeter[ 3 ].setXY( x, y + height );
        exteriorPerimeter[ 4 ].setXY( x, y + heightMissing );
        exteriorPerimeter[ 5 ].setXY( x + widthMissing, y + heightMissing );
        break;

      case 'rightTop':
        exteriorPerimeter[ 0 ].setXY( x, y );
        exteriorPerimeter[ 1 ].setXY( x + width - widthMissing, y );
        exteriorPerimeter[ 2 ].setXY( x + width - widthMissing, y + heightMissing );
        exteriorPerimeter[ 3 ].setXY( x + width, y + heightMissing );
        exteriorPerimeter[ 4 ].setXY( x + width, y + height );
        exteriorPerimeter[ 5 ].setXY( x, y + height );
        break;

      case 'leftBottom':
        exteriorPerimeter[ 0 ].setXY( x, y );
        exteriorPerimeter[ 1 ].setXY( x + width, y );
        exteriorPerimeter[ 2 ].setXY( x + width, y + heightMissing );
        exteriorPerimeter[ 3 ].setXY( x + widthMissing, y + heightMissing );
        exteriorPerimeter[ 4 ].setXY( x + widthMissing, y + height );
        exteriorPerimeter[ 5 ].setXY( x, y + height );
        break;

      case 'rightBottom':
        exteriorPerimeter[ 0 ].setXY( x, y );
        exteriorPerimeter[ 1 ].setXY( x + width, y );
        exteriorPerimeter[ 2 ].setXY( x + width, y + height );
        exteriorPerimeter[ 3 ].setXY( x + widthMissing, y + height );
        exteriorPerimeter[ 4 ].setXY( x + widthMissing, y + heightMissing );
        exteriorPerimeter[ 5 ].setXY( x, y + heightMissing );
        break;

      default:
        assert && assert( false, 'Unrecognized value for specifying L-shape' );
        break;
    }

    return new PerimeterShape( [ exteriorPerimeter ], [], UNIT_SQUARE_LENGTH );
  }

  // @private
  function isChallengeUnique( challenge ) {
    var challengeIsUnique = true;
    for ( var i = 0; i < challengeHistory.length; i++ ) {
      if ( challenge.basicallyEquals( challengeHistory[ i ] ) ) {
        challengeIsUnique = false;
        break;
      }
    }
    return challengeIsUnique;
  }

  function generateBuildAreaChallenge( difficulty ) {

    // Create a unique challenge
    var challengeIsUnique = false;
    var challenge;
    while ( !challengeIsUnique ) {
      // TODO: Only generates rectangular challenges at this point.
      // TODO: Also, difficulty is ignored.
      var width = _.random( 2, AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 2 );
      var height = 0;
      while ( width * height < 8 || width * height > 36 ) {
        height = _.random( AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 2 );
      }
      var exampleSolution = createRectangularSolutionSpec(
        Math.floor( ( AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - width ) / 2 ),
        Math.floor( ( AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - height ) / 2 ),
        width,
        height,
        AreaBuilderSharedConstants.GREENISH_COLOR
      );
      challenge = AreaBuilderGameChallenge.createBuildAreaChallenge( width * height, BASIC_SHAPE_KIT, exampleSolution );
      challengeIsUnique = isChallengeUnique( challenge );
    }
    return challenge;
  }

  /**
   * Generate a 'build it' area+perimeter challenge that consists of two connected rectangles.  See the design spec
   * for details.
   *
   * @private
   */
  function generateTwoRectangleBuildAreaAndPerimeterChallenge() {

    // Create first rectangle dimensions
    var width1 = _.random( 2, 6 );
    var height1;
    do {
      height1 = _.random( 1, 4 );
    } while ( width1 % 2 === height1 % 2 );

    // Create second rectangle dimensions
    do {
      var width2 = _.random( 1, 6 );
    } while ( width1 + width2 > AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 2 );
    var height2;
    do {
      height2 = _.random( 1, 6 );
    } while ( width2 % 2 === height2 % 2 || height1 + height2 > AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 2 );

    // Choose the amount of overlap
    var overlap = _.random( 1, Math.min( width1, width2 ) - 1 );

    var left = Math.floor( ( AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - ( width1 + width2 - overlap ) ) / 2 );
    var top = Math.floor( ( AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - ( height1 + height2 ) ) / 2 );

    // Create a solution spec by merging specs for each of the rectangles together.
    var solutionSpec = createRectangularSolutionSpec( left, top, width1, height1, AreaBuilderSharedConstants.GREENISH_COLOR );
    solutionSpec = createRectangularSolutionSpec( left, top, width1, height1, AreaBuilderSharedConstants.GREENISH_COLOR ).concat(
      createRectangularSolutionSpec( left + width1 - overlap, top + height1, width2, height2, AreaBuilderSharedConstants.GREENISH_COLOR ) );

    return( AreaBuilderGameChallenge.createBuildAreaAndPerimeterChallenge( width1 * height1 + width2 * height2,
        2 * width1 + 2 * height1 + 2 * width2 + 2 * height2 - 2 * overlap, BASIC_SHAPE_KIT, solutionSpec ) );
  }

  function generateBuildAreaAndPerimeterChallenge( difficulty ) {

    // Create a unique challenge
    var challengeIsUnique = false;
    var challenge;
    while ( !challengeIsUnique ) {
      // TODO: Only generates rectangular challenges at this point.
      // TODO: Also, difficulty is ignored.

      var width = 0;
      var height = 0;

      // Width can be any value from 3 to 8 excluding 7, see design doc.
      while ( width === 0 || width === 7 ) {
        width = _.random( 3, 8 );
      }

      // Choose the height based on the total area.
      while ( width * height < 12 || width * height > 36 || height === 7 ) {
        height = _.random( 3, 8 );
      }

      var exampleSolution = createRectangularSolutionSpec(
        Math.floor( ( AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - width ) / 2 ),
        Math.floor( ( AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - height ) / 2 ),
        width,
        height,
        AreaBuilderSharedConstants.GREENISH_COLOR
      );
      challenge = AreaBuilderGameChallenge.createBuildAreaAndPerimeterChallenge( width * height,
          2 * width + 2 * height, BASIC_SHAPE_KIT, exampleSolution );
      challengeIsUnique = isChallengeUnique( challenge );
    }
    return challenge;
  }

  function generateRectangularFindAreaChallenge( difficulty ) {
    do {
      var width = _.random( 2, AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 4 );
      var height = _.random( 2, AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 4 );
    } while ( width * height < 16 || width * height > 36 );
    var perimeterShape = createRectangularPerimeterShape( 0, 0, width * UNIT_SQUARE_LENGTH, height * UNIT_SQUARE_LENGTH );

    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, BASIC_SHAPE_KIT );
  }

  function generateLShapedFindAreaChallenge( difficulty ) {

    do {
      var width = _.random( 2, AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 4 );
      var height = _.random( 2, AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 4 );
    } while ( width * height < 16 || width * height > 36 );
    var missingWidth = _.random( 1, width - 1 );
    var missingHeight = _.random( 1, height - 1 );
    var missingCorner = randomElement( ['leftTop', 'rightTop', 'leftBottom', 'rightBottom' ] );
    var perimeterShape = createLShapedPerimeterShape( 0, 0, width * UNIT_SQUARE_LENGTH, height * UNIT_SQUARE_LENGTH,
      missingCorner, missingWidth * UNIT_SQUARE_LENGTH, missingHeight * UNIT_SQUARE_LENGTH );

    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, BASIC_SHAPE_KIT );
  }


  function generateFindTheAreaChallenge( difficulty ) {

    var challengeIsUnique = false;
    var challenge;
    while ( !challengeIsUnique ) {
      challenge = generateLShapedFindAreaChallenge( difficulty );
      challengeIsUnique = isChallengeUnique( challenge );
    }
    return challenge;
  }

  function mapIndexToDifficulty( index, numChallenges ) {
    var mappingValue = index % ( numChallenges / 3 );
    return mappingValue === 0 ? 'easy' : mappingValue === 1 ? 'moderate' : 'hard';
  }

  function generateChallenge( level, difficulty ) {
    var challenge;
    if ( level === 0 ) {
      challenge = generateBuildAreaChallenge( difficulty );
    }
    else if ( level === 1 ) {
      challenge = generateBuildAreaAndPerimeterChallenge( difficulty );
    }
    else if ( level === 2 ) {
      challenge = generateFindTheAreaChallenge( difficulty );
    }
    else if ( level === 3 ) {
      challenge = generateTwoRectangleBuildAreaAndPerimeterChallenge( difficulty );
    }
    else {
      // Create a fake challenge for the other levels.
      challenge = new AreaBuilderGameChallenge(
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
    challengeHistory.push( challenge );
    return challenge;
  }

// Challenge history, used to make sure unique challenges are generated.
  var challengeHistory = [];

// No constructor - this is a static type.
  return  {

    /**
     * Generate a set of challenges for the given game level.
     *
     * @public
     * @param level
     * @param numChallenges
     * @param model
     * @returns {Array}
     */
    generateChallengeSet: function( level, numChallenges ) {
      challengeHistory = []; // TODO: This is temporary until more challenges are created, then it should be cleared 1/2 at a time when having trouble creating unique challenges.
      var self = this;
      var challengeSet = [];
      _.times( numChallenges, function( index ) {
        challengeSet.push( generateChallenge( level, mapIndexToDifficulty( index, numChallenges ) ) );
      } );
      return challengeSet;
    }
  };
} )
;