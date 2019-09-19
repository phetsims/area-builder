// Copyright 2014-2017, University of Colorado Boulder

/**
 * Possible game states.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const areaBuilder = require( 'AREA_BUILDER/areaBuilder' );

  const GameState = {
    CHOOSING_LEVEL: 'choosingLevel',
    PRESENTING_INTERACTIVE_CHALLENGE: 'presentingInteractiveChallenge',
    SHOWING_CORRECT_ANSWER_FEEDBACK: 'showingCorrectAnswerFeedback',
    SHOWING_INCORRECT_ANSWER_FEEDBACK_TRY_AGAIN: 'showingIncorrectAnswerFeedbackTryAgain',
    SHOWING_INCORRECT_ANSWER_FEEDBACK_MOVE_ON: 'showingIncorrectAnswerFeedbackMoveOn',
    DISPLAYING_CORRECT_ANSWER: 'displayingCorrectAnswer',
    SHOWING_LEVEL_RESULTS: 'showingLevelResults'
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( GameState ); }

  areaBuilder.register( 'GameState', GameState );

  return GameState;
} );