// Copyright 2014-2019, University of Colorado Boulder

/**
 * This type defines a challenge used in the Area Builder game.  It exists as a place to document the format of a
 * challenge and to verify that challenges are created correctly.
 *
 * @author John Blanco
 */

import inherit from '../../../../phet-core/js/inherit.js';
import areaBuilder from '../../areaBuilder.js';
import PerimeterShape from '../../common/model/PerimeterShape.js';
import BuildSpec from './BuildSpec.js';

/**
 * @param {Object} toolSpec An object that specifies which tools are available to the user.  It should have three
 * boolean properties - 'gridControl', 'dimensionsControl', and 'decompositionToolControl' - that indicate whether
 * the user is allowed to control these things for this challenge.
 * @param {Array<Object>} userShapes An array of shape specification that describe the shapes that can be created and
 * manipulated by the user for this challenge.  Each shape specification is an object with a 'shape' field and a
 * 'color' field.  This value can be null to signify no user shapes are present for the challenge.
 * @param {BuildSpec} buildSpec Object that specifies what the user should build, see BuildSpec.js file for details.
 * @param {PerimeterShape} backgroundShape Shape that should appear on the board, null for challenges that don't
 * require such a shape.
 * @param {string} checkSpec Specifies what should be checked when the user pressed the 'Check' button.  Valid values
 * are 'areaEntered', 'areaConstructed', 'areaAndPerimeterConstructed', 'areaAndProportionConstructed',
 * 'areaPerimeterAndProportionConstructed'.
 * @param {Array<Object>} exampleBuildItSolution An example solution for a build problem.  It consists of a list of
 * cell positions for unit squares and a color, e.g. { cellColumn: x, cellRow: y, color: 'blue' }.  This should be
 * null for challenges where no example solution needs to be shown.
 * @constructor
 */
function AreaBuilderGameChallenge( toolSpec, userShapes, buildSpec, backgroundShape, checkSpec, exampleBuildItSolution ) {
  // Verification
  assert && assert( buildSpec instanceof BuildSpec || buildSpec === null );
  assert && assert( backgroundShape instanceof PerimeterShape || backgroundShape === null );

  // Fields, all public.
  this.toolSpec = toolSpec;
  this.userShapes = userShapes;
  this.buildSpec = buildSpec;
  this.backgroundShape = backgroundShape;
  this.checkSpec = checkSpec;
  this.exampleBuildItSolution = exampleBuildItSolution;
}

AreaBuilderGameChallenge.createBuildAreaChallenge = function( areaToBuild, userShapes, exampleSolution ) {
  return new AreaBuilderGameChallenge(
    // toolSpec
    {
      gridControl: true,
      dimensionsControl: true,
      decompositionToolControl: true
    },

    // userShapes
    userShapes,

    // buildSpec
    BuildSpec.areaOnly( areaToBuild ),

    // backgroundShape
    null,

    // checkSpec
    'areaConstructed',

    // exampleBuildItSolution
    exampleSolution
  );
};

AreaBuilderGameChallenge.createTwoToneBuildAreaChallenge = function( areaToBuild, color1, color2, color1Fraction, userShapes, exampleSolution ) {
  return new AreaBuilderGameChallenge(
    // toolSpec
    {
      gridControl: true,
      dimensionsControl: true,
      decompositionToolControl: true
    },

    // userShapes
    userShapes,

    // buildSpec
    BuildSpec.areaAndProportions( areaToBuild, color1, color2, color1Fraction ),

    // backgroundShape
    null,

    // checkSpec
    'areaAndProportionConstructed',

    // exampleBuildItSolution
    exampleSolution
  );
};

AreaBuilderGameChallenge.createTwoToneBuildAreaAndPerimeterChallenge = function( areaToBuild, perimeterToBuild, color1, color2, color1Fraction, userShapes, exampleSolution ) {
  return new AreaBuilderGameChallenge(
    // toolSpec
    {
      gridControl: true,
      dimensionsControl: true,
      decompositionToolControl: true
    },

    // userShapes
    userShapes,

    // buildSpec
    BuildSpec.areaPerimeterAndProportions( areaToBuild, perimeterToBuild, color1, color2, color1Fraction ),

    // backgroundShape
    null,

    // checkSpec
    'areaPerimeterAndProportionConstructed',

    // exampleBuildItSolution
    exampleSolution
  );
};

AreaBuilderGameChallenge.createBuildAreaAndPerimeterChallenge = function( areaToBuild, perimeterToBuild, userShapes, exampleSolution ) {
  return new AreaBuilderGameChallenge(
    // toolSpec
    {
      gridControl: true,
      dimensionsControl: true,
      decompositionToolControl: true
    },

    // userShapes
    userShapes,

    // buildSpec
    BuildSpec.areaAndPerimeter( areaToBuild, perimeterToBuild ),

    // backgroundShape
    null,

    // checkSpec
    'areaAndPerimeterConstructed',

    // exampleBuildItSolution
    exampleSolution
  );
};

AreaBuilderGameChallenge.createFindAreaChallenge = function( areaShape, userShapes ) {
  return new AreaBuilderGameChallenge(
    // toolSpec
    {
      gridControl: true,
      dimensionsControl: true,
      decompositionToolControl: true
    },

    // userShapes
    userShapes,

    // buildSpec
    null,

    // backgroundShape
    areaShape,

    // checkSpec
    'areaEntered',

    // exampleBuildItSolution
    null
  );
};

areaBuilder.register( 'AreaBuilderGameChallenge', AreaBuilderGameChallenge );

inherit( Object, AreaBuilderGameChallenge );
export default AreaBuilderGameChallenge;