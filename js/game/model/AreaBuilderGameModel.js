// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main model class for the area builder game.
 *
 * Note: Levels in this model are zero-indexed, even though they are often presented to the user as starting at level 1.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderGameChallengeFactory = require( 'AREA_BUILDER/game/model/AreaBuilderGameChallengeFactory' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Vector2 = require( 'DOT/Vector2' );

  // Constants
  var NUM_LEVELS = 5;
  var MAX_POINTS_PER_PROBLEM = 2;
  var CHALLENGES_PER_PROBLEM_SET = 6;
  var MAX_SCORE_PER_GAME = MAX_POINTS_PER_PROBLEM * CHALLENGES_PER_PROBLEM_SET;

  function AreaBuilderGameModel() {
    var thisModel = this;

    PropertySet.call( this,
      {
        soundEnabled: true,
        timerEnabled: true,
        level: 0, // Zero-based in the model, though levels appear to the user to start at 1.
        challengeIndex: 0,
        score: 0,
        elapsedTime: 0,
        // Game state, valid values are 'choosingLevel', 'presentingInteractiveChallenge',
        // 'showingCorrectAnswerFeedback', 'showingIncorrectAnswerFeedbackTryAgain',
        // 'showingIncorrectAnswerFeedbackMoveOn', 'displayingCorrectAnswer', 'showingLevelResults'
        gameState: 'choosingLevel'
      } );

    // Wall time at which current level was started.
    thisModel.gameStartTime = 0;

    // Best times and scores.
    thisModel.bestTimes = [];
    thisModel.bestScores = [];
    _.times( NUM_LEVELS, function() {
      thisModel.bestTimes.push( null );
      thisModel.bestScores.push( new Property( 0 ) );
    } );

    // Counter used to track number of incorrect answers.
    this.incorrectGuessesOnCurrentChallenge = 0;

    // Current set of challenges, which collectively comprise a single level, on
    // which the user is currently working.
    thisModel.challengeList = null;
  }

  // static constants
  AreaBuilderGameModel.PROBLEMS_PER_LEVEL = CHALLENGES_PER_PROBLEM_SET;
  AreaBuilderGameModel.MAX_POSSIBLE_SCORE = MAX_POINTS_PER_PROBLEM * CHALLENGES_PER_PROBLEM_SET;
  AreaBuilderGameModel.NUM_LEVELS = NUM_LEVELS;

  return inherit( PropertySet, AreaBuilderGameModel,
    {
      step: function( dt ) {
        //TODO: Not sure yet if step is needed for area builder challenges, might need for animation.
      },

      reset: function() {
        PropertySet.prototype.reset.call( this );
        this.bestScores.forEach( function( bestScoreProperty ) { bestScoreProperty.reset(); } );
        this.bestTimes = [];
        var thisModel = this;
        _.times( NUM_LEVELS, function() {
          thisModel.bestTimes.push( null );
        } );
      },

      startLevel: function( level ) {
        this.level = level;
        this.score = 0;
        this.challengeIndex = 0;
        this.restartGameTimer();

        // Set up the challenges.
        this.challengeList = AreaBuilderGameChallengeFactory.generateChallengeSet( level, CHALLENGES_PER_PROBLEM_SET );

        // Set up the model for the next challenge
        this.setChallenge( this.challengeList[ 0 ], this.challengeList[ 0 ].initialColumnState );

        // Change to new game state.
        this.gameState = 'presentingInteractiveChallenge';

        // Flag set to indicate new best time, cleared each time a level is started.
        this.newBestTime = false;
      },

      setChallenge: function( challenge, columnState ) {

        var thisModel = this;

        // Clear out the previous challenge (if there was one).
        //TODO: Clear out previous challenge.

        // Set up the new challenge.
        //TODO: Set up the next challenge.

      },

      setChoosingLevelState: function() {
        this.gameState = 'choosingLevel';
      },

      getCurrentChallenge: function() {
        if ( this.challengeList === null || this.challengeList.size <= this.challengeIndex ) {
          return null;
        }
        return this.challengeList[ this.challengeIndex ];
      },

      getChallengeCurrentPointValue: function() {
        return MAX_POINTS_PER_PROBLEM - this.incorrectGuessesOnCurrentChallenge;
      },

      // Check the user's proposed answer.
      checkAnswer: function( answer ) {
        //TODO: Check user's answer.  The following is temporary.
        this.handleProposedAnswer( this.challengeList[ this.challengeIndex ].correctAnswerProperty.value );
//        if ( this.getCurrentChallenge() instanceof BalanceMassesChallenge ) {
//          // Turn off the column(s) so that the plank can move.
//          this.columnState = 'noColumns';
//
//          this.handleProposedAnswer( this.plank.isBalanced() );
//        }
//        else if ( this.getCurrentChallenge() instanceof TiltPredictionChallenge ) {
//
//          var isAnswerCorrect = ( tiltPrediction === 'tiltDownOnLeftSide' && this.plank.getTorqueDueToMasses() > 0 ) ||
//                                ( tiltPrediction === 'tiltDownOnRightSide' && this.plank.getTorqueDueToMasses() < 0 ) ||
//                                ( tiltPrediction === 'stayBalanced' && this.plank.getTorqueDueToMasses() === 0 );
//
//          if ( isAnswerCorrect ) {
//            // Turn off the column(s) so that the plank can move.
//            this.columnState = 'noColumns';
//          }
//
//          this.handleProposedAnswer( isAnswerCorrect );
//        }
//        else if ( this.getCurrentChallenge() instanceof MassDeductionChallenge ) {
//          this.handleProposedAnswer( mass === this.getTotalFixedMassValue() );
//        }
      },

      handleProposedAnswer: function( answerIsCorrect ) {
        var pointsEarned = 0;
        if ( answerIsCorrect ) {
          // The user answered the challenge correctly.
          this.gameState = 'showingCorrectAnswerFeedback';
          if ( this.incorrectGuessesOnCurrentChallenge === 0 ) {
            // User got it right the first time.
            pointsEarned = MAX_POINTS_PER_PROBLEM;
          }
          else {
            // User got it wrong at first, but got it right now.
            pointsEarned = MAX_POINTS_PER_PROBLEM - this.incorrectGuessesOnCurrentChallenge;
          }
          this.score = this.score + pointsEarned;
        }
        else {
          // The user got it wrong.
          this.incorrectGuessesOnCurrentChallenge++;
          if ( this.incorrectGuessesOnCurrentChallenge < this.getCurrentChallenge().maxAttemptsAllowed ) {
            this.gameState = 'showingIncorrectAnswerFeedbackTryAgain';
          }
          else {
            this.gameState = 'showingIncorrectAnswerFeedbackMoveOn';
          }
        }
      },

      newGame: function() {
        this.stopGameTimer();
        this.gameState = 'choosingLevel';
        this.incorrectGuessesOnCurrentChallenge = 0;
      },

      nextChallenge: function() {
        this.challengeIndex++;
        this.incorrectGuessesOnCurrentChallenge = 0;
        if ( this.challengeIndex < this.challengeList.length ) {
          // Move to the next challenge.
          this.setChallenge( this.getCurrentChallenge(), this.getCurrentChallenge().initialColumnState );
          this.gameState = 'presentingInteractiveChallenge';
        }
        else {
          // All challenges completed for this level.  See if this is a new best time and, if so, record it.
          if ( this.score === MAX_SCORE_PER_GAME ) {
            // Perfect game.  See if new best time.
            if ( this.bestTimes[ this.level ] === null || this.elapsedTime < this.bestTimes[ this.level ] ) {
              this.newBestTime = this.bestTimes[ this.level ] !== null; // Don't set this flag for the first 'best time', only when the time improves.
              this.bestTimes[ this.level ] = this.elapsedTime;
            }
          }
          this.bestScores[ this.level ].value = this.score;

          // Done with this game, show the results.
          this.gameState = 'showingLevelResults';
        }
      },

      tryAgain: function() {
        // Restore the challenge to the original state.
        //TODO: Restore challenge to original state.
//        this.columnState = this.getCurrentChallenge().initialColumnState;
        this.gameState = 'presentingInteractiveChallenge';
      },

      displayCorrectAnswer: function() {

        // Set the challenge to display the correct answer.
        this.getCurrentChallenge().showCorrectAnswer();

        // Update the game state.
        this.gameState = 'displayingCorrectAnswer';
      },

      restartGameTimer: function() {
        if ( this.gameTimerId !== null ) {
          window.clearInterval( this.gameTimerId );
        }
        this.elapsedTime = 0;
        var thisModel = this;
        this.gameTimerId = window.setInterval( function() { thisModel.elapsedTime += 1; }, 1000 );
      },

      stopGameTimer: function() {
        window.clearInterval( this.gameTimerId );
        this.gameTimerId = null;
      }
    } );
} );
