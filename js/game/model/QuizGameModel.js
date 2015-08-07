// Copyright 2002-2014, University of Colorado Boulder

/**
 * Framework for a quiz style game where the user is presented with various 'challenges' which must be answered and for
 * which they get points.  This file defines the code that handles the general behavior for PhET's quiz-style games,
 * such as state transitions, timers, best scores, and such.  It works in conjunction with a sim-specific model that
 * handles behavior that is specific to this simulation's game, such as how the model changes when displaying correct
 * answer to the user.
 *
 * This separation of concerns is experimental, and this simulation (Area Builder) is the first one where it is being
 * tried.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var GameState = require( 'AREA_BUILDER/game/model/GameState' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * @param challengeFactory - Factory object that is used to create challenges, examine usage for details.
   * @param simSpecificModel - Model containing the elements of the game that are unique to this sim, used to delegate
   * delegate certain actions.  Look through code for usage details.
   * @param {Object} [options]
   * @constructor
   */
  function QuizGameModel( challengeFactory, simSpecificModel, options ) {
    var thisModel = this;
    this.challengeFactory = challengeFactory; // @private
    this.simSpecificModel = simSpecificModel; // @public

    options = _.extend( {
      numberOfLevels: 6,
      challengesPerSet: 6,
      maxPointsPerChallenge: 2,
      maxAttemptsPerChallenge: 2
    }, options );

    PropertySet.call( this, {
        soundEnabled: true,
        timerEnabled: false,
        level: 0, // Zero-based in the model, though levels appear to the user to start at 1.
        challengeIndex: 0,
        currentChallenge: null,
        score: 0,
        elapsedTime: 0,

        // Current state of the game, see GameState for valid values.
        gameState: GameState.CHOOSING_LEVEL
      }
    );

    this.numberOfLevels = options.numberOfLevels; // @public
    this.challengesPerSet = options.challengesPerSet; // @public
    this.maxPointsPerChallenge = options.maxPointsPerChallenge; // @public
    this.maxPossibleScore = options.challengesPerSet * options.maxPointsPerChallenge; // @public
    this.maxAttemptsPerChallenge = options.maxAttemptsPerChallenge; // @private

    // @private Wall time at which current level was started.
    thisModel.gameStartTime = 0;

    // Best times and scores.
    thisModel.bestTimes = []; // @public
    thisModel.bestScoreProperties = []; // @public
    _.times( options.numberOfLevels, function() {
      thisModel.bestTimes.push( null );
      thisModel.bestScoreProperties.push( new Property( 0 ) );
    } );

    // Counter used to track number of incorrect answers.
    this.incorrectGuessesOnCurrentChallenge = 0; // @public

    // Current set of challenges, which collectively comprise a single level, on which the user is currently working.
    thisModel.challengeList = null;  // @private

    // Let the sim-specific model know when the challenge changes.
    thisModel.currentChallengeProperty.lazyLink( function( challenge ) { simSpecificModel.setChallenge( challenge ); } );
  }

  return inherit( PropertySet, QuizGameModel,
    {
      // @private
      step: function( dt ) {
        this.simSpecificModel.step( dt );
      },

      // reset this model
      reset: function() {
        PropertySet.prototype.reset.call( this );
        this.bestScoreProperties.forEach( function( bestScoreProperty ) { bestScoreProperty.reset(); } );
        this.bestTimes = [];
        var thisModel = this;
        _.times( this.numberOfLevels, function() {
          thisModel.bestTimes.push( null );
        } );
      },

      // starts new level
      startLevel: function( level ) {
        this.level = level;
        this.score = 0;
        this.challengeIndex = 0;
        this.incorrectGuessesOnCurrentChallenge = 0;
        this.restartGameTimer();

        // Create the list of challenges.
        this.challengeList = this.challengeFactory.generateChallengeSet( level, this.challengesPerSet );

        // Set up the model for the next challenge
        this.currentChallenge = this.challengeList[ this.challengeIndex ];

        // Let the sim-specific model know that a new level is being started in case it needs to do any initialization.
        this.simSpecificModel.startLevel();

        // Change to new game state.
        this.gameState = GameState.PRESENTING_INTERACTIVE_CHALLENGE;

        // Flag set to indicate new best time, cleared each time a level is started.
        this.newBestTime = false;
      },

      setChoosingLevelState: function() {
        this.gameState = GameState.CHOOSING_LEVEL;
      },

      getChallengeCurrentPointValue: function() {
        return Math.max( this.maxPointsPerChallenge - this.incorrectGuessesOnCurrentChallenge, 0 );
      },

      // Check the user's proposed answer.
      checkAnswer: function( answer ) {
        this.handleProposedAnswer( this.simSpecificModel.checkAnswer( this.currentChallenge ) );
      },

      // @private
      handleProposedAnswer: function( answerIsCorrect ) {
        var pointsEarned = 0;
        if ( answerIsCorrect ) {
          // The user answered the challenge correctly.
          this.gameState = GameState.SHOWING_CORRECT_ANSWER_FEEDBACK;
          if ( this.incorrectGuessesOnCurrentChallenge === 0 ) {
            // User got it right the first time.
            pointsEarned = this.maxPointsPerChallenge;
          }
          else {
            // User got it wrong at first, but got it right now.
            pointsEarned = Math.max( this.maxPointsPerChallenge - this.incorrectGuessesOnCurrentChallenge, 0 );
          }
          this.score = this.score + pointsEarned;
        }
        else {
          // The user got it wrong.
          this.incorrectGuessesOnCurrentChallenge++;
          if ( this.incorrectGuessesOnCurrentChallenge < this.maxAttemptsPerChallenge ) {
            this.gameState = GameState.SHOWING_INCORRECT_ANSWER_FEEDBACK_TRY_AGAIN;
          }
          else {
            this.gameState = GameState.SHOWING_INCORRECT_ANSWER_FEEDBACK_MOVE_ON;
          }
        }
      },

      // @private
      newGame: function() {
        this.stopGameTimer();
        this.gameState = GameState.CHOOSING_LEVEL;
        this.incorrectGuessesOnCurrentChallenge = 0;
      },

      // Move to the next challenge in the current challenge set.
      nextChallenge: function() {
        this.incorrectGuessesOnCurrentChallenge = 0;
        if ( this.challengeIndex + 1 < this.challengeList.length ) {
          // Move to the next challenge.
          this.challengeIndex++;
          this.currentChallenge = this.challengeList[ this.challengeIndex ];
          this.gameState = GameState.PRESENTING_INTERACTIVE_CHALLENGE;
        }
        else {
          // All challenges completed for this level.  See if this is a new best time and, if so, record it.
          if ( this.score === this.maxPossibleScore ) {
            // Perfect game.  See if new best time.
            if ( this.bestTimes[ this.level ] === null || this.elapsedTime < this.bestTimes[ this.level ] ) {
              this.newBestTime = this.bestTimes[ this.level ] !== null; // Don't set this flag for the first 'best time', only when the time improves.
              this.bestTimes[ this.level ] = this.elapsedTime;
            }
          }
          this.bestScoreProperties[ this.level ].value = this.score;

          // Done with this game, show the results.
          this.gameState = GameState.SHOWING_LEVEL_RESULTS;
        }
      },

      tryAgain: function() {
        this.simSpecificModel.tryAgain();
        this.gameState = GameState.PRESENTING_INTERACTIVE_CHALLENGE;
      },

      displayCorrectAnswer: function() {

        // Set the challenge to display the correct answer.
        this.simSpecificModel.displayCorrectAnswer( this.currentChallenge );

        // Update the game state.
        this.gameState = GameState.DISPLAYING_CORRECT_ANSWER;
      },

      // @private
      restartGameTimer: function() {
        if ( this.gameTimerId !== null ) {
          window.clearInterval( this.gameTimerId );
        }
        this.elapsedTime = 0;
        var thisModel = this;
        this.gameTimerId = window.setInterval( function() { thisModel.elapsedTime += 1; }, 1000 );
      },

      // @private
      stopGameTimer: function() {
        window.clearInterval( this.gameTimerId );
        this.gameTimerId = null;
      }
    } );
} );
