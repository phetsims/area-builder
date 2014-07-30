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
  var LEFT_BOTTOM_TRIANGLE_SHAPE = new Shape()
    .moveTo( 0, 0 )
    .lineTo( UNIT_SQUARE_LENGTH, UNIT_SQUARE_LENGTH )
    .lineTo( 0, UNIT_SQUARE_LENGTH )
    .lineTo( 0, 0 )
    .close();
  var RIGHT_TOP_TRIANGLE_SHAPE = new Shape()
    .moveTo( 0, 0 )
    .lineTo( UNIT_SQUARE_LENGTH, 0 )
    .lineTo( UNIT_SQUARE_LENGTH, UNIT_SQUARE_LENGTH )
    .lineTo( 0, 0 )
    .close();
  var LEFT_TOP_TRIANGLE_SHAPE = new Shape()
    .moveTo( 0, 0 )
    .lineTo( UNIT_SQUARE_LENGTH, 0 )
    .lineTo( 0, UNIT_SQUARE_LENGTH )
    .lineTo( 0, 0 )
    .close();

  var BASIC_RECTANGLES_SHAPE_KIT = [
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

  var UNIT_SQUARE_ONLY_SHAPE_KIT = [
    {
      shape: SQUARE_SHAPE,
      color: AreaBuilderSharedConstants.GREENISH_COLOR
    }
  ];

  var RECTANGLES_AND_TRIANGLES_SHAPE_KIT = [
    {
      shape: HORIZONTAL_DOUBLE_SQUARE_SHAPE,
      color: AreaBuilderSharedConstants.GREENISH_COLOR
    },
    {
      shape: SQUARE_SHAPE,
      color: AreaBuilderSharedConstants.GREENISH_COLOR
    },
    {
      shape: VERTICAL_DOUBLE_SQUARE_SHAPE,
      color: AreaBuilderSharedConstants.GREENISH_COLOR
    },
    {
      shape: LEFT_BOTTOM_TRIANGLE_SHAPE,
      color: AreaBuilderSharedConstants.GREENISH_COLOR
    },
    {
      shape: LEFT_TOP_TRIANGLE_SHAPE,
      color: AreaBuilderSharedConstants.GREENISH_COLOR
    },
    {
      shape: RIGHT_BOTTOM_TRIANGLE_SHAPE,
      color: AreaBuilderSharedConstants.GREENISH_COLOR
    },
    {
      shape: RIGHT_TOP_TRIANGLE_SHAPE,
      color: AreaBuilderSharedConstants.GREENISH_COLOR
    }
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
    assert && assert( width > widthMissing && height > heightMissing, 'Invalid parameters' );

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

  function createPerimeterShapeSlantedHypotenuseRightIsoscelesTriangle( x, y, edgeLength, cornerPosition ) {
    var perimeterPoints = [ new Vector2( x, y ), new Vector2( x + edgeLength, y ), new Vector2( x, y + edgeLength ) ];
    if ( cornerPosition === 'rightTop' || cornerPosition === 'rightBottom' ) {
      perimeterPoints = flipPerimeterPointsHorizontally( perimeterPoints );
    }
    if ( cornerPosition === 'leftBottom' || cornerPosition === 'rightBottom' ) {
      perimeterPoints = flipPerimeterPointsVertically( perimeterPoints );
    }

    return new PerimeterShape( [ perimeterPoints ], [], UNIT_SQUARE_LENGTH );
  }

  function createPerimeterShapeLevelHypotenuseRightIsoscelesTriangle( x, y, hypotenuseLength, cornerPosition ) {
    var perimeterPoints;
    if ( cornerPosition === 'centerTop' || cornerPosition === 'centerBottom' ) {
      perimeterPoints = [ new Vector2( x, y ), new Vector2( x + hypotenuseLength, y ),
        new Vector2( x + hypotenuseLength / 2, y + hypotenuseLength / 2 ) ];
      if ( cornerPosition === 'centerBottom' ) {
        perimeterPoints = flipPerimeterPointsVertically( perimeterPoints );
      }
    }
    else {
      perimeterPoints = [ new Vector2( x, y ), new Vector2( x, y + hypotenuseLength ),
        new Vector2( x + hypotenuseLength / 2, y + hypotenuseLength / 2 ) ];
      if ( cornerPosition === 'centerLeft' ) {
        perimeterPoints = flipPerimeterPointsHorizontally( perimeterPoints );
      }
    }

    // Reflect as appropriate to create the specified orientation.
    if ( cornerPosition === 'centerTop' || cornerPosition === 'rightBottom' ) {
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
    // Draw shape with diagonal in lower right corner, starting in upper right corner.
    perimeterPoints.push( new Vector2( x + width, y ) );
    perimeterPoints.push( new Vector2( x + width, y + height - diagonalSquareLength ) );
    perimeterPoints.push( new Vector2( x + width - diagonalSquareLength, y + height ) );
    perimeterPoints.push( new Vector2( x, y + height ) );
    perimeterPoints.push( new Vector2( x, y + cutHeight ) );
    perimeterPoints.push( new Vector2( x + cutWidth, y + cutHeight ) );
    perimeterPoints.push( new Vector2( x + cutWidth, y ) );

    // Reflect shape as needed to meet the specified orientation.
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
      challenge = AreaBuilderGameChallenge.createBuildAreaChallenge( width * height, BASIC_RECTANGLES_SHAPE_KIT, exampleSolution );
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
    var width2 = 0;
    do {
      width2 = _.random( 1, 6 );
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
        2 * width1 + 2 * height1 + 2 * width2 + 2 * height2 - 2 * overlap, BASIC_RECTANGLES_SHAPE_KIT, solutionSpec ) );
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
          2 * width + 2 * height, BASIC_RECTANGLES_SHAPE_KIT, exampleSolution );
      challengeIsUnique = isChallengeUnique( challenge );
    }
    return challenge;
  }

  function generateRectangularFindAreaChallenge() {
    var width, height;
    do {
      width = _.random( 2, AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 4 );
      height = _.random( 2, AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 4 );
    } while ( width * height < 16 || width * height > 36 );
    var perimeterShape = createRectangularPerimeterShape( 0, 0, width * UNIT_SQUARE_LENGTH, height * UNIT_SQUARE_LENGTH );

    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, BASIC_RECTANGLES_SHAPE_KIT );
  }

  function generateLShapedFindAreaChallenge() {
    var width, height;
    do {
      width = _.random( 2, AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 4 );
      height = _.random( 2, AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 4 );
    } while ( width * height < 16 || width * height > 36 );
    var missingWidth = _.random( 1, width - 1 );
    var missingHeight = _.random( 1, height - 1 );
    var missingCorner = randomElement( ['leftTop', 'rightTop', 'leftBottom', 'rightBottom' ] );
    var perimeterShape = createLShapedPerimeterShape( 0, 0, width * UNIT_SQUARE_LENGTH, height * UNIT_SQUARE_LENGTH,
      missingCorner, missingWidth * UNIT_SQUARE_LENGTH, missingHeight * UNIT_SQUARE_LENGTH );

    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, BASIC_RECTANGLES_SHAPE_KIT );
  }

  function generateUShapedFindAreaChallenge() {
    var width, height;
    do {
      width = _.random( 4, AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 4 );
      height = _.random( 4, AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 2 );
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

    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, BASIC_RECTANGLES_SHAPE_KIT );
  }

  function generateOShapedFindAreaChallenge() {
    var width, height;
    do {
      width = _.random( 3, AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 4 );
      height = _.random( 3, AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 2 );
    } while ( width * height < 16 || width * height > 36 );
    var holeWidth = _.random( 1, width - 2 );
    var holeHeight = _.random( 1, height - 2 );
    var holeXOffset = _.random( 1, width - holeWidth - 1 );
    var holeYOffset = _.random( 1, height - holeHeight - 1 );
    var perimeterShape = createPerimeterShapeWithHole( 0, 0, width * UNIT_SQUARE_LENGTH, height * UNIT_SQUARE_LENGTH,
        holeWidth * UNIT_SQUARE_LENGTH, holeHeight * UNIT_SQUARE_LENGTH, holeXOffset * UNIT_SQUARE_LENGTH,
        holeYOffset * UNIT_SQUARE_LENGTH );

    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, BASIC_RECTANGLES_SHAPE_KIT );
  }

  function generateIsoscelesRightTriangleSlantedHypotenuseFindAreaChallenge() {
    var cornerPosition = randomElement( [ 'leftTop', 'rightTop', 'rightBottom', 'leftBottom' ] );
    var edgeLength = 0;
    do {
      edgeLength = _.random( 4, Math.min( AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 2,
          AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 2 ) );
    } while ( edgeLength % 2 !== 0 );
    var perimeterShape = createPerimeterShapeSlantedHypotenuseRightIsoscelesTriangle( 0, 0,
        edgeLength * UNIT_SQUARE_LENGTH, cornerPosition );
    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, RECTANGLES_AND_TRIANGLES_SHAPE_KIT );
  }

  function generateIsoscelesRightTriangleLevelHypotenuseFindAreaChallenge() {
    var cornerPosition = randomElement( [ 'centerTop', 'rightCenter', 'centerBottom', 'leftCenter' ] );
    var hypotenuseLength = 0;
    var maxHypotenuse;
    if ( cornerPosition === 'centerTop' || cornerPosition === 'centerBottom' ) {
      maxHypotenuse = AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 4;
    }
    else {
      maxHypotenuse = AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 2;
    }
    do {
      hypotenuseLength = _.random( 2, maxHypotenuse );
    } while ( hypotenuseLength % 2 !== 0 );
    var perimeterShape = createPerimeterShapeLevelHypotenuseRightIsoscelesTriangle( 0, 0,
        hypotenuseLength * UNIT_SQUARE_LENGTH, cornerPosition );
    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, RECTANGLES_AND_TRIANGLES_SHAPE_KIT );
  }

  function generateLargeRectWithChipMissingChallenge() {
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

    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, BASIC_RECTANGLES_SHAPE_KIT );
  }

  function generateLargeRectWithSmallHoleMissingChallenge() {
    var width = _.random( AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 4, AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 2 );
    var height = _.random( AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 3, AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 2 );
    var holeWidth, holeHeight;
    if ( Math.random() < 0.5 ) {
      holeWidth = _.random( 1, 3 );
      holeHeight = 1;
    }
    else {
      holeHeight = _.random( 1, 3 );
      holeWidth = 1;
    }
    var holeXOffset = _.random( 1, width - holeWidth - 1 );
    var holeYOffset = _.random( 1, height - holeHeight - 1 );
    var perimeterShape = createPerimeterShapeWithHole( 0, 0, width * UNIT_SQUARE_LENGTH, height * UNIT_SQUARE_LENGTH,
        holeWidth * UNIT_SQUARE_LENGTH, holeHeight * UNIT_SQUARE_LENGTH, holeXOffset * UNIT_SQUARE_LENGTH,
        holeYOffset * UNIT_SQUARE_LENGTH );

    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, BASIC_RECTANGLES_SHAPE_KIT );
  }

  function generateLargeRectWithPieceMissingChallenge() {
    return Math.random() < 0.7 ? generateLargeRectWithChipMissingChallenge() : generateLargeRectWithSmallHoleMissingChallenge();
  }

  function generateShapeWithDiagonalFindAreaChallenge() {
    var width = _.random( 3, AreaBuilderGameModel.SHAPE_BOARD_UNIT_WIDTH - 4 );
    var height = _.random( 3, AreaBuilderGameModel.SHAPE_BOARD_UNIT_HEIGHT - 4 );
    var diagonalPosition = randomElement( ['leftTop', 'rightTop', 'leftBottom', 'rightBottom' ] );
    var diagonalSquareLength = 2;
    if ( height > 4 && width > 4 && Math.random() > 0.5 ) {
      diagonalSquareLength = 4;
    }
    var cutWidth = _.random( 1, width - diagonalSquareLength );
    var cutHeight = _.random( 1, height - diagonalSquareLength );

    var perimeterShape = createShapeWithDiagonalAndMissingCorner( 0, 0, width * UNIT_SQUARE_LENGTH,
        height * UNIT_SQUARE_LENGTH, diagonalPosition, diagonalSquareLength * UNIT_SQUARE_LENGTH,
        cutWidth * UNIT_SQUARE_LENGTH, cutHeight * UNIT_SQUARE_LENGTH );

    return AreaBuilderGameChallenge.createFindAreaChallenge( perimeterShape, RECTANGLES_AND_TRIANGLES_SHAPE_KIT );
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
     * @returns {Array}
     */
    generateChallengeSet: function( level, numChallenges ) {
      challengeHistory = []; // TODO: This reset of the history array is temporary until more challenges are created, then it should be cleared 1/2 at a time when having trouble creating unique challenges.
      var challengeSet = [];
      var tempChallenge;
      switch( level ) {
        case 0:
          _.times( 3, function() { challengeSet.push( generateBuildAreaChallenge() ); } );
          _.times( 2, function() { challengeSet.push( generateRectangularFindAreaChallenge() ); } );
          challengeSet = _.shuffle( challengeSet );
          challengeSet.push( generateLShapedFindAreaChallenge() );
          break;

        case 1:
          _.times( 3, function() { challengeSet.push( generateBuildAreaAndPerimeterChallenge() ); } );
          _.times( 3, function() { challengeSet.push( generateTwoRectangleBuildAreaAndPerimeterChallenge() ); } );
          break;

        case 2:
          challengeSet.push( generateUShapedFindAreaChallenge() );
          challengeSet.push( generateOShapedFindAreaChallenge() );
          challengeSet.push( generateShapeWithDiagonalFindAreaChallenge() );
          challengeSet = _.shuffle( challengeSet );
          var triangleChallenges = _.shuffle( [
            generateIsoscelesRightTriangleLevelHypotenuseFindAreaChallenge(),
            generateIsoscelesRightTriangleSlantedHypotenuseFindAreaChallenge()
          ] );
          triangleChallenges.forEach( function( challenge ) { challengeSet.push( challenge ) } );
          challengeSet.push( generateLargeRectWithPieceMissingChallenge() );
          break;

        case 3:
          // For this level, the grid is disabled for all challenges and some different build kits are used.
          tempChallenge = generateUShapedFindAreaChallenge();
          tempChallenge.toolSpec.gridControl = false;
          tempChallenge.userShapes = UNIT_SQUARE_ONLY_SHAPE_KIT;
          challengeSet.push( tempChallenge );
          tempChallenge = generateOShapedFindAreaChallenge();
          tempChallenge.toolSpec.gridControl = false;
          tempChallenge.userShapes = UNIT_SQUARE_ONLY_SHAPE_KIT;
          challengeSet.push( tempChallenge );
          tempChallenge = generateOShapedFindAreaChallenge();
          tempChallenge.toolSpec.gridControl = false;
          tempChallenge.userShapes = UNIT_SQUARE_ONLY_SHAPE_KIT;
          challengeSet.push( tempChallenge );
          tempChallenge = generateShapeWithDiagonalFindAreaChallenge();
          tempChallenge.toolSpec.gridControl = false;
          tempChallenge.userShapes = UNIT_SQUARE_ONLY_SHAPE_KIT;
          challengeSet.push( tempChallenge );
          challengeSet = _.shuffle( challengeSet );
          // For the next challenge, choose randomly from the shapes that don't have diagonals.
          tempChallenge = randomElement( [ generateLShapedFindAreaChallenge, generateUShapedFindAreaChallenge ] )();
          tempChallenge.toolSpec.gridControl = false;
          tempChallenge.userShapes = null;
          challengeSet.push( tempChallenge );
          tempChallenge = generateShapeWithDiagonalFindAreaChallenge();
          tempChallenge.toolSpec.gridControl = false;
          tempChallenge.userShapes = null;
          challengeSet.push( tempChallenge );
          break;

        case 4:
          _.times( numChallenges, function() { challengeSet.push( AreaBuilderGameChallenge.createFakeChallenge() ); } );
          break;

      }
      assert && assert( challengeSet.length === numChallenges, 'Error: Didn\'t generate correct number of challenges.' );
      return challengeSet;
    }
  };
} )
;