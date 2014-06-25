// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderChallengeFactory = require( 'AREA_BUILDER/game/model/AreaBuilderChallengeFactory' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Property = require( 'AXON/Property' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ShapePlacementBoard = require( 'AREA_BUILDER/common/model/ShapePlacementBoard' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var UNIT_SQUARE_LENGTH = 35; // In screen coords, which are roughly pixels
  var BOARD_SIZE = new Dimension2( UNIT_SQUARE_LENGTH * 12, UNIT_SQUARE_LENGTH * 9 );

  /**
   *
   * @constructor
   */
  function AreaBuilderAdditionalGameModel() {

    // Temp property for 'fake' challenges.  TODO - Remove this when all challenges are working.
    this.fakeCorrectAnswerProperty = new Property( false );

    // @public The shape board where the user will build and/or evaluate shapes.
    this.shapePlacementBoard = new ShapePlacementBoard(
      BOARD_SIZE,
      UNIT_SQUARE_LENGTH,
      new Vector2( 200, 100 ),
      'red'
    );
  }

  AreaBuilderAdditionalGameModel.prototype = {
    displayCorrectAnswer: function( challenge ) {
      // TODO - stubbed for now
      this.fakeCorrectAnswerProperty.value = true;
    },

    checkAnswer: function( challenge ) {
      // TODO: Temp
      return this.fakeCorrectAnswerProperty.value;
    }
  };

  return AreaBuilderAdditionalGameModel;
} );