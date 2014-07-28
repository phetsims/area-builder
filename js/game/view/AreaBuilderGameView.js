// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main screen for the balance game.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderGameModel = require( 'AREA_BUILDER/game/model/AreaBuilderGameModel' );
  var AreaBuilderScoreboard = require( 'AREA_BUILDER/game/view/AreaBuilderScoreboard' );
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var ChallengePromptBanner = require( 'AREA_BUILDER/game/view/ChallengePromptBanner' );
  var CheckBox = require( 'SUN/CheckBox' );
  var EraserButton = require( 'AREA_BUILDER/common/view/EraserButton' );
  var FaceWithPointsNode = require( 'SCENERY_PHET/FaceWithPointsNode' );
  var GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberEntryControl = require( 'AREA_BUILDER/game/view/NumberEntryControl' );
  var LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ShapeCreatorNode = require( 'AREA_BUILDER/game/view/ShapeCreatorNode' );
  var ShapePlacementBoardNode = require( 'AREA_BUILDER/common/view/ShapePlacementBoardNode' );
  var ShapeView = require( 'AREA_BUILDER/common/view/ShapeView' );
  var SolutionBanner = require( 'AREA_BUILDER/game/view/SolutionBanner' );
  var StartGameLevelNode = require( 'AREA_BUILDER/game/view/StartGameLevelNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var YourSolutionWindow = require( 'AREA_BUILDER/game/view/YourSolutionWindow' );

  // strings
  var areaEqualsString = require( 'string!AREA_BUILDER/areaEquals' );
  var areaQuestionString = require( 'string!AREA_BUILDER/areaQuestion' );
  var buildItString = require( 'string!AREA_BUILDER/buildIt' );
  var checkString = require( 'string!VEGAS/check' );
  var nextString = require( 'string!VEGAS/next' );
  var perimeterEqualsString = require( 'string!AREA_BUILDER/perimeterEquals' );
  var showSolutionString = require( 'string!AREA_BUILDER/showSolution' );
  var tryAgainString = require( 'string!VEGAS/tryAgain' );
  var yourGoalString = require( 'string!AREA_BUILDER/yourGoal' );

  // images
  var icon1a = require( 'image!AREA_BUILDER/icon-1-a.jpg' );
  var icon2a = require( 'image!AREA_BUILDER/icon-2-a.jpg' );
  var icon3a = require( 'image!AREA_BUILDER/icon-3-a.jpg' );
  var icon4a = require( 'image!AREA_BUILDER/icon-4-a.jpg' );
  var icon5a = require( 'image!AREA_BUILDER/icon-5-a.jpg' );

  // constants
  var BUTTON_FONT = new PhetFont( 18 );
  var BUTTON_FILL = '#F2E916';
  var INFO_BANNER_HEIGHT = 50; // Height of the prompt and solution banners, empirically determined.

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
    this.rootNode = new Node();
    this.addChild( self.rootNode );
    this.rootNode.moveToBack();

    // Add layers used to control game appearance.
    this.controlLayer = new Node();
    this.rootNode.addChild( this.controlLayer );
    this.challengeLayer = new Node();
    this.rootNode.addChild( this.challengeLayer );

    // Add the node that allows the user to choose a game level to play.
    this.startGameLevelNode = new StartGameLevelNode(
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
      ],
      gameModel.bestScores,
      {
        numStarsOnButtons: gameModel.challengesPerProblemSet,
        perfectScore: gameModel.maxPossibleScore,
        numLevels: gameModel.numberOfLevels
      }
    );
    this.rootNode.addChild( this.startGameLevelNode );

    // Hook up the audio player to the sound settings.
    this.gameAudioPlayer = new GameAudioPlayer( gameModel.soundEnabledProperty );

    // Add the scoreboard.
    this.scoreboard = new AreaBuilderScoreboard(
      gameModel.levelProperty,
      gameModel.challengeIndexProperty,
      gameModel.challengesPerProblemSet,
      gameModel.scoreProperty,
      gameModel.elapsedTimeProperty,
      gameModel.timerEnabledProperty,
      gameModel.simSpecificModel.showGridProperty,
      gameModel.simSpecificModel.showDimensionsProperty,
      { top: 100, left: 20 }
    );
    this.controlLayer.addChild( this.scoreboard );

    // Add the button for returning to the level selection screen.
    this.controlLayer.addChild( new RectangularPushButton( {
      content: new Text( 'Start Over', { font: BUTTON_FONT } ),
      listener: function() { gameModel.setChoosingLevelState(); },
      baseColor: BUTTON_FILL,
      left: this.scoreboard.left,
      top: 20
    } ) );

    // Set up the constant portions of the challenge view
    this.shapeBoard = new ShapePlacementBoardNode( gameModel.simSpecificModel.shapePlacementBoard );
    this.challengeLayer.addChild( this.shapeBoard );
    this.eraserButton = new EraserButton( {
      right: this.shapeBoard.right,
      top: this.shapeBoard.bottom + 10,
      listener: function() {
        gameModel.simSpecificModel.shapePlacementBoard.releaseAllShapes( true );
      }
    } );
    this.challengeLayer.addChild( this.eraserButton );
    // TODO: Do I need a separate challengeView?  Or just do it all on challengeLayer?
    this.challengeView = new Node();
    this.challengeLayer.addChild( this.challengeView );
    this.yourSolutionWindow = new YourSolutionWindow( this.layoutBounds.width - this.shapeBoard.right - 20, 85, {
      centerX: ( this.layoutBounds.width + this.shapeBoard.right ) / 2,
      centerY: this.shapeBoard.centerY
    } );
    this.challengeLayer.addChild( this.yourSolutionWindow );
    this.answerFeedback = new Node();
    this.challengeLayer.addChild( this.answerFeedback );
    this.challengePromptBanner = new ChallengePromptBanner( this.shapeBoard.width, INFO_BANNER_HEIGHT, {
      left: this.shapeBoard.left,
      bottom: this.shapeBoard.top - 10
    } );
    this.challengeLayer.addChild( this.challengePromptBanner );
    this.solutionBanner = new SolutionBanner( this.shapeBoard.width, INFO_BANNER_HEIGHT, {
      left: this.shapeBoard.left,
      bottom: this.shapeBoard.top - 10
    } );
    this.challengeLayer.addChild( this.solutionBanner );

    // Add the 'Build Prompt' node that is shown temporarily over the board to instruct the user about what to build.
    this.buildPromptText = new MultiLineText( '',
      {
        font: new PhetFont( { size: 20, weight: 'bold' } )
      } );
    this.buildPromptPanel = new Panel( this.buildPromptText, {
      stroke: null,
      xMargin: 10,
      yMargin: 10
    } );
    this.challengeLayer.addChild( this.buildPromptPanel );

    // Define some variables for taking a snapshot of the user's solution.
    this.areaOfUserCreatedShape = 0;
    this.perimeterOfUserCreatedShape = 0;

    // Add and lay out the game control buttons.
    this.gameControlButtons = [];
    var buttonOptions = {
      font: BUTTON_FONT,
      baseColor: BUTTON_FILL,
      cornerRadius: 4
    };
    this.checkAnswerButton = new TextPushButton( checkString, _.extend( {
      listener: function() {
        // Save the parameters of what the user has built, if they've built anything.
        self.areaOfUserCreatedShape = gameModel.simSpecificModel.shapePlacementBoard.area;
        self.perimeterOfUserCreatedShape = gameModel.simSpecificModel.shapePlacementBoard.perimeter;

        // Submit the user's area guess, if there is one.
        gameModel.simSpecificModel.areaGuess = self.numberEntryControl.value;

        // Check the answer.
        gameModel.checkAnswer();
      } }, buttonOptions ) );
    this.gameControlButtons.push( this.checkAnswerButton );

    this.nextButton = new TextPushButton( nextString, _.extend( {
      listener: function() { gameModel.nextChallenge(); }
    }, buttonOptions ) );
    this.gameControlButtons.push( this.nextButton );

    this.tryAgainButton = new TextPushButton( tryAgainString, _.extend( {
      listener: function() { gameModel.tryAgain(); }
    }, buttonOptions ) );
    this.gameControlButtons.push( this.tryAgainButton );

    this.displayCorrectAnswerButton = new TextPushButton( showSolutionString, _.extend( {
      listener: function() { gameModel.displayCorrectAnswer(); }
    }, buttonOptions ) );
    this.gameControlButtons.push( this.displayCorrectAnswerButton );

    var buttonCenterX = ( this.layoutBounds.width + this.shapeBoard.right ) / 2;
    var buttonBottom = this.shapeBoard.bottom;
    this.gameControlButtons.forEach( function( button ) {
      button.centerX = buttonCenterX;
      button.bottom = buttonBottom;
      self.rootNode.addChild( button );
    } );

    // Add the number entry control, which is only visible on certain challenge types.
    this.numberEntryControl = new NumberEntryControl( { centerX: buttonCenterX, bottom: this.checkAnswerButton.top - 10 } );
    this.challengeLayer.addChild( this.numberEntryControl );
    this.areaQuestionPrompt = new Text( areaQuestionString, { // This prompt goes with the number entry control.
      font: new PhetFont( 20 ),
      centerX: this.numberEntryControl.centerX,
      bottom: this.numberEntryControl.top - 10
    } );
    this.challengeLayer.addChild( this.areaQuestionPrompt );

    // Add the 'feedback node' that is used to visually indicate correct and incorrect answers.
    this.faceWithPointsNode = new FaceWithPointsNode( {
      faceDiameter: 85,
      pointsAlignment: 'rightBottom',
      centerX: buttonCenterX,
      top: buttonBottom + 20,
      pointsFont: new PhetFont( { size: 20, weight: 'bold' } )
    } );
    this.addChild( this.faceWithPointsNode );

    // Handle comings and goings of model shapes.
    gameModel.simSpecificModel.movableShapes.addItemAddedListener( function( addedShape ) {

      // Create and add the view representation for this shape.
      var shapeView = new ShapeView( addedShape );
      self.challengeLayer.addChild( shapeView );

      // Move the shape to the front when grabbed by the user.
      addedShape.userControlledProperty.link( function( userControlled ) {
        if ( userControlled ) {
          shapeView.moveToFront();
        }
      } );

      // Add the removal listener for if and when this shape is removed from the model.
      gameModel.simSpecificModel.movableShapes.addItemRemovedListener( function removalListener( removedShape ) {
        if ( removedShape === addedShape ) {
          self.challengeLayer.removeChild( shapeView );
          gameModel.simSpecificModel.movableShapes.removeItemRemovedListener( removalListener );
        }
      } );

      // If the initial build prompt is visible, hide it.
      if ( self.buildPromptPanel.opacity === 1 ) {
        new TWEEN.Tween( self.buildPromptPanel ).to( { opacity: 0 }, 600 ).easing( TWEEN.Easing.Cubic.InOut ).start();
      }

      // Show the build prompts on the challenge prompt banner if they aren't shown already.
      self.challengePromptBanner.properties.promptsVisible = true;
    } );

    // Various other initialization
    this.levelCompletedNode = null;
    this.shapeCarousel = null;

    // Hook up the update function for handling changes to game state.
    gameModel.gameStateProperty.link( self.handleGameStateChange.bind( self ) );
  }

  return inherit( ScreenView, AreaBuilderGameView, {

    // When the game state changes, update the view with the appropriate buttons and readouts.
    handleGameStateChange: function( gameState ) {

      // Hide all nodes - the appropriate ones will be shown later based on the current state.
      this.hideAllGameNodes();

      var challenge = this.model.currentChallenge; // convenience var

      // Show the nodes appropriate to the state
      switch( gameState ) {
        case 'choosingLevel':
          this.show( [ this.startGameLevelNode ] );
          this.hideChallenge();
          break;

        case 'presentingInteractiveChallenge':
          this.challengeLayer.pickable = null; // Pass through, prunes subtree, see Scenery documentation for details.
          this.presentChallenge();
          this.show( [
            this.scoreboard,
            this.checkAnswerButton,
            this.challengeView,
            this.challengePromptBanner
          ] );
          this.showChallengeGraphics();
          break;

        case 'showingCorrectAnswerFeedback':

          // Show the appropriate nodes for this state.
          this.show( [ this.scoreboard, this.nextButton, this.challengeView, this.challengePromptBanner ] );

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
          this.show( [ this.scoreboard, this.tryAgainButton, this.challengeView, this.challengePromptBanner ] );

          // Give the user the appropriate feedback
          this.gameAudioPlayer.wrongAnswer();
          this.faceWithPointsNode.grimace();
          this.faceWithPointsNode.setPoints( this.model.score );
          this.faceWithPointsNode.visible = true;

          // Disable interaction with the challenge elements.
          this.challengeLayer.pickable = false;

          break;

        case 'showingIncorrectAnswerFeedbackMoveOn':

          // Show the appropriate nodes for this state.
          this.show( [
            this.scoreboard,
            this.displayCorrectAnswerButton,
            this.challengeView,
            this.challengePromptBanner
          ] );

          // Give the user the appropriate feedback
          this.gameAudioPlayer.wrongAnswer();
          this.faceWithPointsNode.grimace();
          this.faceWithPointsNode.setPoints( this.model.score );
          this.faceWithPointsNode.visible = true;

          // Disable interaction with the challenge elements.
          this.challengeLayer.pickable = false;

          break;

        case 'displayingCorrectAnswer':

          // Show the appropriate nodes for this state.
          this.show( [
            this.scoreboard,
            this.nextButton,
            this.challengeView,
            this.answerFeedback,
            this.solutionBanner
          ] );

          this.solutionBanner.reset();
          this.answerFeedback.removeAllChildren();
          if ( challenge.buildSpec ) {
            if ( challenge.buildSpec.perimeter ) {
              this.yourSolutionWindow.setAreaAndPerimeter( this.areaOfUserCreatedShape, this.perimeterOfUserCreatedShape );
            }
            else {
              this.yourSolutionWindow.setAreaOnly( this.areaOfUserCreatedShape );
            }
            this.yourSolutionWindow.visible = true;
          }

          // TODO: Remove once fake challenges go away.
          if ( challenge.fakeChallenge ) {
            this.model.simSpecificModel.fakeCorrectAnswer = true;
          }

          // Update the solution banner.
          this.solutionBanner.reset();
          if ( challenge.buildSpec ) {
            this.solutionBanner.properties.mode = 'buildIt';
            this.solutionBanner.properties.targetArea = challenge.buildSpec.area;
            this.solutionBanner.properties.targetPerimeter = challenge.buildSpec.perimeter || null;
          }
          else {
            this.solutionBanner.properties.mode = 'findArea';
            this.solutionBanner.properties.targetArea = challenge.backgroundShape.unitArea;
          }
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

      var self = this;
      this.numberEntryControl.clear();

      if ( this.model.incorrectGuessesOnCurrentChallenge === 0 ) {

        // Clean up previous challenge.
        this.model.simSpecificModel.clearShapePlacementBoard();
        this.challengePromptBanner.reset();
        if ( this.shapeCarousel !== null ) {
          this.challengeLayer.removeChild( this.shapeCarousel );
          this.shapeCarousel = null;
        }

        // Set up the titles and prompts
        var challenge = this.model.currentChallenge; // Convenience var
        this.challengePromptBanner.properties.mode = challenge.buildSpec ? 'buildIt' : 'findArea';
        if ( challenge.buildSpec ) {

          // Set the prompt values.
          this.challengePromptBanner.properties.targetArea = challenge.buildSpec.area;
          this.challengePromptBanner.properties.targetPerimeter = challenge.buildSpec.perimeter || null;

          // The prompts on the banner are initially invisible, and show up once the user adds a shape.
          this.challengePromptBanner.properties.promptsVisible = false;
        }
        this.challengeView.removeAllChildren();
        if ( challenge.buildSpec ) {
          var promptText = StringUtils.format( areaEqualsString, challenge.buildSpec.area );
          if ( challenge.buildSpec.perimeter ) {
            promptText += '   ' + StringUtils.format( perimeterEqualsString, challenge.buildSpec.perimeter );
          }
          this.buildPromptText.text = yourGoalString + '\n\n' + promptText + '\n\n' + buildItString;
          this.buildPromptPanel.centerX = this.shapeBoard.centerX;
          this.buildPromptPanel.centerY = this.shapeBoard.centerY;
          this.buildPromptPanel.visible = true;
          this.buildPromptPanel.opacity = 1; // Necessary because the board is set to fade out elsewhere.
        }
        else {
          this.buildPromptText.text = '';
          this.buildPromptPanel.visible = false;
        }

        // Set the state of the control panel/scoreboard.
        this.scoreboard.dimensionsIcon.setStyle( challenge.backgroundShape ? 'background' : 'composite' );

        // Create the carousel if present
        if ( challenge.userShapes !== null ) {
          var creatorNodes = [];
          challenge.userShapes.forEach( function( userShapeSpec ) {
            creatorNodes.push( new ShapeCreatorNode( userShapeSpec.shape, userShapeSpec.color, self.model.simSpecificModel, {
              gridSpacing: AreaBuilderGameModel.UNIT_SQUARE_LENGTH
            } ) );
          } );
          var creatorNodeHBox = new HBox( { children: creatorNodes, spacing: 20 } );
          // TODO: This is just a panel now, needs to become a real carousel at some point.
          this.shapeCarousel = new Panel( creatorNodeHBox, {
            centerX: this.shapeBoard.centerX,
            top: this.shapeBoard.bottom + 10,
            xMargin: 50,
            yMargin: 15,
            fill: AreaBuilderSharedConstants.CONTROL_PANEL_BACKGROUND_COLOR
          } );
          this.challengeLayer.addChild( this.shapeCarousel );
        }

        // Position the eraser button.
        this.eraserButton.left = this.shapeBoard.left;
        if ( challenge.userShapes !== null && this.eraserButton.right + 10 >= this.shapeCarousel.left ) {
          this.eraserButton.right = this.shapeCarousel.left - 10;
        }

        // Show the number entry control if this is a "find the area" style of challenge.
        this.numberEntryControl.visible = challenge.showNumberEntryPad;
        this.areaQuestionPrompt.visible = challenge.showNumberEntryPad;

        // Preset the fake challenge if specified. TODO: Remove once fake challenges no longer exist.
        if ( this.model.currentChallenge.fakeChallenge ) {
          this.model.simSpecificModel.fakeCorrectAnswerProperty.reset();
          this.challengeView.addChild( new CheckBox( new Text( 'Correct Answer', { font: new PhetFont( 20 ) } ),
            this.model.simSpecificModel.fakeCorrectAnswerProperty, { left: 300, top: 200 } ) );
          var color = generateRandomColor();
          var coloredRectangle = new Rectangle( 0, 0, 40, 20, 0, 0, {
            fill: color, stroke: 'black', left: 300, top: 150 } );
          this.challengeView.addChild( coloredRectangle );
          this.challengeView.addChild( new Text( color, { font: new PhetFont( 14 ), left: coloredRectangle.right + 50, centerY: coloredRectangle.centerY } ) );
        }
      }
    },

    // Utility method for hiding all of the game nodes whose visibility changes
    // during the course of a challenge.
    hideAllGameNodes: function() {
      this.gameControlButtons.forEach( function( button ) { button.visible = false; } );
      this.setNodeVisibility( false, [
        this.startGameLevelNode,
        this.faceWithPointsNode,
        this.scoreboard,
        this.answerFeedback,
        this.challengePromptBanner,
        this.solutionBanner,
        this.yourSolutionWindow
      ] );
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
