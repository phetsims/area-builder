// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main view for the area builder game.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderGameModel = require( 'AREA_BUILDER/game/model/AreaBuilderGameModel' );
  var AreaBuilderControlPanel = require( 'AREA_BUILDER/common/view/AreaBuilderControlPanel' );
  var AreaBuilderScoreboard = require( 'AREA_BUILDER/game/view/AreaBuilderScoreboard' );
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var BuildSpec = require( 'AREA_BUILDER/game/model/BuildSpec' );
  var ColorProportionsPrompt = require( 'AREA_BUILDER/game/view/ColorProportionsPrompt' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var FaceWithPointsNode = require( 'SCENERY_PHET/FaceWithPointsNode' );
  var GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  var GameIconFactory = require( 'AREA_BUILDER/game/view/GameIconFactory' );
  var GameInfoBanner = require( 'AREA_BUILDER/game/view/GameInfoBanner' );
  var GameState = require( 'AREA_BUILDER/game/model/GameState' );
  var HCarousel = require( 'AREA_BUILDER/game/view/HCarousel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberEntryControl = require( 'AREA_BUILDER/game/view/NumberEntryControl' );
  var LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ShapeCreatorNode = require( 'AREA_BUILDER/common/view/ShapeCreatorNode' );
  var ShapePlacementBoardNode = require( 'AREA_BUILDER/common/view/ShapePlacementBoardNode' );
  var ShapeNode = require( 'AREA_BUILDER/common/view/ShapeNode' );
  var StartGameLevelNode = require( 'AREA_BUILDER/game/view/StartGameLevelNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var YouBuiltWindow = require( 'AREA_BUILDER/game/view/YouBuiltWindow' );
  var YouEnteredWindow = require( 'AREA_BUILDER/game/view/YouEnteredWindow' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var areaEqualsString = require( 'string!AREA_BUILDER/areaEquals' );
  var areaQuestionString = require( 'string!AREA_BUILDER/areaQuestion' );
  var aSolutionColonString = require( 'string!AREA_BUILDER/aSolutionColon' );
  var aSolutionString = require( 'string!AREA_BUILDER/aSolution' );
  var buildItString = require( 'string!AREA_BUILDER/buildIt' );
  var checkString = require( 'string!VEGAS/check' );
  var findTheAreaString = require( 'string!AREA_BUILDER/findTheArea' );
  var nextString = require( 'string!VEGAS/next' );
  var perimeterEqualsString = require( 'string!AREA_BUILDER/perimeterEquals' );
  var solutionColonString = require( 'string!AREA_BUILDER/solutionColon' );
  var solutionString = require( 'string!AREA_BUILDER/solution' );
  var startOverString = require( 'string!AREA_BUILDER/startOver' );
  var tryAgainString = require( 'string!VEGAS/tryAgain' );
  var yourGoalString = require( 'string!AREA_BUILDER/yourGoal' );

  // constants
  var BUTTON_FONT = new PhetFont( 18 );
  var BUTTON_FILL = '#F2E916';
  var INFO_BANNER_HEIGHT = 60; // Height of the prompt and solution banners, empirically determined.
  var GOAL_PROMPT_FONT = new PhetFont( { size: 20, weight: 'bold' } );
  var SPACE_AROUND_SHAPE_PLACEMENT_BOARD = 15;
  var YOUR_GOAL_TITLE = new Text( yourGoalString, { font: new PhetFont( { size: 24, weight: 'bold' } ) } );

  /**
   * @param {AreaBuilderGameModel} gameModel
   * @constructor
   */
  function AreaBuilderGameView( gameModel ) {
    ScreenView.call( this, { renderer: 'svg', layoutBounds: AreaBuilderSharedConstants.LAYOUT_BOUNDS } );
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
        GameIconFactory.createIcon( 1 ),
        GameIconFactory.createIcon( 2 ),
        GameIconFactory.createIcon( 3 ),
        GameIconFactory.createIcon( 4 ),
        GameIconFactory.createIcon( 5 ),
        GameIconFactory.createIcon( 6 )
      ],
      gameModel.bestScores,
      {
        numStarsOnButtons: gameModel.challengesPerSet,
        perfectScore: gameModel.maxPossibleScore,
        numLevels: gameModel.numberOfLevels,
        numButtonRows: 2,
        controlsInset: 20
      }
    );
    this.rootNode.addChild( this.startGameLevelNode );

    // Set up the constant portions of the challenge view
    this.shapeBoard = new ShapePlacementBoardNode( gameModel.simSpecificModel.shapePlacementBoard );
    this.shapeBoardOriginalBounds = this.shapeBoard.bounds.copy(); // Necessary because the shape board's bounds can vary when shapes are placed.
    this.challengeLayer.addChild( this.shapeBoard );
    this.eraserButton = new EraserButton( {
      right: this.shapeBoard.left,
      top: this.shapeBoard.bottom + SPACE_AROUND_SHAPE_PLACEMENT_BOARD,
      listener: function() {
        var challenge = gameModel.currentChallenge;
        var shapeReleaseMode = 'fade';
        if ( challenge.checkSpec === 'areaEntered' && challenge.userShapes && challenge.userShapes[ 0 ].creationLimit ) {
          // In the case where there is a limited number of shapes, have them animate back to the carousel instead of
          // fading away so that the user understands that the stash is being replenished.
          shapeReleaseMode = 'animateHome';
        }
        gameModel.simSpecificModel.shapePlacementBoard.releaseAllShapes( shapeReleaseMode );
      }
    } );
    this.challengeLayer.addChild( this.eraserButton );
    this.youBuiltWindow = new YouBuiltWindow( this.layoutBounds.width - this.shapeBoard.right - 14 );
    this.challengeLayer.addChild( this.youBuiltWindow );
    this.youEnteredWindow = new YouEnteredWindow( this.layoutBounds.width - this.shapeBoard.right - 14 );
    this.challengeLayer.addChild( this.youEnteredWindow );
    this.challengePromptBanner = new GameInfoBanner( this.shapeBoard.width, INFO_BANNER_HEIGHT, '#1b1464', {
      left: this.shapeBoard.left,
      bottom: this.shapeBoard.top - SPACE_AROUND_SHAPE_PLACEMENT_BOARD
    } );
    this.challengeLayer.addChild( this.challengePromptBanner );
    this.solutionBanner = new GameInfoBanner( this.shapeBoard.width, INFO_BANNER_HEIGHT, '#fbb03b', {
      left: this.shapeBoard.left,
      bottom: this.shapeBoard.top - SPACE_AROUND_SHAPE_PLACEMENT_BOARD
    } );
    this.challengeLayer.addChild( this.solutionBanner );

    // Add the scoreboard.
    this.scoreboard = new AreaBuilderScoreboard(
      gameModel.levelProperty,
      gameModel.challengeIndexProperty,
      gameModel.challengesPerSet,
      gameModel.scoreProperty,
      gameModel.elapsedTimeProperty,
      { centerX: ( this.layoutBounds.x + this.shapeBoard.left ) / 2, top: this.shapeBoard.top }
    );
    this.controlLayer.addChild( this.scoreboard );

    // Add the control panel
    this.controlPanel = new AreaBuilderControlPanel(
      gameModel.simSpecificModel.showGridOnBoardProperty,
      gameModel.simSpecificModel.showDimensionsProperty,
      { centerX: ( this.layoutBounds.x + this.shapeBoard.left ) / 2, bottom: this.shapeBoard.bottom }
    );
    this.controlLayer.addChild( this.controlPanel );

    // Control visibility of elapsed time indicator in the scoreboard.
    this.model.timerEnabledProperty.link( function( timerEnabled ) {
      self.scoreboard.visibilityControls.timeVisible = timerEnabled;
    } );

    // Add the button for returning to the level selection screen.
    this.controlLayer.addChild( new RectangularPushButton( {
      content: new Text( startOverString, { font: BUTTON_FONT } ),
      listener: function() { gameModel.setChoosingLevelState(); },
      baseColor: BUTTON_FILL,
      centerX: this.scoreboard.centerX,
      centerY: this.solutionBanner.centerY
    } ) );

    // Add the 'Build Prompt' node that is shown temporarily over the board to instruct the user about what to build.
    this.buildPromptVBox = new VBox( {
      children: [
        YOUR_GOAL_TITLE
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
    this.color1Proportion = null;

    // Add and lay out the game control buttons.
    this.gameControlButtons = [];
    var buttonOptions = {
      font: BUTTON_FONT,
      baseColor: BUTTON_FILL,
      cornerRadius: 4
    };
    this.checkAnswerButton = new TextPushButton( checkString, _.extend( {
      listener: function() {
        self.updateUserAnswer();
        gameModel.checkAnswer();
      }
    }, buttonOptions ) );
    this.gameControlButtons.push( this.checkAnswerButton );

    this.nextButton = new TextPushButton( nextString, _.extend( {
      listener: function() { gameModel.nextChallenge(); }
    }, buttonOptions ) );
    this.gameControlButtons.push( this.nextButton );

    this.tryAgainButton = new TextPushButton( tryAgainString, _.extend( {
      listener: function() { gameModel.tryAgain(); }
    }, buttonOptions ) );
    this.gameControlButtons.push( this.tryAgainButton );

    // Solution button for 'find the area' style of challenge, which has one specific answer.
    this.solutionButton = new TextPushButton( solutionString, _.extend( {
      listener: function() {
        gameModel.displayCorrectAnswer();
      }
    }, buttonOptions ) );
    this.gameControlButtons.push( this.solutionButton );

    // Solution button for 'built it' style of challenge, which has many potential answers.
    this.showASolutionButton = new TextPushButton( aSolutionString, _.extend( {
      listener: function() {
        self.okayToUpdateYouBuiltWindow = false;
        gameModel.displayCorrectAnswer();
      }
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

    this.numberEntryControl.keypad.digitString.link( function( digitString ) {

      // Handle the case where the user just starts entering digits instead of pressing the "Try Again" button.  In
      // this case, we go ahead and make the state transition to the next state.
      if ( gameModel.gameStateProperty.value === GameState.SHOWING_INCORRECT_ANSWER_FEEDBACK_TRY_AGAIN ) {
        assert && assert( digitString.length <= 1, 'Shouldn\'t reach this code with digit strings longer than 1' );
        gameModel.tryAgain();
      }

      // Update the state of the 'Check' button when the user enters new digits.
      self.updatedCheckButtonEnabledState();
    } );

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
      var shapeNode = new ShapeNode( addedShape );
      self.challengeLayer.addChild( shapeNode );

      // Add a listener that handles changes to the userControlled state.
      var userControlledListener = function( userControlled ) {
        if ( userControlled ) {
          shapeNode.moveToFront();

          // If the game was in the state where it was prompting the user to try again, and the user started
          // interacting with shapes without pressing the 'Try Again' button, go ahead and make the state change
          // automatically.
          if ( gameModel.gameStateProperty.value === GameState.SHOWING_INCORRECT_ANSWER_FEEDBACK_TRY_AGAIN ) {
            gameModel.tryAgain();
          }
        }
      };
      addedShape.userControlledProperty.link( userControlledListener );

      // Add the removal listener for if and when this shape is removed from the model.
      gameModel.simSpecificModel.movableShapes.addItemRemovedListener( function removalListener( removedShape ) {
        if ( removedShape === addedShape ) {
          self.challengeLayer.removeChild( shapeNode );
          addedShape.userControlledProperty.unlink( userControlledListener );
          gameModel.simSpecificModel.movableShapes.removeItemRemovedListener( removalListener );
        }
      } );

      // If the initial build prompt is visible, hide it.
      if ( self.buildPromptPanel.opacity === 1 ) {
        // using a function instead, see Seasons sim, PanelNode.js for an example.
        new TWEEN.Tween( { opacity: self.buildPromptPanel.opacity } )
          .to( { opacity: 0 }, 500 )
          .easing( TWEEN.Easing.Cubic.InOut )
          .onUpdate( function() { self.buildPromptPanel.opacity = this.opacity; } )
          .start();
      }

      // If this is a 'built it' style challenge, and this is the first element being added to the board, add the
      // build spec to the banner so that the user can reference it as they add more shapes to the board.
      if ( gameModel.currentChallenge.buildSpec && self.challengePromptBanner.buildSpecProperty.value === null ) {
        self.challengePromptBanner.buildSpecProperty.value = gameModel.currentChallenge.buildSpec;
      }
    } );

    gameModel.simSpecificModel.movableShapes.addItemRemovedListener( function() {
      // If the challenge is a 'build it' style challenge, and the game is in the state where the user is being given
      // the opportunity to view a solution, and the user just removed a piece, check if they now have the correct
      // answer.
      if ( gameModel.gameStateProperty.value === GameState.SHOWING_INCORRECT_ANSWER_FEEDBACK_MOVE_ON && !self.isAnyShapeMoving() ) {
        self.model.checkAnswer();
      }
    } );

    gameModel.simSpecificModel.shapePlacementBoard.areaAndPerimeterProperty.link( function( areaAndPerimeter ) {

      self.updatedCheckButtonEnabledState();

      // If the challenge is a 'build it' style challenge, and the game is in the state where the user is being
      // given the opportunity to view a solution, and they just changed what they had built, update the 'you built'
      // window.
      if ( gameModel.gameStateProperty.value === GameState.SHOWING_INCORRECT_ANSWER_FEEDBACK_MOVE_ON && self.okayToUpdateYouBuiltWindow ) {
        self.updateUserAnswer();
        self.updateYouBuiltWindow( self.model.currentChallenge );

        // If the user has put all shapes away, check to see if they now have the correct answer.
        if ( !self.isAnyShapeMoving() ) {
          self.model.checkAnswer();
        }
      }
    } );

    // Various other initialization
    this.levelCompletedNode = null; // @private
    this.shapeCarouselRoot = new Node(); // @private
    this.challengeLayer.addChild( this.shapeCarouselRoot );
    this.clearDimensionsControlOnNextChallenge = false; // @private

    // Hook up the update function for handling changes to game state.
    gameModel.gameStateProperty.link( self.handleGameStateChange.bind( self ) );

    // Set up a flag to block updates of the 'You Built' window when showing the solution.  This is necessary because
    // adding the shapes to the board in order to show the solution triggers updates of this window.
    this.okayToUpdateYouBuiltWindow = true; // @private?
  }

  return inherit( ScreenView, AreaBuilderGameView, {

    // @private, When the game state changes, update the view with the appropriate buttons and readouts.
    handleGameStateChange: function( gameState ) {

      // Hide all nodes - the appropriate ones will be shown later based on the current state.
      this.hideAllGameNodes();

      var challenge = this.model.currentChallenge; // convenience var

      // Show the nodes appropriate to the state
      switch( gameState ) {

        case GameState.CHOOSING_LEVEL:
          this.handleChoosingLevelState();
          break;

        case GameState.PRESENTING_INTERACTIVE_CHALLENGE:
          this.handlePresentingInteractiveChallengeState( challenge );
          break;

        case GameState.SHOWING_CORRECT_ANSWER_FEEDBACK:
          this.handleShowingCorrectAnswerFeedbackState( challenge );
          break;

        case GameState.SHOWING_INCORRECT_ANSWER_FEEDBACK_TRY_AGAIN:
          this.handleShowingIncorrectAnswerFeedbackTryAgainState( challenge );
          break;

        case GameState.SHOWING_INCORRECT_ANSWER_FEEDBACK_MOVE_ON:
          this.handleShowingIncorrectAnswerFeedbackMoveOnState( challenge );
          break;

        case GameState.DISPLAYING_CORRECT_ANSWER:
          this.handleDisplayingCorrectAnswerState( challenge );
          break;

        case GameState.SHOWING_LEVEL_RESULTS:
          this.handleShowingLevelResultsState();
          break;

        default:
          throw new Error( 'Unhandled game state: ' + gameState );
      }
    },

    // @private
    handleChoosingLevelState: function() {
      this.show( [ this.startGameLevelNode ] );
      this.hideChallenge();
    },

    // @private
    handlePresentingInteractiveChallengeState: function( challenge ) {
      this.challengeLayer.pickable = null; // Pass through, prunes subtree, see Scenery documentation for details.
      this.presentChallenge();

      // Make a list of the nodes to be shown in this state.
      var nodesToShow = [
        this.scoreboard,
        this.controlPanel,
        this.checkAnswerButton,
        this.challengePromptBanner
      ];

      // Add the nodes that are only shown for certain challenge types or under certain conditions.
      if ( challenge.checkSpec === 'areaEntered' ) {
        nodesToShow.push( this.numberEntryControl );
        nodesToShow.push( this.areaQuestionPrompt );
      }
      if ( challenge.userShapes ) {
        nodesToShow.push( this.shapeCarouselRoot );
        nodesToShow.push( this.eraserButton );
      }

      this.show( nodesToShow );
      this.showChallengeGraphics();
      this.updatedCheckButtonEnabledState();
      this.okayToUpdateYouBuiltWindow = true;

      if ( this.clearDimensionsControlOnNextChallenge ) {
        this.model.simSpecificModel.showDimensions = false;
        this.clearDimensionsControlOnNextChallenge = false;
      }
    },

    // @private
    handleShowingCorrectAnswerFeedbackState: function( challenge ) {

      // Make a list of the nodes to be shown in this state.
      var nodesToShow = [
        this.scoreboard,
        this.controlPanel,
        this.nextButton,
        this.challengePromptBanner,
        this.faceWithPointsNode
      ];

      // Update and show the nodes that vary based on the challenge configurations.
      if ( challenge.buildSpec ) {
        this.updateYouBuiltWindow( challenge );
        nodesToShow.push( this.youBuiltWindow );
      }
      else {
        this.updateYouEnteredWindow( challenge );
        nodesToShow.push( this.youEnteredWindow );
      }

      // Give the user the appropriate audio and visual feedback
      this.gameAudioPlayer.correctAnswer();
      this.faceWithPointsNode.smile();
      this.faceWithPointsNode.setPoints( this.model.getChallengeCurrentPointValue() );

      // Disable interaction with the challenge elements.
      this.challengeLayer.pickable = false;

      // Make the nodes visible
      this.show( nodesToShow );
    },

    // @private
    handleShowingIncorrectAnswerFeedbackTryAgainState: function( challenge ) {

      // Make a list of the nodes to be shown in this state.
      var nodesToShow = [
        this.scoreboard,
        this.controlPanel,
        this.tryAgainButton,
        this.challengePromptBanner,
        this.faceWithPointsNode
      ];

      // Add the nodes whose visibility varies based on the challenge configuration.
      if ( challenge.checkSpec === 'areaEntered' ) {
        nodesToShow.push( this.numberEntryControl );
        nodesToShow.push( this.areaQuestionPrompt );
      }
      if ( challenge.userShapes ) {
        nodesToShow.push( this.shapeCarouselRoot );
        nodesToShow.push( this.eraserButton );
      }

      // Give the user the appropriate feedback.
      this.gameAudioPlayer.wrongAnswer();
      this.faceWithPointsNode.grimace();
      this.faceWithPointsNode.setPoints( this.model.score );

      if ( challenge.checkSpec === 'areaEntered' ) {
        // Set the keypad to allow the user to start entering a new value.
        this.numberEntryControl.armForNewEntry();
      }

      // Show the nodes
      this.show( nodesToShow );
    },

    // @private
    handleShowingIncorrectAnswerFeedbackMoveOnState: function( challenge ) {

      // Make a list of the nodes to be shown in this state.
      var nodesToShow = [
        this.scoreboard,
        this.controlPanel,
        this.challengePromptBanner,
        this.faceWithPointsNode
      ];

      // Add the nodes whose visibility varies based on the challenge configuration.
      if ( challenge.buildSpec ) {
        nodesToShow.push( this.showASolutionButton );
        this.updateYouBuiltWindow( challenge );
        nodesToShow.push( this.youBuiltWindow );
        if ( challenge.userShapes ) {
          nodesToShow.push( this.shapeCarouselRoot );
          nodesToShow.push( this.eraserButton );
        }
      }
      else {
        nodesToShow.push( this.solutionButton );
        this.updateYouEnteredWindow( challenge );
        nodesToShow.push( this.youEnteredWindow );
      }

      this.show( nodesToShow );

      // Give the user the appropriate feedback
      this.gameAudioPlayer.wrongAnswer();
      this.faceWithPointsNode.grimace();
      this.faceWithPointsNode.setPoints( this.model.score );

      // For 'built it' style challenges, the user can still interact while in this state in case they want to try
      // to get it right.  In 'find the area' challenges, further interaction is disallowed.
      if ( challenge.checkSpec === 'areaEntered' ) {
        this.challengeLayer.pickable = false;
      }

      // Show the nodes.
      this.show( nodesToShow );
    },

    // @private
    handleDisplayingCorrectAnswerState: function( challenge ) {
      // Make a list of the nodes to be shown in this state.
      var nodesToShow = [
        this.scoreboard,
        this.controlPanel,
        this.nextButton,
        this.solutionBanner
      ];

      // Keep the appropriate feedback window visible.
      if ( challenge.buildSpec ) {
        nodesToShow.push( this.youBuiltWindow );
      }
      else {
        nodesToShow.push( this.youEnteredWindow );
      }

      // Update the solution banner.
      this.solutionBanner.reset();
      if ( challenge.buildSpec ) {
        this.solutionBanner.titleTextProperty.value = aSolutionColonString;
        this.solutionBanner.buildSpecProperty.value = challenge.buildSpec;
      }
      else {
        this.solutionBanner.titleTextProperty.value = solutionColonString;
        this.solutionBanner.areaToFindProperty.value = challenge.backgroundShape.unitArea;
      }
      this.showChallengeGraphics();

      // Disable interaction with the challenge elements.
      this.challengeLayer.pickable = false;

      // Turn on the dimensions indicator, since it may make the answer more clear for the user.
      this.clearDimensionsControlOnNextChallenge = !this.model.simSpecificModel.showDimensions;
      this.model.simSpecificModel.showDimensions = true;

      // Show the nodes.
      this.show( nodesToShow );
    },

    // @private
    handleShowingLevelResultsState: function() {
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
    },

    // @private Update the window that depicts what the user has built.
    updateYouBuiltWindow: function( challenge ) {
      assert && assert( challenge.buildSpec, 'This method should only be called for challenges that include a build spec.' );
      var userBuiltSpec = new BuildSpec(
        this.areaOfUserCreatedShape,
        challenge.buildSpec.perimeter ? this.perimeterOfUserCreatedShape : null,
        challenge.buildSpec.proportions ? {
          color1: challenge.buildSpec.proportions.color1,
          color2: challenge.buildSpec.proportions.color2,
          color1Proportion: this.color1Proportion
        } : null
      );
      this.youBuiltWindow.setBuildSpec( userBuiltSpec );
      this.youBuiltWindow.setColorBasedOnAnswerCorrectness( userBuiltSpec.equals( challenge.buildSpec ) );
      this.youBuiltWindow.centerY = this.shapeBoardOriginalBounds.centerY;
      this.youBuiltWindow.centerX = ( this.layoutBounds.maxX + this.shapeBoardOriginalBounds.maxX ) / 2;
    },

    // @private Update the window that depicts what the user has entered using the keypad.
    updateYouEnteredWindow: function( challenge ) {
      assert && assert( challenge.checkSpec === 'areaEntered', 'This method should only be called for find-the-area style challenges.' );
      this.youEnteredWindow.setValueEntered( this.model.simSpecificModel.areaGuess );
      this.youEnteredWindow.setColorBasedOnAnswerCorrectness( challenge.backgroundShape.unitArea === this.model.simSpecificModel.areaGuess );
      this.youEnteredWindow.centerY = this.shapeBoardOriginalBounds.centerY;
      this.youEnteredWindow.centerX = ( this.layoutBounds.maxX + this.shapeBoardOriginalBounds.maxX ) / 2;
    },

    // @private Grab a snapshot of whatever the user has built or entered
    updateUserAnswer: function() {
      // Save the parameters of what the user has built, if they've built anything.
      this.areaOfUserCreatedShape = this.model.simSpecificModel.shapePlacementBoard.areaAndPerimeter.area;
      this.perimeterOfUserCreatedShape = this.model.simSpecificModel.shapePlacementBoard.areaAndPerimeter.perimeter;
      var challenge = this.model.currentChallenge; // convenience var
      if ( challenge.buildSpec && challenge.buildSpec.proportions ) {
        this.color1Proportion = this.model.simSpecificModel.getProportionOfColor( challenge.buildSpec.proportions.color1 );
      }
      else {
        this.color1Proportion = null;
      }

      // Submit the user's area guess, if there is one.
      this.model.simSpecificModel.areaGuess = this.numberEntryControl.value;
    },

    // @private Returns true if any shape is animating or user controlled, false if not.
    isAnyShapeMoving: function() {
      for ( var i = 0; i < this.model.simSpecificModel.movableShapes.length; i++ ) {
        if ( this.model.simSpecificModel.movableShapes.get( i ).animating ||
             this.model.simSpecificModel.movableShapes.get( i ).userControlled ) {
          return true;
        }
      }
      return false;
    },

    // @private, Present the challenge to the user and set things up so that they can submit their answer.
    presentChallenge: function() {

      var self = this;
      this.numberEntryControl.clear();

      if ( this.model.incorrectGuessesOnCurrentChallenge === 0 ) {

        // Clean up previous challenge.
        this.model.simSpecificModel.clearShapePlacementBoard();
        this.challengePromptBanner.reset();
        this.shapeCarouselRoot.removeAllChildren();

        var challenge = this.model.currentChallenge; // Convenience var

        // Set up the challenge prompt banner, which appears above the shape placement board.
        this.challengePromptBanner.titleTextProperty.value = challenge.buildSpec ? buildItString : findTheAreaString;

        // If needed, set up the goal prompt that will initially appear over the shape placement board (in the z-order).
        if ( challenge.buildSpec ) {

          this.buildPromptVBox.removeAllChildren();
          this.buildPromptVBox.addChild( YOUR_GOAL_TITLE );
          var areaGoalNode = new Text( StringUtils.format( areaEqualsString, challenge.buildSpec.area ), {
            font: GOAL_PROMPT_FONT
          } );
          if ( challenge.buildSpec.proportions ) {
            var areaPrompt = new Node();
            areaPrompt.addChild( areaGoalNode );
            areaGoalNode.text += ',';
            var colorProportionsPrompt = new ColorProportionsPrompt( challenge.buildSpec.proportions.color1,
              challenge.buildSpec.proportions.color2, challenge.buildSpec.proportions.color1Proportion, {
                font: new PhetFont( { size: 16, weight: 'bold' } ),
                left: areaGoalNode.width + 10,
                centerY: areaGoalNode.centerY
              }
            );
            areaPrompt.addChild( colorProportionsPrompt );
            this.buildPromptVBox.addChild( areaPrompt );
          }
          else {
            this.buildPromptVBox.addChild( areaGoalNode );
          }

          if ( challenge.buildSpec.perimeter ) {
            this.buildPromptVBox.addChild( new Text( StringUtils.format( perimeterEqualsString, challenge.buildSpec.perimeter ), {
              font: GOAL_PROMPT_FONT
            } ) );
          }

          // Center the panel over the shape board and make it visible.
          this.buildPromptPanel.centerX = this.shapeBoardOriginalBounds.centerX;
          this.buildPromptPanel.centerY = this.shapeBoardOriginalBounds.centerY;
          this.buildPromptPanel.visible = true;
          this.buildPromptPanel.opacity = 1; // Necessary because the board is set to fade out elsewhere.
        }
        else {
          this.buildPromptPanel.visible = false;
        }

        // Set the state of the control panel.
        this.controlPanel.dimensionsIcon.setGridVisible( challenge.backgroundShape ? false : true );
        this.controlPanel.visibilityControls.gridControlVisible = challenge.toolSpec.gridControl;
        this.controlPanel.visibilityControls.dimensionsControlVisible = challenge.toolSpec.dimensionsControl;
        if ( challenge.backgroundShape ) {
          this.controlPanel.dimensionsIcon.setColor( challenge.backgroundShape.fillColor );
        }
        else if ( challenge.userShapes ) {
          this.controlPanel.dimensionsIcon.setColor( challenge.userShapes[ 0 ].color );
        }
        else {
          this.controlPanel.dimensionsIcon.setColor( AreaBuilderSharedConstants.GREENISH_COLOR );
        }

        // Create the carousel if present
        if ( challenge.userShapes !== null ) {
          var creatorNodes = [];
          challenge.userShapes.forEach( function( userShapeSpec ) {
            var creatorNodeOptions = { gridSpacing: AreaBuilderGameModel.UNIT_SQUARE_LENGTH };
            if ( userShapeSpec.creationLimit ) {
              creatorNodeOptions.creationLimit = userShapeSpec.creationLimit;
            }
            creatorNodes.push( new ShapeCreatorNode( userShapeSpec.shape, userShapeSpec.color,
              self.model.simSpecificModel.addUserCreatedMovableShape.bind( self.model.simSpecificModel ),
              creatorNodeOptions ) );
          } );
          if ( creatorNodes.length > 4 ) {
            // Add a scrolling carousel.
            this.shapeCarouselRoot.addChild( new HCarousel( creatorNodes, {
              centerX: this.shapeBoardOriginalBounds.centerX,
              top: this.shapeBoardOriginalBounds.bottom + SPACE_AROUND_SHAPE_PLACEMENT_BOARD,
              fill: AreaBuilderSharedConstants.CONTROL_PANEL_BACKGROUND_COLOR
            } ) );
          }
          else {
            // Add a non-scrolling panel
            var creatorNodeHBox = new HBox( { children: creatorNodes, spacing: 20 } );
            this.shapeCarouselRoot.addChild( new Panel( creatorNodeHBox, {
              centerX: this.shapeBoardOriginalBounds.centerX,
              top: this.shapeBoardOriginalBounds.bottom + SPACE_AROUND_SHAPE_PLACEMENT_BOARD,
              xMargin: 50,
              yMargin: 15,
              fill: AreaBuilderSharedConstants.CONTROL_PANEL_BACKGROUND_COLOR
            } ) );
          }
        }
      }
    },

    // @private, Utility method for hiding all of the game nodes whose visibility changes during the course of a challenge.
    hideAllGameNodes: function() {
      this.gameControlButtons.forEach( function( button ) { button.visible = false; } );
      this.setNodeVisibility( false, [
        this.startGameLevelNode,
        this.faceWithPointsNode,
        this.scoreboard,
        this.controlPanel,
        this.challengePromptBanner,
        this.solutionBanner,
        this.numberEntryControl,
        this.areaQuestionPrompt,
        this.youBuiltWindow,
        this.youEnteredWindow,
        this.shapeCarouselRoot,
        this.eraserButton
      ] );
    },

    // @private
    show: function( nodesToShow ) {
      nodesToShow.forEach( function( nodeToShow ) { nodeToShow.visible = true; } );
    },

    // @private
    setNodeVisibility: function( isVisible, nodes ) {
      nodes.forEach( function( node ) { node.visible = isVisible; } );
    },

    // @private
    hideChallenge: function() {
      this.challengeLayer.visible = false;
      this.controlLayer.visible = false;
    },

    // Show the graphic model elements for this challenge.
    showChallengeGraphics: function() {
      this.challengeLayer.visible = true;
      this.controlLayer.visible = true;
    },

    // @private
    updatedCheckButtonEnabledState: function() {
      if ( this.model.currentChallenge ) {
        if ( this.model.currentChallenge.checkSpec === 'areaEntered' ) {
          this.checkAnswerButton.enabled = this.numberEntryControl.keypad.digitString.value.length > 0;
        }
        else {
          this.checkAnswerButton.enabled = this.model.simSpecificModel.shapePlacementBoard.areaAndPerimeter.area > 0;
        }
      }
    },

    // @private
    showLevelResultsNode: function() {
      var thisScreen = this;

      // Set a new "level completed" node based on the results.
      var levelCompletedNode = new LevelCompletedNode(
        this.model.level,
        this.model.score,
        this.model.maxPossibleScore,
        this.model.challengesPerSet,
        this.model.timerEnabled,
        this.model.elapsedTime,
        this.model.bestTimes[ this.model.level ],
        thisScreen.model.newBestTime,
        function() {
          thisScreen.model.gameState = GameState.CHOOSING_LEVEL;
          thisScreen.rootNode.removeChild( levelCompletedNode );
          levelCompletedNode = null;
        },
        {
          center: thisScreen.layoutBounds.center
        }
      );

      // Add the node.
      this.rootNode.addChild( levelCompletedNode );
    }
  } );
} );
