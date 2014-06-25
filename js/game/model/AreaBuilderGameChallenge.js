// Copyright 2002-2014, University of Colorado Boulder

/**
 * This type defines a challenge used in the Area Builder game.  It exists as a place to document the format of a
 * challenge and to verify that challenges are created correctly.
 */
define( function( require ) {
  'use strict';

  /**
   * @param {string} challengeTitle Title for this challenge, shown at the top of the view.
   * @param {object} scoreboardSpec An object with three boolean properties, 'showGrid', 'showDimensions', and
   * 'showDecompositionTool'.
   * @param {boolean} showNumberEntryPad Flag that controls whether key pad is present in this challenge.
   * @param {array} kitContents An array of creator nodes that should be included in the kit.  Can be null to signify
   * no kit.
   * @param {string} buildSpecString String that is initially presented above the board to instruct the user on what to
   * build. Should be null if not used.
   * @param {object} colorPrompt1 Object with a 'text' field and a 'color' field that is used when users need to build
   * a two-tone area. Should be null if not used.
   * @param {object} colorPrompt2 Object with a 'text' field and a 'color' field that is used when users need to build
   * a two-tone area. Should be null if not used.
   * @param {Shape} backgroundShape Shape that should appear on the board
   * @param {string} checkSpec Specifies what should be checked when the user pressed the 'Check' button.  Valid values
   * are 'areaConstructed', 'areaAndPerimeterConstructed', 'areaEntered'.
   * @constructor
   */
  function AreaBuilderGameChallenge( challengeTitle, scoreboardSpec, showNumberEntryPad, kitContents, buildSpecString, colorPrompt1, colorPrompt2, backgroundShape, checkSpec ) {
    // TODO: Maybe add some verification.
    this.challengeTitle = challengeTitle;
    this.scoreboardSpec = scoreboardSpec;
    this.showNumberEntryPad = showNumberEntryPad;
    this.kitContents = kitContents;
    this.buildSpecString = buildSpecString;
    this.colorPrompt1 = colorPrompt1;
    this.colorPrompt2 = colorPrompt2;
    this.backgroundShape = backgroundShape;
    this.checkSpec = checkSpec;
  }

  return AreaBuilderGameChallenge;
} );