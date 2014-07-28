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

  function flipPerimeterPointsHorizontally( perimeterPointList ) {
    var reflectedPoints = [];
    var minX = Number.POSITIVE_INFINITY;
    var maxX = Number.NEGATIVE_INFINITY;
    perimeterPointList.forEach( function( point ) {
      minX = Math.min( point.x, minX );
      maxX = Math.max( point.x, maxX );
    } );
    perimeterPointList.forEach( function( point ) {
      reflectedPoints.push( new Vector2( -1 * ( point.x - minX - maxX ), point.y ) );
    } );
    return reflectedPoints;
  }

  function flipPerimeterPointsVertically( perimeterPointList ) {
    var reflectedPoints = [];
    var minY = Number.POSITIVE_INFINITY;
    var maxY = Number.NEGATIVE_INFINITY;
    perimeterPointList.forEach( function( point ) {
      minY = Math.min( point.y, minY );
      maxY = Math.max( point.y, maxY );
    } );
    perimeterPointList.forEach( function( point ) {
      reflectedPoints.push( new Vector2( point.x, -1 * ( point.y - minY - maxY ) ) );
    } );
    return reflectedPoints;
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

    var perimeterPoints = [
      new Vector2( x + widthMissing, y ),
      new Vector2( x + width, y ),
      new Vector2( x + width, y + height ),
      new Vector2( x, y + height ),
      new Vector2( x, y + heightMissing ),
      new Vector2( x + widthMissing, y + heightMissing )
    ];

    if ( missingCorner === 'rightTop' || missingCorner === 'rightBottom' ) {
      perimeterPoints = flipPerimeterPointsHorizontally( perimeterPoints );
    }
    if ( missingCorner === 'leftBottom' || missingCorner === 'rightBottom' ) {
      perimeterPoints = flipPerimeterPointsVertically( perimeterPoints );
    }

    return new PerimeterShape( [ perimeterPoints ], [], UNIT_SQUARE_LENGTH );
  }

  // @private Create a perimeter shape with a cutout in the top, bottom, left, or right side.
  function createUShapedPerimeterShape( x, y, width, height, sideWithCutout, cutoutWidth, cutoutHeight, cutoutOffset ) {
    var perimeterPoints = [ new Vector2(), new Vector2(), new Vector2(), new Vector2(), new Vector2(), new Vector2(), new Vector2(), new Vector2() ];

    if ( sideWithCutout === 'left' || sideWithCutout === 'right' ) {
      perimeterPoints[ 0 ].setXY( x, y );
      perimeterPoints[ 1 ].setXY( x + width, y );
      perimeterPoints[ 2 ].setXY( x + width, y + height );
      perimeterPoints[ 3 ].setXY( x, y + height );
      perimeterPoints[ 4 ].setXY( x, y + cutoutOffset + cutoutHeight );
      perimeterPoints[ 5 ].setXY( x + cutoutWidth, y + cutoutOffset + cutoutHeight );
      perimeterPoints[ 6 ].setXY( x + cutoutWidth, y + cutoutOffset );
      perimeterPoints[ 7 ].setXY( x, y + cutoutOffset );
      if ( sideWithCutout === 'right' ) {
        perimeterPoints = flipPerimeterPointsHorizontally( perimeterPoints );
      }
    }
    else {
      perimeterPoints[ 0 ].setXY( x, y );
      perimeterPoints[ 1 ].setXY( x + cutoutOffset, y );
      perimeterPoints[ 2 ].setXY( x + cutoutOffset, y + cutoutHeight );
      perimeterPoints[ 3 ].setXY( x + cutoutOffset + cutoutWidth, y + cutoutHeight );
      perimeterPoints[ 4 ].setXY( x + cutoutOffset + cutoutWidth, y );
      perimeterPoints[ 5 ].setXY( x + width, y );
      perimeterPoints[ 6 ].setXY( x + width, y + height );
      perimeterPoints[ 7 ].setXY( x, y + height );
      if ( sideWithCutout === 'bottom' ) {
        perimeterPoints = flipPerimeterPointsVertically( perimeterPoints );
      }
    }

    return new PerimeterShape( [ perimeterPoints ], [], UNIT_SQUARE_LENGTH );
  }

  function createPerimeterShapeWithHole( x, y, width, height, holeWidth, holeHeight, holeXOffset, holeYOffset ) {
    var exteriorPerimeterPoints = [
      new Vector2( x, y ),
      new Vector2( x + width, y ),
      new Vector2( x + width, y + height ),
      new Vector2( x, y + height )
    ];
    var interiorPerimeterPoints = [
      // Have to draw hole in opposite direction for it to appear.
      new Vector2( x + holeXOffset, y + holeYOffset ),
      new Vector2( x + holeXOffset, y + holeYOffset + holeHeight ),
      new Vector2( x + holeXOffset + holeWidth, y + holeYOffset + holeHeight ),
      new Vector2( x + holeXOffset + holeWidth, y + holeYOffset )
    ];

    return new PerimeterShape( [ exteriorPerimeterPoints ], [ interiorPerimeterPoints ], UNIT_SQUARE_LENGTH );
  }

  function createPerimeterShapeRightIsoscelesTriangle( x, y, edgeLength, cornerPosition ) {
    var perimeterPoints = [ new Vector2( x, y ), new Vector2( x + edgeLength, y ), new Vector2( x, y + edgeLength ) ];
    if ( cornerPosition === 'rightTop' || cornerPosition === 'rightBottom' ) {
      perimeterPoints = flipPerimeterPointsHorizontally( perimeterPoints );
    }
    if ( cornerPosition === 'leftBottom' || cornerPosition === 'rightBottom' ) {
      perimeterPoints = flipPerimeterPointsVertically( perimeterPoints );
    }

    return new PerimeterShape( [ perimeterPoints ], [], UNIT_SQUARE_LENGTH );
  }

  function createShapeWithDiagonalAndMissingCorner( x, y, width, height, diagonalPosition, diagonalSquareLength, cutWidth, cutHeight ) {
    assert && assert( width - diagonalSquareLength >= cutWidth && height - diagonalSquareLength >= cutHeight, 'Invalid parameters' );

    var perimeterPoints = [];
    // Start in upper right corner of unrotated shape.
    perimeterPoints.push( new Vector2( x + width, y ) );
    perimeterPoints.push( new Vector2( x + width, y + height - diagonalSquareLength ) );
    perimeterPoints.push( new Vector2( x + width - diagonalSquareLength, y + height ) );
    perimeterPoints.push( new Vector2( x, y + height ) );
    perimeterPoints.push( new Vector2( x, y + cutHeight ) );
    perimeterPoints.push( new Vector2( x + cutWidth, y + cutHeight ) );
    perimeterPoints.push( new Vector2( x + cutWidth, y ) );

    if ( diagonalPosition === 'leftTop' || diagonalPosition === 'leftBottom' ) {
      perimeterPoints = flipPerimeterPointsHorizontally( perimeterPoints );
    }
    if ( diagonalPosition === 'rightTop' || diagonalPosition === 'leftTop' ) {
      perimeterPoints = flipPerimeterPointsVertically( perimeterPoints );
    }

    return new PerimeterShape( [ perimeterPoints ], [], UNIT_SQUARE_LENGTH );
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

  function generateBuildAreaChallenge() {

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

  function generateBuildAreaAndPerimeterChallenge() {

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

  function generateRectangularFindAreaChallenge() {
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

  function generateUShapedFindAreaChallenge( difficulty ) {
    do {
      var width = _.random( 4, AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 4 );
      var height = _.random( 4, AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 2 );
    } while ( width * height < 16 || width * height > 36 );
    var sideWithCutout = randomElement( ['left', 'right', 'top', 'bottom' ] );
    var cutoutWidth, cutoutHeight, cutoutOffset;
    if ( sideWithCutout === 'left' || sideWithCutout === 'right' ) {
      cutoutWidth = _.random( 2, width - 1 );
      cutoutHeight = _.random( 1, height - 2 );
      cutoutOffset = _.random( 1, height - cutoutHeight - 1 );
    }
    else {
      cutoutWidth = _.random( 1, width - 2 );
      cutoutHeight = _.random( 2, height - 1 );
      cutoutOffset = _.random( 1, width - cutoutWidth - 1 );
    }
    var perimeterShape = createUShapedPerimeterShape( 0, 0, width * UNIT_SQUARE_LENGTH, height * UNIT_SQUARE_LENGTH,
      sideWithCutout, cutoutWidth * UNIT_SQUARE_LENGTH, cutoutHeight * UNIT_SQUARE_LENGTH, cutoutOffset * UNIT_SQUARE_LENGTH );

    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, BASIC_SHAPE_KIT );
  }

  function generateOShapedFindAreaChallenge( difficulty ) {
    do {
      var width = _.random( 3, AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 4 );
      var height = _.random( 3, AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 2 );
    } while ( width * height < 16 || width * height > 36 );
    var holeWidth = _.random( 1, width - 2 );
    var holeHeight = _.random( 1, height - 2 );
    var holeXOffset = _.random( 1, width - holeWidth - 1 );
    var holeYOffset = _.random( 1, height - holeHeight - 1 );
    var perimeterShape = createPerimeterShapeWithHole( 0, 0, width * UNIT_SQUARE_LENGTH, height * UNIT_SQUARE_LENGTH,
        holeWidth * UNIT_SQUARE_LENGTH, holeHeight * UNIT_SQUARE_LENGTH, holeXOffset * UNIT_SQUARE_LENGTH,
        holeYOffset * UNIT_SQUARE_LENGTH );

    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, BASIC_SHAPE_KIT );
  }

  function generateIsoscelesRightTriangleFindAreaChallenge( difficulty ) {
    var cornerPosition = randomElement( ['leftTop', 'rightTop', 'leftBottom', 'rightBottom' ] );
    var edgeLength = 0;
    do {
      edgeLength = _.random( 3, Math.min( AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 2,
          AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 2 ) );
    } while ( edgeLength % 2 !== 0 );

    var perimeterShape = createPerimeterShapeRightIsoscelesTriangle( 0, 0, edgeLength * UNIT_SQUARE_LENGTH, cornerPosition );

    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, BASIC_SHAPE_KIT );
  }

  function generateLargeRectWithChipMissingChallenge( difficulty ) {
    var width = _.random( AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 4, AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 2 );
    var height = _.random( AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 3, AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 2 );
    var sideWithCutout = randomElement( ['left', 'right', 'top', 'bottom' ] );
    var cutoutWidth, cutoutHeight, cutoutOffset;
    if ( sideWithCutout === 'left' || sideWithCutout === 'right' ) {
      cutoutWidth = 1;
      cutoutHeight = _.random( 1, 3 );
      cutoutOffset = _.random( 1, height - cutoutHeight - 1 );
    }
    else {
      cutoutWidth = _.random( 1, 3 );
      cutoutHeight = 1;
      cutoutOffset = _.random( 1, width - cutoutWidth - 1 );
    }
    var perimeterShape = createUShapedPerimeterShape( 0, 0, width * UNIT_SQUARE_LENGTH, height * UNIT_SQUARE_LENGTH,
      sideWithCutout, cutoutWidth * UNIT_SQUARE_LENGTH, cutoutHeight * UNIT_SQUARE_LENGTH, cutoutOffset * UNIT_SQUARE_LENGTH );

    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, BASIC_SHAPE_KIT );
  }

  function generateShapeWithDiagonalFindAreaChallenge( difficulty ) {
    var width = _.random( 3, AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 4 );
    var height = _.random( 3, AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 4 );
    var diagonalPosition = randomElement( ['leftTop', 'rightTop', 'leftBottom', 'rightBottom' ] );
    var diagonalSquareLength = 2;
    if ( height > 4 && width > 4 && Math.random() > 0.5 ) {
      diagonalSquareLength = 4;
    }
    var cutWidth = _.random( 0, width - diagonalSquareLength );
    var cutHeight = _.random( 0, height - diagonalSquareLength );

    var perimeterShape = createShapeWithDiagonalAndMissingCorner( 0, 0, width * UNIT_SQUARE_LENGTH,
        height * UNIT_SQUARE_LENGTH, diagonalPosition, diagonalSquareLength * UNIT_SQUARE_LENGTH,
        cutWidth * UNIT_SQUARE_LENGTH, cutHeight * UNIT_SQUARE_LENGTH );

    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, BASIC_SHAPE_KIT );
  }

  function generateFindTheAreaChallenge( difficulty ) {

    var challengeIsUnique = false;
    var challenge;
    while ( !challengeIsUnique ) {
      challenge = generateLShapedFindAreaChallenge( difficulty );
//      challenge = generateUShapedFindAreaChallenge( difficulty );
//      challenge = generateOShapedFindAreaChallenge( difficulty );
//      challenge = generateIsoscelesRightTriangleFindAreaChallenge( difficulty );
//      challenge = generateLargeRectWithChipMissingChallenge( difficulty );
//      challenge = generateShapeWithDiagonalFindAreaChallenge( difficulty );
      challengeIsUnique = isChallengeUnique( challenge );
    }
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
     * @returns {Array}
     */
    generateChallengeSet: function( level, numChallenges ) {
      challengeHistory = []; // TODO: This reset of the history array is temporary until more challenges are created, then it should be cleared 1/2 at a time when having trouble creating unique challenges.
      var challengeSet = [];
      switch( level ) {
        case 0:
          _.times( 3, function() { challengeSet.push( generateBuildAreaChallenge() ) } );
          _.times( 2, function() { challengeSet.push( generateRectangularFindAreaChallenge() ) } );
          challengeSet.push( generateLShapedFindAreaChallenge() );
          challengeSet = _.shuffle( challengeSet );
          break;

        case 1:
          _.times( 3, function() { challengeSet.push( generateBuildAreaAndPerimeterChallenge() ) } );
          _.times( 3, function() { challengeSet.push( generateTwoRectangleBuildAreaAndPerimeterChallenge() ) } );
          break;

        case 2:
          challengeSet.push( generateUShapedFindAreaChallenge() );
          challengeSet.push( generateOShapedFindAreaChallenge() );
          challengeSet.push( generateShapeWithDiagonalFindAreaChallenge() );
          challengeSet = _.shuffle( challengeSet );
          _.times( 2, function() { challengeSet.push( generateIsoscelesRightTriangleFindAreaChallenge() ) } );
          challengeSet.push( generateLargeRectWithChipMissingChallenge() );
          break;

        case 3:
          challengeSet.push( generateUShapedFindAreaChallenge() );
          challengeSet.push( generateOShapedFindAreaChallenge() );
          challengeSet.push( generateOShapedFindAreaChallenge() );
          challengeSet.push( generateShapeWithDiagonalFindAreaChallenge() );
          challengeSet = _.shuffle( challengeSet );
          // For the next challenge, choose randomly from the shapes that don't have diagonals.
          var genFunction = randomElement( [ generateLShapedFindAreaChallenge, generateUShapedFindAreaChallenge ] );
          challengeSet.push( genFunction() );
          challengeSet.push( generateShapeWithDiagonalFindAreaChallenge() );
          break;

        case 4:
          _.times( numChallenges, function() { challengeSet.push( AreaBuilderGameChallenge.createFakeChallenge() ) } );
          break;

      }
      assert && assert( challengeSet.length === numChallenges, 'Error: Didn\'t generate correct number of challenges.' );
      return challengeSet;
    }
  };
} )
;