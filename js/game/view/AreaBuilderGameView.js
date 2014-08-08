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
  var ColorProportionsPrompt = require( 'AREA_BUILDER/game/view/ColorProportionsPrompt' );
  var EraserButton = require( 'AREA_BUILDER/common/view/EraserButton' );
  var FaceWithPointsNode = require( 'SCENERY_PHET/FaceWithPointsNode' );
  var GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  var HCarousel = require( 'AREA_BUILDER/game/view/HCarousel' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberEntryControl = require( 'AREA_BUILDER/game/view/NumberEntryControl' );
  var LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
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
  var YouBuiltWindow = require( 'AREA_BUILDER/game/view/YouBuiltWindow' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var areaEqualsString = require( 'string!AREA_BUILDER/areaEquals' );
  var areaQuestionString = require( 'string!AREA_BUILDER/areaQuestion' );
  var buildItString = require( 'string!AREA_BUILDER/buildIt' );
  var checkString = require( 'string!VEGAS/check' );
  var nextString = require( 'string!VEGAS/next' );
  var perimeterEqualsString = require( 'string!AREA_BUILDER/perimeterEquals' );
  var ASolutionString = require( 'string!AREA_BUILDER/aSolution' );
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
  var GOAL_PROMPT_FONT = new PhetFont( { size: 20, weight: 'bold' } );
  var SPACE_AROUND_SHAPE_PLACEMENT_BOARD = 18;

  /**
   * @param {AreaBuilderGameModel} gameModel
   * @constructor
   */
  function AreaBuilderGameView( gameModel ) {
    ScreenView.call( this, { renderer: 'svg' } );
    var self = this;
    self.model = gameModel;

    // Hook up the audio player to the sound settings.
    this.gameAudioPlayer = new GameAudioPlayer( gameModel.soundEnabledProperty );

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

    // Set up the constant portions of the challenge view
    this.shapeBoard = new ShapePlacementBoardNode( gameModel.simSpecificModel.shapePlacementBoard );
    this.challengeLayer.addChild( this.shapeBoard );
    this.eraserButton = new EraserButton( {
      right: this.shapeBoard.right,
      top: this.shapeBoard.bottom + SPACE_AROUND_SHAPE_PLACEMENT_BOARD,
      listener: function() {
        gameModel.simSpecificModel.shapePlacementBoard.releaseAllShapes( true );
      }
    } );
    this.challengeLayer.addChild( this.eraserButton );
    // TODO: Do I need a separate challengeView?  Or just do it all on challengeLayer?
    this.challengeView = new Node();
    this.challengeLayer.addChild( this.challengeView );
    this.youBuiltWindow = new YouBuiltWindow( this.layoutBounds.width - this.shapeBoard.right - 20 );
    this.challengeLayer.addChild( this.youBuiltWindow );
    this.answerFeedback = new Node();
    this.challengeLayer.addChild( this.answerFeedback );
    this.challengePromptBanner = new ChallengePromptBanner( this.shapeBoard.width, INFO_BANNER_HEIGHT, {
      left: this.shapeBoard.left,
      bottom: this.shapeBoard.top - SPACE_AROUND_SHAPE_PLACEMENT_BOARD
    } );
    this.challengeLayer.addChild( this.challengePromptBanner );
    this.solutionBanner = new SolutionBanner( this.shapeBoard.width, INFO_BANNER_HEIGHT, {
      left: this.shapeBoard.left,
      bottom: this.shapeBoard.top - SPACE_AROUND_SHAPE_PLACEMENT_BOARD
    } );
    this.challengeLayer.addChild( this.solutionBanner );

    // Add the scoreboard.
    this.scoreboard = new AreaBuilderScoreboard(
      gameModel.levelProperty,
      gameModel.challengeIndexProperty,
      gameModel.challengesPerProblemSet,
      gameModel.scoreProperty,
      gameModel.elapsedTimeProperty,
      gameModel.simSpecificModel.showGridProperty,
      gameModel.simSpecificModel.showDimensionsProperty,
      { top: this.shapeBoard.top, right: this.shapeBoard.left - SPACE_AROUND_SHAPE_PLACEMENT_BOARD }
    );
    this.controlLayer.addChild( this.scoreboard );

    // Control visibility of elapsed time indicator in the scoreboard.
    this.model.timerEnabledProperty.link( function( timerEnabled ) {
      self.scoreboard.visibilityControls.timeVisible = timerEnabled;
    } );

    // Add the button for returning to the level selection screen.
    this.controlLayer.addChild( new RectangularPushButton( {
      content: new Text( 'Start Over', { font: BUTTON_FONT } ),
      listener: function() { gameModel.setChoosingLevelState(); },
      baseColor: BUTTON_FILL,
      left: this.scoreboard.left,
      top: this.solutionBanner.top
    } ) );

    // Add the 'Build Prompt' node that is shown temporarily over the board to instruct the user about what to build.
    this.goalText = new Text( '', { font: GOAL_PROMPT_FONT } );
    this.buildPromptVBox = new VBox( {
      children: [
        new Text( yourGoalString, { font: GOAL_PROMPT_FONT } ),
        this.goalText
      ],
      spacing: 20
    } );
    this.buildPromptPanel = new Panel( this.buildPromptVBox, {
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

    this.showTheSolutionButton = new TextPushButton( showSolutionString, _.extend( {
      listener: function() { gameModel.displayCorrectAnswer(); }
    }, buttonOptions ) );
    this.gameControlButtons.push( this.showTheSolutionButton );

    this.showASolutionButton = new TextPushButton( ASolutionString, _.extend( {
      listener: function() { gameModel.displayCorrectAnswer(); }
    }, buttonOptions ) );
    this.gameControlButtons.push( this.showASolutionButton );

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
      self.challengePromptBanner.properties.showPrompts = true;
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

          // Show the appropriate nodes for this state.  The button for showing the correct answer varies a bit based
          // on the type of challenge.
          var buttonsToShow = [
            this.scoreboard,
            this.challengeView,
            this.challengePromptBanner
          ];

          if ( challenge.buildSpec ) {
            buttonsToShow.push( this.showASolutionButton );
          }
          else {
            buttonsToShow.push( this.showTheSolutionButton );
          }

          this.show( buttonsToShow );

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

          // Update the answer feedback
          this.answerFeedback.removeAllChildren();
          if ( challenge.buildSpec.area && !challenge.buildSpec.perimeter && !challenge.buildSpec.proportions ) {
            this.youBuiltWindow.setAreaOnly( this.areaOfUserCreatedShape );
          }
          else if ( challenge.buildSpec.area && !challenge.buildSpec.perimeter && !challenge.buildSpec.proportions ) {
            this.youBuiltWindow.setAreaAndPerimeter( this.areaOfUserCreatedShape, this.perimeterOfUserCreatedShape );
          }
          else if ( challenge.buildSpec.area && !challenge.buildSpec.perimeter && challenge.buildSpec.proportions ) {
            this.youBuiltWindow.setAreaAndProportions( this.areaOfUserCreatedShape,
              challenge.buildSpec.proportions.color1, challenge.buildSpec.proportions.color2, {
                numerator: challenge.buildSpec.proportions.color1ProportionNumerator,
                denominator: challenge.buildSpec.proportions.color1ProportionDenominator
              }
            );
          }
          else if ( challenge.buildSpec.area && challenge.buildSpec.perimeter && challenge.buildSpec.proportions ) {
            this.youBuiltWindow.setAreaPerimeterAndProportions( this.areaOfUserCreatedShape,
              this.perimeterOfUserCreatedShape, challenge.buildSpec.proportions.color1,
              challenge.buildSpec.proportions.color2, {
                numerator: challenge.buildSpec.proportions.color1ProportionNumerator,
                denominator: challenge.buildSpec.proportions.color1ProportionDenominator
              }
            );
          }
          this.youBuiltWindow.centerY = this.shapeBoard.centerY;
          this.youBuiltWindow.centerX = ( this.layoutBounds.maxX + this.shapeBoard.bounds.maxX ) / 2;
          this.youBuiltWindow.visible = true;

          // Update the solution banner.
          this.solutionBanner.reset();
          if ( challenge.buildSpec ) {
            // TODO: This is stupid (because of the way it evolved).  The solution banner should just be generated here instead of all these steps to update it.
            this.solutionBanner.properties.mode = 'buildIt';
            this.solutionBanner.properties.targetArea = challenge.buildSpec.area;
            this.solutionBanner.properties.targetPerimeter = challenge.buildSpec.perimeter || null;
            this.solutionBanner.properties.targetProportions = challenge.buildSpec.proportions || null;
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
          this.challengePromptBanner.properties.showPrompts = false;

          if ( challenge.buildSpec.proportions ) {
            // The the target proportions prompt.
            this.challengePromptBanner.properties.targetProportions = challenge.buildSpec.proportions;
          }
        }
        this.challengeView.removeAllChildren();
        if ( challenge.buildSpec ) {
          // Set up the prompt the will be shown over the shape placement board.
          var promptText = StringUtils.format( areaEqualsString, challenge.buildSpec.area );
          if ( challenge.buildSpec.perimeter ) {
            promptText += '   ' + StringUtils.format( perimeterEqualsString, challenge.buildSpec.perimeter );
          }
          this.goalText.text = promptText;
          while ( this.buildPromptVBox.getChildrenCount() > 2 ) {
            this.buildPromptVBox.removeChildAt( 2 );
          }
          if ( challenge.buildSpec.proportions ) {
            var spec = challenge.buildSpec.proportions;
            this.buildPromptVBox.addChild( new ColorProportionsPrompt( spec.color1, spec.color2,
              spec.color1ProportionNumerator, spec.color1ProportionDenominator, { font: GOAL_PROMPT_FONT } ) );
          }
          this.buildPromptVBox.addChild( new Text( buildItString, GOAL_PROMPT_FONT ) );

          // Center the panel over the shape board.
          this.buildPromptPanel.centerX = this.shapeBoard.centerX;
          this.buildPromptPanel.centerY = this.shapeBoard.centerY;
          this.buildPromptPanel.visible = true;
          this.buildPromptPanel.opacity = 1; // Necessary because the board is set to fade out elsewhere.
        }
        else {
          this.buildPromptPanel.visible = false;
        }

        // Set the state of the control panel/scoreboard.
        this.scoreboard.dimensionsIcon.setStyle( challenge.backgroundShape ? 'background' : 'composite' );
        this.scoreboard.visibilityControls.gridControlVisible = challenge.toolSpec.gridControl;
        this.scoreboard.visibilityControls.dimensionsControlVisible = challenge.toolSpec.dimensionsControl;

        // Create the carousel if present
        if ( challenge.userShapes !== null ) {
          var creatorNodes = [];
          challenge.userShapes.forEach( function( userShapeSpec ) {
            creatorNodes.push( new ShapeCreatorNode( userShapeSpec.shape, userShapeSpec.color, self.model.simSpecificModel, {
              gridSpacing: AreaBuilderGameModel.UNIT_SQUARE_LENGTH
            } ) );
          } );
          if ( creatorNodes.length > 4 ) {
            // Add a scrolling carousel.
            this.shapeCarousel = new HCarousel( creatorNodes, {
              centerX: this.shapeBoard.centerX,
              top: this.shapeBoard.bottom + SPACE_AROUND_SHAPE_PLACEMENT_BOARD,
              fill: AreaBuilderSharedConstants.CONTROL_PANEL_BACKGROUND_COLOR
            } );
          }
          else {
            // Add a non-scrolling panel
            var creatorNodeHBox = new HBox( { children: creatorNodes, spacing: 20 } );
            this.shapeCarousel = new Panel( creatorNodeHBox, {
              centerX: this.shapeBoard.centerX,
              top: this.shapeBoard.bottom + SPACE_AROUND_SHAPE_PLACEMENT_BOARD,
              xMargin: 50,
              yMargin: 15,
              fill: AreaBuilderSharedConstants.CONTROL_PANEL_BACKGROUND_COLOR
            } );
          }
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
        this.youBuiltWindow
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
