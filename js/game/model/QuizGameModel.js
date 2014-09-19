// Copyright 2002-2014, University of Colorado Boulder

//REVIEW I didn't understand that this was an experiment at a reusable framework until we discussed on the phone.
//REVIEW Elaborate on how responsibilies are divided between the reusable framework and the sim-specific piece that it delegates to.
/**
 * Framework for a quiz style game where the user is presented with various 'challenges' which must be answered and
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

  //REVIEW challengeFactory is not an Object, it requires methods that are called herein
  //REVIEW simSpecificModel is not an Object, it requires methods that are called herein
  //REVIEW elaborate on why you're calling this 'simSpecificModel'
  /**
   * @param {Object} challengeFactory - Factory object that is used to create challenges, examine usage for details.
   * @param {Object} simSpecificModel - Model containing the elements of the game that are unique to this sim, used to
   * delegate certain actions.  Look through code for usage details.
   * @param {Object} [options]
   * @constructor
   */
  function QuizGameModel( challengeFactory, simSpecificModel, options ) {
    var thisModel = this;
    this.challengeFactory = challengeFactory; // @private
    //REVIEW making this public seems to defeat the advantages of composition, and argues for inheritance
    this.simSpecificModel = simSpecificModel; // @public

    //REVIEW are you intentionally omitting the second 'options' arg to _.extend ?
    options = _.extend( {
      numberOfLevels: 6,
      challengesPerSet: 6,
      maxPointsPerChallenge: 2
    } );

    PropertySet.call( this, {
        soundEnabled: true,
        timerEnabled: false,
        level: 0, // Zero-based in the model, though levels appear to the user to start at 1.
        challengeIndex: 0,
        currentChallenge: null,
        score: 0,
        elapsedTime: 0,
        //REVIEW especially with verbose strings like this that are easy to mistype, I recommend using an enum pattern
        // Game state, valid values are 'choosingLevel', 'presentingInteractiveChallenge',
        // 'showingCorrectAnswerFeedback', 'showingIncorrectAnswerFeedbackTryAgain',
        // 'showingIncorrectAnswerFeedbackMoveOn', 'displayingCorrectAnswer', 'showingLevelResults'
        gameState: 'choosingLevel'
      }
    );

    this.numberOfLevels = options.numberOfLevels; // @public
    this.challengesPerSet = options.challengesPerSet; // @public
    this.maxPointsPerChallenge = options.maxPointsPerChallenge; // @public
    this.maxPossibleScore = options.challengesPerSet * options.maxPointsPerChallenge; // @public

    // @private Wall time at which current level was started.
    thisModel.gameStartTime = 0;

    // Best times and scores.
    thisModel.bestTimes = []; //REVIEW @private or @public?
    thisModel.bestScores = []; //REVIEW @private or @public?
    _.times( options.numberOfLevels, function() {
      thisModel.bestTimes.push( null );
      thisModel.bestScores.push( new Property( 0 ) );
    } );

    // Counter used to track number of incorrect answers. //REVIEW @private or @public?
    this.incorrectGuessesOnCurrentChallenge = 0;

    // Current set of challenges, which collectively comprise a single level, on which the user is currently working.
    thisModel.challengeList = null;  //REVIEW @private or @public?

    // Let the sim-specific model know when the challenge changes.
    thisModel.currentChallengeProperty.lazyLink( function( challenge ) { simSpecificModel.setChallenge( challenge ); } );
  }

  return inherit( PropertySet, QuizGameModel,
    {
      //REVIEW are any of these prototype functions private?

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
        this.challengeList = this.challengeFactory.generateChallengeSet( level, this.challengesPerSet );

        // Set up the model for the next challenge
        this.currentChallenge = this.challengeList[ this.challengeIndex ];

        // Let the sim-specific model know that a new level is being started in case it needs to do any initialization.
        this.simSpecificModel.startLevel();

        // Change to new game state.
        this.gameState = 'presentingInteractiveChallenge';

        // Flag set to indicate new best time, cleared each time a level is started.
        this.newBestTime = false;
      },

      setChoosingLevelState: function() {
        this.gameState = 'choosingLevel';
      },

      getChallengeCurrentPointValue: function() {
        return Math.max( this.maxPointsPerChallenge - this.incorrectGuessesOnCurrentChallenge, 0 );
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
        this.simSpecificModel.tryAgain();
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
