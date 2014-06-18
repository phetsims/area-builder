// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main screen for the balance game.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderAdditionalGameModel = require( 'AREA_BUILDER/game/model/AreaBuilderAdditionalGameModel' );
  var AreaBuilderScoreboard = require( 'AREA_BUILDER/game/view/AreaBuilderScoreboard' );
  var CheckBox = require( 'SUN/CheckBox' );
  var Color = require( 'SCENERY/util/Color' );
  var FaceWithPointsNode = require( 'SCENERY_PHET/FaceWithPointsNode' );
  var GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ShapePlacementBoardNode = require( 'AREA_BUILDER/common/view/ShapePlacementBoardNode' );
  var StartGameLevelNode = require( 'AREA_BUILDER/game/view/StartGameLevelNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var checkString = require( 'string!VEGAS/check' );
  var nextString = require( 'string!VEGAS/next' );
  var showAnswerString = require( 'string!VEGAS/showAnswer' );
  var tryAgainString = require( 'string!VEGAS/tryAgain' );

  // constants
  var BUTTON_FONT = new PhetFont( 18 );
  var BUTTON_FILL = '#F2E916';

  /**
   * @param {AreaBuilderGameModel} gameModel
   * @constructor
   */
  function AreaBuilderGameView( gameModel ) {
    ScreenView.call( this, { renderer: 'svg' } );
    var thisScreen = this;
    thisScreen.model = gameModel;

    // Create a root node and send to back so that the layout bounds box can be made visible if needed.
    thisScreen.rootNode = new Node();
    thisScreen.addChild( thisScreen.rootNode );
    thisScreen.rootNode.moveToBack();

    // Add layers used to control game appearance.
    thisScreen.controlLayer = new Node();
    thisScreen.rootNode.addChild( thisScreen.controlLayer );
    thisScreen.challengeLayer = new Node();
    thisScreen.rootNode.addChild( thisScreen.challengeLayer );

    // Add the node that allows the user to choose a game level to play.
    thisScreen.startGameLevelNode = new StartGameLevelNode(
      function( level ) { gameModel.startLevel( level ); },
      function() { gameModel.reset(); },
      gameModel.timerEnabledProperty,
      gameModel.soundEnabledProperty,
      [
        new Rectangle( 0, 0, 30, 20, 0, 0, { fill: 'pink' } ),
        new Rectangle( 0, 0, 30, 20, 0, 0, { fill: 'blue' } ),
        new Rectangle( 0, 0, 30, 20, 0, 0, { fill: 'red' } ),
        new Rectangle( 0, 0, 30, 20, 0, 0, { fill: 'green' } ),
        new Rectangle( 0, 0, 30, 20, 0, 0, { fill: 'magenta' } )
      ],
      gameModel.bestScores,
      {
        numStarsOnButtons: gameModel.challengesPerProblemSet,
        perfectScore: gameModel.maxPossibleScore,
        numLevels: gameModel.numberOfLevels
      }
    );
    thisScreen.rootNode.addChild( thisScreen.startGameLevelNode );

    // Initialize a reference to the 'level completed' node.
    thisScreen.levelCompletedNode = null;

    // Hook up the audio player to the sound settings.
    thisScreen.gameAudioPlayer = new GameAudioPlayer( gameModel.soundEnabledProperty );

    // Add the title.  It is blank to start with, and is updated later at the appropriate state change.
    // TODO: Not sure if needed (leftover from BA), delete later if not.
    thisScreen.challengeTitleNode = new Text( '',
      {
        font: new PhetFont( { size: 60, weight: 'bold' } ),
        fill: 'white',
        stroke: 'black',
        lineWidth: 1.5,
        top: 5 // Empirically determined based on appearance
      } );
    thisScreen.challengeLayer.addChild( thisScreen.challengeTitleNode );

    // Add the scoreboard.
    this.scoreboard = new AreaBuilderScoreboard(
        gameModel.levelProperty,
        gameModel.scoreProperty,
        gameModel.elapsedTimeProperty,
        gameModel.timerEnabledProperty,
      gameModel.additionalModel.shapePlacementBoard.gridVisibleProperty,
        new Property( false ), // TODO: wire up to the show dimensions property
      { top: 100, left: 20 }
    );
    thisScreen.controlLayer.addChild( this.scoreboard );

    // Create the 'feedback node' that is used to visually indicate correct and incorrect answers.
    thisScreen.faceWithPointsNode = new FaceWithPointsNode(
      {
        faceOpacity: 0.6,
        faceDiameter: thisScreen.layoutBounds.width * 0.31,
        pointsFill: 'yellow',
        pointsStroke: 'black',
        pointsAlignment: 'rightCenter',
        centerX: this.layoutBounds.centerX,
        centerY: this.layoutBounds.centerY
      } );
    thisScreen.addChild( thisScreen.faceWithPointsNode );

    // Set up the constant portions of the challenge view
    var shapeBoard = new ShapePlacementBoardNode( gameModel.additionalModel.shapePlacementBoard );
    this.challengeLayer.addChild( shapeBoard );
    // TODO: Temp - node containing the challenge presentation (a check box for now)
    this.challengeView = new Node();
    this.challengeLayer.addChild( this.challengeView );

    // Add and lay out the buttons.
    thisScreen.buttons = [];
    var buttonOptions = {
      font: BUTTON_FONT,
      baseColor: BUTTON_FILL,
      cornerRadius: 4
    };
    thisScreen.checkAnswerButton = new TextPushButton( checkString, _.extend( {
      listener: function() {
        gameModel.checkAnswer();
      } }, buttonOptions ) );
    thisScreen.rootNode.addChild( thisScreen.checkAnswerButton );
    thisScreen.buttons.push( thisScreen.checkAnswerButton );

    thisScreen.nextButton = new TextPushButton( nextString, _.extend( {
      listener: function() { gameModel.nextChallenge(); }
    }, buttonOptions ) );
    thisScreen.rootNode.addChild( thisScreen.nextButton );
    thisScreen.buttons.push( thisScreen.nextButton );

    thisScreen.tryAgainButton = new TextPushButton( tryAgainString, {
      listener: function() { gameModel.tryAgain(); },
      font: BUTTON_FONT,
      baseColor: BUTTON_FILL
    } );
    thisScreen.tryAgainButton = new TextPushButton( tryAgainString, _.extend( {
      listener: function() { gameModel.tryAgain(); }
    }, buttonOptions ) );
    thisScreen.rootNode.addChild( thisScreen.tryAgainButton );
    thisScreen.buttons.push( thisScreen.tryAgainButton );

    thisScreen.displayCorrectAnswerButton = new TextPushButton( showAnswerString, _.extend( {
      listener: function() { gameModel.displayCorrectAnswer(); }
    }, buttonOptions ) );
    thisScreen.rootNode.addChild( thisScreen.displayCorrectAnswerButton );
    thisScreen.buttons.push( thisScreen.displayCorrectAnswerButton );

    var buttonCenterX = ( this.layoutBounds.width + shapeBoard.right ) / 2;
    var buttonBottom = shapeBoard.bottom;
    thisScreen.buttons.forEach( function( button ) {
      button.centerX = buttonCenterX;
      button.bottom = buttonBottom;
    } );

    // Register for changes to the game state and update accordingly.
    gameModel.gameStateProperty.link( thisScreen.handleGameStateChange.bind( thisScreen ) );
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
          this.updateTitle();
          this.challengeLayer.pickable = null; // Pass through, prunes subtree, see Scenery documentation for details.
          // TODO: Temporary challenge representation
          this.challengeView.removeAllChildren();
          this.challengeView.addChild( new CheckBox( new Text( 'Correct Answer', { font: new PhetFont( 20 ) } ), this.model.challengeList[ this.model.challengeIndex ].correctAnswerProperty, { left: 300, top: 200 } ) );
          var coloredRectangle = new Rectangle( 0, 0, 40, 20, 0, 0, { fill: this.model.challengeList[ this.model.challengeIndex ].color, stroke: 'black', left: 300, top: 150 } );
          this.challengeView.addChild( coloredRectangle );
          this.challengeView.addChild( new Text( this.model.challengeList[ this.model.challengeIndex ].id, { font: new PhetFont( 14 ), left: coloredRectangle.right + 50, centerY: coloredRectangle.centerY } ) );
          //TODO: End of temporary stuff

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
          this.model.challengeList[ this.model.challengeIndex ].correctAnswerProperty.value = true;
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

    updateTitle: function() {
      //TODO: stubbed for now, not sure if needed
    },

    // Utility method for hiding all of the game nodes whose visibility changes
    // during the course of a challenge.
    hideAllGameNodes: function() {
      this.buttons.forEach( function( button ) { button.visible = false; } );
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
