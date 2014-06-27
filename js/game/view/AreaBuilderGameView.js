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
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var CheckBox = require( 'SUN/CheckBox' );
  var FaceWithPointsNode = require( 'SCENERY_PHET/FaceWithPointsNode' );
  var GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KitSelectionNode = require( 'SCENERY_PHET/KitSelectionNode' );
  var LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ReturnToLevelSelectButton = require( 'SCENERY_PHET/ReturnToLevelSelectButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ShapePlacementBoardNode = require( 'AREA_BUILDER/common/view/ShapePlacementBoardNode' );
  var ShapeView = require( 'AREA_BUILDER/common/view/ShapeView' );
  var StartGameLevelNode = require( 'AREA_BUILDER/game/view/StartGameLevelNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var HBox = require( 'SCENERY/nodes/HBox' );

  // strings
  var areaEqualsString = require( 'string!AREA_BUILDER/areaEquals' );
  var buildItString = require( 'string!AREA_BUILDER/buildIt' );
  var checkString = require( 'string!VEGAS/check' );
  var nextString = require( 'string!VEGAS/next' );
  var perimeterEqualsString = require( 'string!AREA_BUILDER/perimeterEquals' );
  var showAnswerString = require( 'string!VEGAS/showAnswer' );
  var tryAgainString = require( 'string!VEGAS/tryAgain' );
  var yourGoalString = require( 'string!AREA_BUILDER/yourGoal' );

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
      gameModel.additionalModel.shapePlacementBoard.showGridProperty,
      new Property( false ), // TODO: wire up to the show dimensions property
      { top: 100, left: 20 }
    );
    this.controlLayer.addChild( this.scoreboard );

    // Add the button for returning to the level selection screen.
    this.controlLayer.addChild( new ReturnToLevelSelectButton( {
      listener: function() { gameModel.setChoosingLevelState(); },
      left: this.scoreboard.left,
      top: 20
    } ) );

    // Create the 'feedback node' that is used to visually indicate correct and incorrect answers.
    this.faceWithPointsNode = new FaceWithPointsNode(
      {
        faceOpacity: 0.6,
        faceDiameter: this.layoutBounds.width * 0.31,
        pointsFill: 'yellow',
        pointsStroke: 'black',
        pointsAlignment: 'rightCenter',
        centerX: this.layoutBounds.centerX,
        centerY: this.layoutBounds.centerY
      } );
    this.addChild( this.faceWithPointsNode );

    // Set up the constant portions of the challenge view
    this.shapeBoard = new ShapePlacementBoardNode( gameModel.additionalModel.shapePlacementBoard );
    this.challengeLayer.addChild( this.shapeBoard );
    // TODO: Do I need a separate challengeView?  Or just do it all on challengeLayer?
    this.challengeView = new Node();
    this.challengeLayer.addChild( this.challengeView );

    // Add the title.  It is blank to start with, and is updated later at the appropriate state change.
    this.challengeTitleNode = new Text( '',
      {
        font: new PhetFont( { size: 20, weight: 'bold' } ),
        left: this.shapeBoard.left,
        bottom: this.shapeBoard.top - 20
      } );
    this.challengeLayer.addChild( this.challengeTitleNode );

    // Add the 'Build Spec' text, which is shown on some challenges to instruct the user on what to build.
    this.buildSpecNode = new Text( '',
      {
        font: new PhetFont( { size: 20 } ),
        top: 10
      } );
    this.challengeLayer.addChild( this.buildSpecNode );

    // Add the 'Build Prompt' node that is shown temporarily over the board to instruct the user about what to build.
    this.buildPromptNode = new MultiLineText( '',
      {
        font: new PhetFont( { size: 20, weight: 'bold' } )
      } );
    this.challengeLayer.addChild( this.buildPromptNode );

    // Add and lay out the game control buttons.
    this.gameControlButtons = [];
    var buttonOptions = {
      font: BUTTON_FONT,
      baseColor: BUTTON_FILL,
      cornerRadius: 4
    };
    this.checkAnswerButton = new TextPushButton( checkString, _.extend( {
      listener: function() {
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

    this.displayCorrectAnswerButton = new TextPushButton( showAnswerString, _.extend( {
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

    // Handle comings and goings of model shapes.
    gameModel.additionalModel.movableShapes.addItemAddedListener( function( addedShape ) {

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
      gameModel.additionalModel.movableShapes.addItemRemovedListener( function removalListener( removedShape ) {
        if ( removedShape === addedShape ) {
          self.challengeLayer.removeChild( shapeView );
          gameModel.additionalModel.movableShapes.removeItemRemovedListener( removalListener );
        }
      } );
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
      if ( this.model.incorrectGuessesOnCurrentChallenge === 0 ) {

        // Clean up previous challenge.
        if ( this.shapeCarousel !== null ) {
          this.challengeLayer.removeChild( this.shapeCarousel );
        }

        // Set up the titles and prompts
        var challenge = this.model.currentChallenge; // Convenience var
        this.challengeTitleNode.text = challenge.challengeTitle;
        this.challengeView.removeAllChildren();
        if ( challenge.buildSpec ) {
          var promptText = StringUtils.format( areaEqualsString, challenge.buildSpec.area );
          if ( challenge.buildSpec.perimeter ) {
            promptText += '   ' + StringUtils.format( perimeterEqualsString, challenge.buildSpec.perimeter );
          }
          this.buildSpecNode.text = promptText;
          this.buildSpecNode.centerX = this.shapeBoard.centerX;
          this.buildPromptNode.text = yourGoalString + '\n\n' + promptText + '\n\n' + buildItString;
          this.buildPromptNode.centerX = this.shapeBoard.centerX;
          this.buildPromptNode.top = this.shapeBoard.top + 40;
        }
        else {
          this.buildSpecNode.text = '';
          this.buildPromptNode.text = '';
        }

        // Create the carousel if present
        if ( challenge.carouselContents !== null ) {
          var creatorNodeVBox = new HBox( { children: challenge.carouselContents, spacing: 10 } );
          this.shapeCarousel = new Panel( creatorNodeVBox, {
            centerX: this.shapeBoard.centerX,
            top: this.shapeBoard.bottom + 10,
            xMargin: 50,
            yMargin: 15,
            fill: AreaBuilderSharedConstants.CONTROL_PANEL_BACKGROUND_COLOR
          } );
          this.challengeLayer.addChild( this.shapeCarousel );
        }

        // Preset the fake challenge if specified. TODO: Remove once fake challenges no longer exist.
        if ( this.model.currentChallenge.fakeChallenge ) {
          this.model.additionalModel.fakeCorrectAnswerProperty.reset();
          this.challengeView.addChild( new CheckBox( new Text( 'Correct Answer', { font: new PhetFont( 20 ) } ),
            this.model.additionalModel.fakeCorrectAnswerProperty, { left: 300, top: 200 } ) );
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
