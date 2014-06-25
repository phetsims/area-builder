// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main screen for the balance game.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderScoreboard = require( 'AREA_BUILDER/game/view/AreaBuilderScoreboard' );
  var CheckBox = require( 'SUN/CheckBox' );
  var FaceWithPointsNode = require( 'SCENERY_PHET/FaceWithPointsNode' );
  var GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ReturnToLevelSelectButton = require( 'SCENERY_PHET/ReturnToLevelSelectButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ShapePlacementBoardNode = require( 'AREA_BUILDER/common/view/ShapePlacementBoardNode' );
  var StartGameLevelNode = require( 'AREA_BUILDER/game/view/StartGameLevelNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // strings
  var checkString = require( 'string!VEGAS/check' );
  var nextString = require( 'string!VEGAS/next' );
  var showAnswerString = require( 'string!VEGAS/showAnswer' );
  var tryAgainString = require( 'string!VEGAS/tryAgain' );

  // images
  var icon1a = require( 'image!AREA_BUILDER/icon-1-a.jpg' );
  var icon2a = require( 'image!AREA_BUILDER/icon-2-a.jpg' );
  var icon3a = require( 'image!AREA_BUILDER/icon-3-a.jpg' );
  var icon4a = require( 'image!AREA_BUILDER/icon-4-a.jpg' );
  var icon5a = require( 'image!AREA_BUILDER/icon-5-a.jpg' );
//  var icon1b = require( 'image!AREA_BUILDER/icon-1-b.jpg' );
//  var icon2b = require( 'image!AREA_BUILDER/icon-2-b.jpg' );
//  var icon3b = require( 'image!AREA_BUILDER/icon-3-b.jpg' );
//  var icon4b = require( 'image!AREA_BUILDER/icon-4-b.jpg' );
//  var icon5b = require( 'image!AREA_BUILDER/icon-5-b.jpg' );

  // constants
  var BUTTON_FONT = new PhetFont( 18 );
  var BUTTON_FILL = '#F2E916';

  // TODO - Temporary stuff for supporting 'fake' challenges, remove when all challenges working.
  // Utility function
  function generateRandomColor() {
    var r = Math.round( Math.random() * 255 );
    var g = Math.round( Math.random() * 255 );
    var b = Math.round( Math.random() * 255 );
    return '#' + ( r * 256 * 256 + g * 256 + b ).toString( 16 );
  }

  // ---------- End of temp stuff for fake challenges ---------------


  /**
   * @param {AreaBuilderGameModel} gameModel
   * @constructor
   */
  function AreaBuilderGameView( gameModel ) {
    ScreenView.call( this, { renderer: 'svg' } );
    var self = this;
    self.model = gameModel;

    // Create a root node and send to back so that the layout bounds box can be made visible if needed.
    self.rootNode = new Node();
    self.addChild( self.rootNode );
    self.rootNode.moveToBack();

    // Add layers used to control game appearance.
    self.controlLayer = new Node();
    self.rootNode.addChild( self.controlLayer );
    self.challengeLayer = new Node();
    self.rootNode.addChild( self.challengeLayer );

    // Add the node that allows the user to choose a game level to play.
    self.startGameLevelNode = new StartGameLevelNode(
      function( level ) { gameModel.startLevel( level ); },
      function() { gameModel.reset(); },
      gameModel.timerEnabledProperty,
      gameModel.soundEnabledProperty,
      [
        new Image( icon1a ),
        new Image( icon2a ),
        new Image( icon3a ),
        new Image( icon4a ),
        new Image( icon5a )
//        new Image( icon1b ),
//        new Image( icon2b ),
//        new Image( icon3b ),
//        new Image( icon4b ),
//        new Image( icon5b )
      ],
      gameModel.bestScores,
      {
        numStarsOnButtons: gameModel.challengesPerProblemSet,
        perfectScore: gameModel.maxPossibleScore,
        numLevels: gameModel.numberOfLevels
      }
    );
    self.rootNode.addChild( self.startGameLevelNode );

    // Hook up the audio player to the sound settings.
    self.gameAudioPlayer = new GameAudioPlayer( gameModel.soundEnabledProperty );

    // Add the title.  It is blank to start with, and is updated later at the appropriate state change.
    self.challengeTitleNode = new Text( '',
      {
        font: new PhetFont( { size: 60, weight: 'bold' } ),
        fill: 'white',
        stroke: 'black',
        lineWidth: 1.5,
        top: 5 // Empirically determined based on appearance
      } );
    self.challengeLayer.addChild( self.challengeTitleNode );

    // Add the scoreboard.
    this.scoreboard = new AreaBuilderScoreboard(
      gameModel.levelProperty,
      gameModel.challengeIndexProperty,
      gameModel.challengesPerProblemSet,
      gameModel.scoreProperty,
      gameModel.elapsedTimeProperty,
      gameModel.timerEnabledProperty,
      gameModel.additionalModel.shapePlacementBoard.showGridProperty,
      new Property( false ), // TODO: wire up to the show dimensions property
      { top: 100, left: 20 }
    );
    self.controlLayer.addChild( this.scoreboard );

    // Add the button for returning to the level selection screen.
    self.controlLayer.addChild( new ReturnToLevelSelectButton( {
      listener: function() { gameModel.setChoosingLevelState(); },
      left: this.scoreboard.left,
      top: 20
    } ) );

    // Create the 'feedback node' that is used to visually indicate correct and incorrect answers.
    self.faceWithPointsNode = new FaceWithPointsNode(
      {
        faceOpacity: 0.6,
        faceDiameter: self.layoutBounds.width * 0.31,
        pointsFill: 'yellow',
        pointsStroke: 'black',
        pointsAlignment: 'rightCenter',
        centerX: this.layoutBounds.centerX,
        centerY: this.layoutBounds.centerY
      } );
    self.addChild( self.faceWithPointsNode );

    // Set up the constant portions of the challenge view
    var shapeBoard = new ShapePlacementBoardNode( gameModel.additionalModel.shapePlacementBoard );
    this.challengeLayer.addChild( shapeBoard );
    // TODO: Temp - node containing the challenge presentation (a check box for now)
    this.challengeView = new Node();
    this.challengeLayer.addChild( this.challengeView );

    // Add and lay out the game control buttons.
    self.gameControlButtons = [];
    var buttonOptions = {
      font: BUTTON_FONT,
      baseColor: BUTTON_FILL,
      cornerRadius: 4
    };
    self.checkAnswerButton = new TextPushButton( checkString, _.extend( {
      listener: function() {
        gameModel.checkAnswer();
      } }, buttonOptions ) );
    self.gameControlButtons.push( self.checkAnswerButton );

    self.nextButton = new TextPushButton( nextString, _.extend( {
      listener: function() { gameModel.nextChallenge(); }
    }, buttonOptions ) );
    self.gameControlButtons.push( self.nextButton );

    self.tryAgainButton = new TextPushButton( tryAgainString, _.extend( {
      listener: function() { gameModel.tryAgain(); }
    }, buttonOptions ) );
    self.gameControlButtons.push( self.tryAgainButton );

    self.displayCorrectAnswerButton = new TextPushButton( showAnswerString, _.extend( {
      listener: function() { gameModel.displayCorrectAnswer(); }
    }, buttonOptions ) );
    self.gameControlButtons.push( self.displayCorrectAnswerButton );

    var buttonCenterX = ( this.layoutBounds.width + shapeBoard.right ) / 2;
    var buttonBottom = shapeBoard.bottom;
    self.gameControlButtons.forEach( function( button ) {
      button.centerX = buttonCenterX;
      button.bottom = buttonBottom;
      self.rootNode.addChild( button );
    } );

    // Various other initialization
    self.levelCompletedNode = null;

    // Hook up the update function for handling changes to game state.
    gameModel.gameStateProperty.link( self.handleGameStateChange.bind( self ) );
  }

  return inherit( ScreenView, AreaBuilderGameView, {

    // When the game state changes, update the view with the appropriate buttons and readouts.
    handleGameStateChange: function( gameState ) {

      // Hide all nodes - the appropriate ones will be shown later based on the current state.
      this.hideAllGameNodes();

      // Show the nodes appropriate to the state
      switch( gameState ) {
        case 'choosingLevel':
          this.show( [ this.startGameLevelNode ] );
          this.hideChallenge();
          break;

        case 'presentingInteractiveChallenge':
          this.challengeLayer.pickable = null; // Pass through, prunes subtree, see Scenery documentation for details.
          this.presentChallenge();
          this.show( [ this.scoreboard, this.challengeTitleNode, this.checkAnswerButton, this.challengeView ] );
          this.showChallengeGraphics();
          break;

        case 'showingCorrectAnswerFeedback':

          // Show the appropriate nodes for this state.
          this.show( [ this.scoreboard, this.nextButton, this.challengeView ] );

          // Give the user the appropriate audio and visual feedback
          this.gameAudioPlayer.correctAnswer();
          this.faceWithPointsNode.smile();
          this.faceWithPointsNode.setPoints( this.model.getChallengeCurrentPointValue() );
          this.faceWithPointsNode.visible = true;

          // Disable interaction with the challenge elements.
          this.challengeLayer.pickable = false;

          break;

        case 'showingIncorrectAnswerFeedbackTryAgain':

          // Show the appropriate nodes for this state.
          this.show( [ this.scoreboard, this.tryAgainButton, this.challengeView ] );

          // Give the user the appropriate feedback
          this.gameAudioPlayer.wrongAnswer();
          this.faceWithPointsNode.frown();
          this.faceWithPointsNode.setPoints( this.model.score );
          this.faceWithPointsNode.visible = true;

          // Disable interaction with the challenge elements.
          this.challengeLayer.pickable = false;

          break;

        case 'showingIncorrectAnswerFeedbackMoveOn':

          // Show the appropriate nodes for this state.
          this.show( [ this.scoreboard, this.displayCorrectAnswerButton, this.challengeView ] );

          // Give the user the appropriate feedback
          this.gameAudioPlayer.wrongAnswer();
          this.faceWithPointsNode.frown();
          this.faceWithPointsNode.setPoints( this.model.score );
          this.faceWithPointsNode.visible = true;

          // Disable interaction with the challenge elements.
          this.challengeLayer.pickable = false;

          break;

        case 'displayingCorrectAnswer':

          // Show the appropriate nodes for this state.
          this.show( [ this.scoreboard, this.nextButton, this.challengeView ] );

          // Display the correct answer
          // TODO: Display the correct answer.
          this.model.displayCorrectAnswer();
          this.showChallengeGraphics();

          // Disable interaction with the challenge elements.
          this.challengeLayer.pickable = false;

          break;

        case 'showingLevelResults':
          if ( this.model.score === this.model.maxPossibleScore ) {
            this.gameAudioPlayer.gameOverPerfectScore();
          }
          else if ( this.model.score === 0 ) {
            this.gameAudioPlayer.gameOverZeroScore();
          }
          else {
            this.gameAudioPlayer.gameOverImperfectScore();
          }

          this.showLevelResultsNode();
          this.hideChallenge();
          break;

        default:
          throw new Error( 'Unhandled game state' );
      }
    },

    presentChallenge: function() {
      // TODO: Temporary challenge representation
      if ( this.model.incorrectGuessesOnCurrentChallenge === 0 ) {
        this.challengeView.removeAllChildren();
        this.model.additionalModel.fakeCorrectAnswerProperty.reset();
        this.challengeView.addChild( new CheckBox( new Text( 'Correct Answer', { font: new PhetFont( 20 ) } ),
          this.model.additionalModel.fakeCorrectAnswerProperty, { left: 300, top: 200 } ) );
        var color = generateRandomColor();
        var coloredRectangle = new Rectangle( 0, 0, 40, 20, 0, 0, {
          fill: color, stroke: 'black', left: 300, top: 150 } );
        this.challengeView.addChild( coloredRectangle );
        this.challengeView.addChild( new Text( color, { font: new PhetFont( 14 ), left: coloredRectangle.right + 50, centerY: coloredRectangle.centerY } ) );
      }
      //TODO: End of temporary stuff
    },

    // Utility method for hiding all of the game nodes whose visibility changes
    // during the course of a challenge.
    hideAllGameNodes: function() {
      this.gameControlButtons.forEach( function( button ) { button.visible = false; } );
      this.setNodeVisibility( false, [ this.startGameLevelNode, this.challengeTitleNode, this.faceWithPointsNode, this.scoreboard ] );
    },

    show: function( nodesToShow ) {
      nodesToShow.forEach( function( nodeToShow ) { nodeToShow.visible = true; } );
    },

    setNodeVisibility: function( isVisible, nodes ) {
      nodes.forEach( function( node ) { node.visible = isVisible; } );
    },

    hideChallenge: function() {
      this.challengeLayer.visible = false;
      this.controlLayer.visible = false;
    },

    // Show the graphic model elements for this challenge.
    showChallengeGraphics: function() {
      this.challengeLayer.visible = true;
      this.controlLayer.visible = true;
    },

    showLevelResultsNode: function() {
      var thisScreen = this;

      // Set a new "level completed" node based on the results.
      thisScreen.levelCompletedNode = new LevelCompletedNode(
        this.model.level,
        this.model.score,
        this.model.maxPossibleScore,
        this.model.challengesPerProblemSet,
        this.model.timerEnabled,
        this.model.elapsedTime,
        this.model.bestTimes[ this.model.level ],
        thisScreen.model.newBestTime,
        function() {
          thisScreen.model.gameState = 'choosingLevel';
          thisScreen.rootNode.removeChild( thisScreen.levelCompletedNode );
          thisScreen.levelCompletedNode = null;
        },
        {
          center: thisScreen.layoutBounds.center
        }
      );

      // Add the node.
      this.rootNode.addChild( thisScreen.levelCompletedNode );
    }
  } );
} );
