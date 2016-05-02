// Copyright 2014-2015, University of Colorado Boulder

/**
 * Game model that works in conjunction with the QuizGameModel to add the elements that are specific to the Area
 * Builder game.  QuizGameModel handles things that are general to PhET's quiz style games, such as state transitions,
 * and this model handles the behavior that is specific to this simulations game, such as how correct answers are
 * presented.  This approach is experimental, and this simulation (Area Builder) is the first time that it is being
 * done, so there may be significant room for improvement.
 *
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var areaBuilder = require( 'AREA_BUILDER/areaBuilder' );
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var BuildSpec = require( 'AREA_BUILDER/game/model/BuildSpec' );
  var Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var MovableShape = require( 'AREA_BUILDER/common/model/MovableShape' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Shape = require( 'KITE/Shape' );
  var ShapePlacementBoard = require( 'AREA_BUILDER/common/model/ShapePlacementBoard' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var UNIT_SQUARE_LENGTH = AreaBuilderSharedConstants.UNIT_SQUARE_LENGTH; // In screen coords, which are roughly pixels
  var BOARD_SIZE = new Dimension2( UNIT_SQUARE_LENGTH * 12, UNIT_SQUARE_LENGTH * 8 );
  var UNIT_SQUARE_SHAPE = Shape.rect( 0, 0, UNIT_SQUARE_LENGTH, UNIT_SQUARE_LENGTH );

  /**
   *
   * @constructor
   */
  function AreaBuilderGameModel() {

    PropertySet.call( this, {
      showGridOnBoard: false,
      showDimensions: false
    } );

    // @public Value where the user's submission of area is stored.
    this.areaGuess = 0;

    // @public The shape board where the user will build and/or evaluate shapes.
    this.shapePlacementBoard = new ShapePlacementBoard(
      BOARD_SIZE,
      UNIT_SQUARE_LENGTH,
      new Vector2( ( AreaBuilderSharedConstants.LAYOUT_BOUNDS.width - BOARD_SIZE.width ) * 0.55, 85 ), // Position empirically determined
      '*', // Allow any color shape to be placed on the board
      this.showGridOnBoardProperty,
      this.showDimensionsProperty
    );

    // @public Array where shapes that are added by the user are tracked.
    this.movableShapes = new ObservableArray();

    // @private The location from which squares that animate onto the board to show a solution should emerge.  The
    // offset is empirically determined to be somewhere in the carousel.
    this.solutionShapeOrigin = new Vector2( this.shapePlacementBoard.bounds.left + 30, this.shapePlacementBoard.bounds.maxY + 30 );
  }

  areaBuilder.register( 'AreaBuilderGameModel', AreaBuilderGameModel );

  return inherit( PropertySet, AreaBuilderGameModel, {

      // @private - replace a composite shape with unit squares
      replaceShapeWithUnitSquares: function( movableShape ){
        var self = this;
        assert && assert(
          movableShape.shape.bounds.width > UNIT_SQUARE_LENGTH || movableShape.shape.bounds.height > UNIT_SQUARE_LENGTH,
          'This method should not be called for non-composite shapes'
        );

        // break the shape into the constituent squares
        var constituentShapes = movableShape.decomposeIntoSquares( UNIT_SQUARE_LENGTH );

        // add the newly created squares to this model
        constituentShapes.forEach( function( shape ) { self.addUserCreatedMovableShape( shape ); } );

        // replace the shape on the shape placement board with unit squares
        self.shapePlacementBoard.replaceShapeWithUnitSquares( movableShape, constituentShapes );

        // remove the original composite shape from this model
        self.movableShapes.remove( movableShape );
      },

      /**
       * Function for adding new movable shapes to this model when the user is creating them, generally by clicking on
       * some sort of creator node.
       * @public
       * @param movableShape
       */
      addUserCreatedMovableShape: function( movableShape ) {
        var self = this;
        this.movableShapes.push( movableShape );

        movableShape.userControlledProperty.lazyLink( function( userControlled ) {
          if ( !userControlled ) {
            if ( self.shapePlacementBoard.placeShape( movableShape ) ) {
              if ( movableShape.shape.bounds.width > UNIT_SQUARE_LENGTH || movableShape.shape.bounds.height > UNIT_SQUARE_LENGTH ) {

                // This is a composite shape, meaning that it is made up of more than one unit square.  Rather than
                // tracking these, the design team decided that they should decompose into individual unit squares once
                // they have been placed.
                if ( movableShape.animating ) {
                  movableShape.animatingProperty.once( function( animating ) {

                    // Decompose the shape once it has landed on the board.  In the 'if' clause below, we test to make
                    // sure that the shape is actually on the board.  This is necessary because of a race condition
                    // where a shape can actually end up orphaned before it completes its animation sequence.  See
                    // https://github.com/phetsims/area-builder/issues/71.
                    if ( !animating && self.shapePlacementBoard.isResidentShape( movableShape)) {
                      self.replaceShapeWithUnitSquares( movableShape );
                    }
                  } );
                }
                else {

                  // decompose the shape now, since it is already on the board
                  self.replaceShapeWithUnitSquares( movableShape );
                }
              }
            }
            else {
              // Shape did not go onto board, possibly because it's not over the board or the board is full.  Send it
              // home.
              movableShape.returnToOrigin( true );
            }
          }
        } );

        // Remove the shape if it returns to its origin, since at that point it has essentially been 'put away'.
        movableShape.on( 'returnedToOrigin', function() {
          if ( !movableShape.userControlled ) {
            self.movableShapes.remove( movableShape );
          }
        } );

        // Another point at which the shape is removed is if it fades away.
        movableShape.on( 'fadedAway', function() {
          self.movableShapes.remove( movableShape );
        } );
      },

      /**
       * Add a unit square directly to the shape placement board in the specified cell location (as opposed to model
       * location).  This was created to enable solutions to game challenges to be shown, but may have other uses.
       * @param cellColumn
       * @param cellRow
       * @param color
       * @private
       */
      addUnitSquareDirectlyToBoard: function( cellColumn, cellRow, color ) {
        var self = this;
        var shape = new MovableShape( UNIT_SQUARE_SHAPE, color, this.solutionShapeOrigin );
        this.movableShapes.push( shape );

        // Remove this shape when it gets returned to its original location.
        shape.on( 'returnedToOrigin', function() {
          if ( !shape.userControlled ) {
            self.movableShapes.remove( shape );
          }
        } );

        this.shapePlacementBoard.addShapeDirectlyToCell( cellColumn, cellRow, shape );
      },

      // @public, Clear the placement board of all shapes placed on it by the user
      clearShapePlacementBoard: function() {
        this.shapePlacementBoard.releaseAllShapes( 'jumpHome' );
      },

      // @public?
      startLevel: function() {
        // Clear the 'show dimensions' and 'show grid' flag at the beginning of each new level.
        this.shapePlacementBoard.showDimensionsProperty.value = false;
        this.shapePlacementBoard.showGridProperty.value = false;
      },

      // @public
      displayCorrectAnswer: function( challenge ) {
        var self = this;
        if ( challenge.buildSpec ) {
          this.clearShapePlacementBoard();

          // Add the shapes that comprise the solution.
          assert && assert( challenge.exampleBuildItSolution !== null, 'Error: Challenge does not contain an example solution.' );
          challenge.exampleBuildItSolution.forEach( function( shapePlacementSpec ) {
            self.addUnitSquareDirectlyToBoard( shapePlacementSpec.cellColumn, shapePlacementSpec.cellRow, shapePlacementSpec.color );
          } );
        }
        else if ( challenge.checkSpec === 'areaEntered' ) {
          // For 'find the area' challenges, we turn on the grid for the background shape when displaying the answer.
          this.shapePlacementBoard.showGridOnBackgroundShape = true;
        }
      },

      // @public
      checkAnswer: function( challenge ) {

        var answerIsCorrect = false;
        var userBuiltSpec;
        switch( challenge.checkSpec ) {

          case 'areaEntered':
            answerIsCorrect = this.areaGuess === challenge.backgroundShape.unitArea;
            break;

          case 'areaConstructed':
            answerIsCorrect = challenge.buildSpec.area === this.shapePlacementBoard.areaAndPerimeter.area;
            break;

          case 'areaAndPerimeterConstructed':
            answerIsCorrect = challenge.buildSpec.area === this.shapePlacementBoard.areaAndPerimeter.area &&
                              challenge.buildSpec.perimeter === this.shapePlacementBoard.areaAndPerimeter.perimeter;
            break;

          case 'areaAndProportionConstructed':
            userBuiltSpec = new BuildSpec(
              this.shapePlacementBoard.areaAndPerimeter.area,
              null,
              {
                color1: challenge.buildSpec.proportions.color1,
                color2: challenge.buildSpec.proportions.color2,
                color1Proportion: this.getProportionOfColor( challenge.buildSpec.proportions.color1 )
              }
            );
            answerIsCorrect = userBuiltSpec.equals( challenge.buildSpec );
            break;

          case 'areaPerimeterAndProportionConstructed':
            userBuiltSpec = new BuildSpec(
              this.shapePlacementBoard.areaAndPerimeter.area,
              this.shapePlacementBoard.areaAndPerimeter.perimeter,
              {
                color1: challenge.buildSpec.proportions.color1,
                color2: challenge.buildSpec.proportions.color2,
                color1Proportion: this.getProportionOfColor( challenge.buildSpec.proportions.color1 )
              }
            );
            answerIsCorrect = userBuiltSpec.equals( challenge.buildSpec );
            break;

          default:
            assert && assert( false, 'Unhandled check spec' );
            answerIsCorrect = false;
            break;
        }

        return answerIsCorrect;
      },

      // @public, Called from main model so that this model can do what it needs to in order to give the user another chance.
      tryAgain: function() {
        // Nothing needs to be reset in this model to allow the user to try again.
      },

      /**
       * Returns the proportion of the shapes on the board that are the same color as the provided value.
       * @param color
       */
      getProportionOfColor: function( color ) {
        // Pass through to the shape placement board.
        return this.shapePlacementBoard.getProportionOfColor( color );
      },

      /**
       * Set up anything in the model that is needed for the specified challenge.
       *
       * @param challenge
       * @public
       */
      setChallenge: function( challenge ) {
        if ( challenge ) {
          assert && assert( typeof( challenge.backgroundShape !== 'undefined' ) );

          // Set the background shape.
          this.shapePlacementBoard.setBackgroundShape( challenge.backgroundShape, true );
          this.shapePlacementBoard.showGridOnBackgroundShape = false; // Initially off, may be turned on when showing solution.

          // Set the board to either form composite shapes or allow free placement.
          this.shapePlacementBoard.formComposite = challenge.backgroundShape === null;

          // Set the color scheme of the composite so that the placed squares can be seen if needed.
          if ( challenge.buildSpec && this.shapePlacementBoard.formComposite && challenge.userShapes ) {

            // Make the perimeter color be a darker version of the first user shape.
            var perimeterColor = Color.toColor( challenge.userShapes[ 0 ].color ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR );

            var fillColor;
            if ( challenge.buildSpec.proportions ) {
              // The composite shape needs to be see through so that the original shapes can be seen.  This allows
              // multiple colors to be depicted, but generally doesn't look quite as good.
              fillColor = null;
            }
            else {
              // The fill color should be the same as the user shapes.  Assume all user shapes are the same color.
              fillColor = challenge.userShapes[ 0 ].color;
            }

            this.shapePlacementBoard.setCompositeShapeColorScheme( fillColor, perimeterColor );
          }
        }
      },

      step: function( dt ) {
        this.movableShapes.forEach( function( movableShape ) { movableShape.step( dt ); } );
      },

      // Resets all model elements
      reset: function() {
        this.shapePlacementBoard.releaseAllShapes( 'jumpHome' );
        this.movableShapes.clear();
      }
    },
    {
      // Size of the shape board in terms of the unit length, needed by the challenge factory.
      SHAPE_BOARD_UNIT_WIDTH: BOARD_SIZE.width / UNIT_SQUARE_LENGTH,
      SHAPE_BOARD_UNIT_HEIGHT: BOARD_SIZE.height / UNIT_SQUARE_LENGTH,
      UNIT_SQUARE_LENGTH: UNIT_SQUARE_LENGTH
    }
  );
} );