// Copyright 2002-2014, University of Colorado Boulder

/**
 * Framework for a quiz style game, where the user is presented with various 'challenges' which must be answered and
 * for which they get points.  The game has multiple levels.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * TODO: doc this once it's stable
   * @param challengeFactory
   * @param simSpecificModel
   * @param options
   * @constructor
   */
  function QuizGameModel( challengeFactory, simSpecificModel, options ) {
    var thisModel = this;
    this.challengeFactory = challengeFactory; // @private
    this.simSpecificModel = simSpecificModel; // @public

    options = _.extend( {
//      numberOfLevels: 5,
      numberOfLevels: 4,
      challengesPerProblemSet: 6,
      maxPointsPerProblem: 2
    } );

    PropertySet.call( this,
      {
        soundEnabled: true,
        timerEnabled: false,
        level: 0, // Zero-based in the model, though levels appear to the user to start at 1.
        challengeIndex: 0,
        currentChallenge: null,
        score: 0,
        elapsedTime: 0,
        // Game state, valid values are 'choosingLevel', 'presentingInteractiveChallenge',
        // 'showingCorrectAnswerFeedback', 'showingIncorrectAnswerFeedbackTryAgain',
        // 'showingIncorrectAnswerFeedbackMoveOn', 'displayingCorrectAnswer', 'showingLevelResults'
        gameState: 'choosingLevel'
      }
    );

    this.numberOfLevels = options.numberOfLevels; // @public
    this.challengesPerProblemSet = options.challengesPerProblemSet; // @public
    this.maxPointsPerProblem = options.maxPointsPerProblem; // @public
    this.maxPossibleScore = options.challengesPerProblemSet * options.maxPointsPerProblem; // @public

    // @private Wall time at which current level was started.
    thisModel.gameStartTime = 0;

    // Best times and scores.
    thisModel.bestTimes = [];
    thisModel.bestScores = [];
    _.times( options.numberOfLevels, function() {
      thisModel.bestTimes.push( null );
      thisModel.bestScores.push( new Property( 0 ) );
    } );

    // Counter used to track number of incorrect answers.
    this.incorrectGuessesOnCurrentChallenge = 0;

    // Current set of challenges, which collectively comprise a single level, on which the user is currently working.
    thisModel.challengeList = null;

    // Let the sim-specific model know when the challenge changes.
    thisModel.currentChallengeProperty.lazyLink( function( challenge ) { simSpecificModel.setChallenge( challenge ); } );
  }

  return inherit( PropertySet, QuizGameModel,
    {
      step: function( dt ) {
        this.simSpecificModel.step( dt );
      },

      reset: function() {
        PropertySet.prototype.reset.call( this );
        this.bestScores.forEach( function( bestScoreProperty ) { bestScoreProperty.reset(); } );
        this.bestTimes = [];
        var thisModel = this;
        _.times( this.numberOfLevels, function() {
          thisModel.bestTimes.push( null );
        } );
      },

      startLevel: function( level ) {
        this.level = level;
        this.score = 0;
        this.challengeIndex = 0;
        this.incorrectGuessesOnCurrentChallenge = 0;
        this.restartGameTimer();

        // Create the list of challenges.
        this.challengeList = this.challengeFactory.generateChallengeSet( level, this.challengesPerProblemSet );

        // Set up the model for the next challenge
        this.currentChallenge = this.challengeList[ this.challengeIndex ];

        // Change to new game state.
        this.gameState = 'presentingInteractiveChallenge';

        // Flag set to indicate new best time, cleared each time a level is started.
        this.newBestTime = false;
      },

      setChoosingLevelState: function() {
        this.gameState = 'choosingLevel';
      },

      getChallengeCurrentPointValue: function() {
        return this.maxPointsPerProblem - this.incorrectGuessesOnCurrentChallenge;
      },

      // Check the user's proposed answer.
      checkAnswer: function( answer ) {
        this.handleProposedAnswer( this.simSpecificModel.checkAnswer( this.currentChallenge ) );
      },

      handleProposedAnswer: function( answerIsCorrect ) {
        var pointsEarned = 0;
        if ( answerIsCorrect ) {
          // The user answered the challenge correctly.
          this.gameState = 'showingCorrectAnswerFeedback';
          if ( this.incorrectGuessesOnCurrentChallenge === 0 ) {
            // User got it right the first time.
            pointsEarned = this.maxPointsPerProblem;
          }
          else {
            // User got it wrong at first, but got it right now.
            pointsEarned = this.maxPointsPerProblem - this.incorrectGuessesOnCurrentChallenge;
          }
          this.score = this.score + pointsEarned;
        }
        else {
          // The user got it wrong.
          this.incorrectGuessesOnCurrentChallenge++;
          if ( this.incorrectGuessesOnCurrentChallenge < this.currentChallenge.maxAttemptsAllowed ) {
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
        this.incorrectGuessesOnCurrentChallenge = 0;
        if ( this.challengeIndex + 1 < this.challengeList.length ) {
          // Move to the next challenge.
          this.challengeIndex++;
          this.currentChallenge = this.challengeList[ this.challengeIndex ];
          this.gameState = 'presentingInteractiveChallenge';
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
          this.bestScores[ this.level ].value = this.score;

          // Done with this game, show the results.
          this.gameState = 'showingLevelResults';
        }
      },

      tryAgain: function() {
        // TODO: May need hooks for restoring to original state, if that is necessary.
        this.gameState = 'presentingInteractiveChallenge';
      },

      displayCorrectAnswer: function() {

        // Set the challenge to display the correct answer.
        this.simSpecificModel.displayCorrectAnswer( this.currentChallenge );

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
