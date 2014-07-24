// Copyright 2002-2014, University of Colorado Boulder

/**
 * This type defines a challenge used in the Area Builder game.  It exists as a place to document the format of a
 * challenge and to verify that challenges are created correctly.
 */
define( function( require ) {
  'use strict';

  // modules
  var PerimeterShape = require( 'AREA_BUILDER/common/model/PerimeterShape' );

  /**
   * @param {object} toolSpec An object that specifies which tools are available to the user.  It should have three
   * boolean properties - 'gridControl', 'dimensionsControl', and 'decompositionToolControl' - that indicate whether
   * the user is allowed to control these things for this challenge.
   * @param {boolean} showNumberEntryPad Flag that controls whether key pad is present in this challenge.
   * @param {array} carouselContents An array of creator nodes that should be placed in the carousel so that the user
   * can use them to drag out shapes for placement on the board.  Can be null to signify no kit, should never be empty.
   * @param {object} buildSpec Object that specifies what the user should build.  This is only used if this is a 'build
   * it' type of challenge, otherwise it should be null.  It should always have an 'area' field with a number, and can
   * optionally have a 'perimeter' field with a number as well.
   * @param {object} colorPrompt1 Object with a 'text' field and a 'color' field that is used when users need to build
   * a two-tone area. Should be null if not used.
   * @param {object} colorPrompt2 Object with a 'text' field and a 'color' field that is used when users need to build
   * a two-tone area. Should be null if not used.
   * @param {PerimeterShape} backgroundShape Shape that should appear on the board, null for challenges that don't
   * require such a shape.
   * @param {string} checkSpec Specifies what should be checked when the user pressed the 'Check' button.  Valid values
   * are 'areaConstructed', 'areaAndPerimeterConstructed', 'areaEntered'.
   * @param {Array<Object>} exampleBuildItSolution An example solution for a build problem.  It consists of a list of
   * cell positions for unit squares and a color, e.g. { cellColumn: x, cellRow: y, color: 'blue' }.  This should be
   * null for challenges where no example solution needs to be shown.
   * @param {boolean} fakeChallenge Indicates that everything else should be ignored and this is really just a fake
   * challenge, i.e. one with just a check box to get the right answer.  TODO Remove this once game is working.
   * @constructor
   */
  function AreaBuilderGameChallenge( toolSpec, showNumberEntryPad, carouselContents, buildSpec, colorPrompt1, colorPrompt2, backgroundShape, checkSpec, exampleBuildItSolution, fakeChallenge ) {
    // Verification
    assert && assert( backgroundShape instanceof PerimeterShape || backgroundShape === null );
    // TODO: Maybe add some additional verification.

    this.toolSpec = toolSpec;
    this.showNumberEntryPad = showNumberEntryPad;
    this.carouselContents = carouselContents;
    this.buildSpec = buildSpec;
    this.colorPrompt1 = colorPrompt1;
    this.colorPrompt2 = colorPrompt2;
    this.backgroundShape = backgroundShape;
    this.checkSpec = checkSpec;
    this.exampleBuildItSolution = exampleBuildItSolution;
    this.fakeChallenge = fakeChallenge;

    // Non-parameterized fields.
    this.maxAttemptsAllowed = 2;
  }

  AreaBuilderGameChallenge.createBuildAreaChallenge = function( areaToBuild, carouselContents, exampleSolution ) {
    return new AreaBuilderGameChallenge(
      // toolSpec
      {
        gridControl: true,
        dimensionsControl: true,
        decompositionToolControl: true
      },

      // showNumberEntryPad
      false,

      // carouselContents
      carouselContents,

      // buildSpec
      { area: areaToBuild },

      // colorPrompt1
      null,

      // colorPrompt2
      null,

      // backgroundShape
      null,

      // checkSpec
      'areaConstructed',

      // exampleBuildItSolution
      exampleSolution,

      // fakeChallenge
      false
    );
  }

  return AreaBuilderGameChallenge;
} );