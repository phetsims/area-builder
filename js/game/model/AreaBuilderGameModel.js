// Copyright 2002-2014, University of Colorado Boulder

/**
 * Game model that works in conjunction with the QuizGameModel to add the elements that are specific to the Area
 * Builder game.
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var MovableShape = require( 'AREA_BUILDER/common/model/MovableShape' );
  var Property = require( 'AXON/Property' );
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
      showGrid: false,
      showDimensions: false
    } );

    // Temp property for 'fake' challenges.  TODO - Remove this when all challenges are working.
    this.fakeCorrectAnswerProperty = new Property( false );

    // @public Value where the user's submission of area is stored.
    this.areaGuess = 0;

    // @public The shape board where the user will build and/or evaluate shapes.
    this.shapePlacementBoard = new ShapePlacementBoard(
      BOARD_SIZE,
      UNIT_SQUARE_LENGTH,
      new Vector2( 200, 100 ),
      '*', // Allow any color shape to be placed on the board
      this.showGridProperty,
      this.showDimensionsProperty
    );

    // @public Array where shapes that are added by the user are tracked.
    this.movableShapes = new ObservableArray();

    // @private The location from which squares that animate onto the board to show a solution should emerge.  The
    // offset is empirically determined to be somewhere in the carousel.
    this.solutionShapeOrigin = new Vector2( this.shapePlacementBoard.bounds.left + 30, this.shapePlacementBoard.bounds.maxY + 30 );
  }

  return inherit( PropertySet, AreaBuilderGameModel, {

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
                var decomposeShape = function() {
                  var constituentShapes = movableShape.decomposeIntoSquares( UNIT_SQUARE_LENGTH );
                  constituentShapes.forEach( function( shape ) { self.addUserCreatedMovableShape( shape ); } );
                  self.movableShapes.remove( movableShape );
                  self.shapePlacementBoard.replaceShapeWithUnitSquares( movableShape, constituentShapes );
                };
                if ( movableShape.animating ) {
                  movableShape.animatingProperty.once( function() { decomposeShape(); } );
                }
                else {
                  decomposeShape();
                }
              }
            }
            else {
              // Shape did not go onto board, possibly because it's not over the board or the board is full.  Send it
              // home.
              movableShape.goHome( true );
            }
          }
        } );

        //TODO: This doesn't feel quite right and should be revisited later in the evolution of this simulation.  It is
        //TODO: relying on the shape to return to its origin and not be user controlled in order to remove it from the
        //TODO: model.  It may make more sense to have an explicit 'freed' or 'dismissed' signal or something of that
        //TODO: nature.
        movableShape.on( 'returnedHome', function() {
          if ( !movableShape.userControlled ) {
            // The shape has been returned to its origin.
            self.movableShapes.remove( movableShape );
          }
        } );
      },

      /**
       * Add a unit square directly to the shape placement board in the specified cell location (as opposed to model
       * location).  This was created to enable solutions to game challenges to be shown, but may have other uses.
       * @param cellColumn
       * @param cellRow
       * @param color
       */
      addUnitSquareDirectlyToBoard: function( cellColumn, cellRow, color ) {
        var self = this;
        var shape = new MovableShape( UNIT_SQUARE_SHAPE, color, this.solutionShapeOrigin );
        this.movableShapes.push( shape );

        // TODO: As noted above, it's a little weird to rely on returning home to remove the shape.  May want to change eventually.
        shape.on( 'returnedHome', function() {
          // The shape has been returned to its origin.
          self.movableShapes.remove( shape );
        } );

        this.shapePlacementBoard.addShapeDirectlyToCell( cellColumn, cellRow, shape );
      },

      // Clear the placement board of all shapes placed on it by the user
      clearShapePlacementBoard: function() {
        this.shapePlacementBoard.releaseAllShapes( false );
      },

      displayCorrectAnswer: function( challenge ) {
        var self = this;
        // TODO - remove this when fake challenges are no longer needed.
        this.fakeCorrectAnswerProperty.value = true;
        if ( challenge.buildSpec ) {
          this.clearShapePlacementBoard();

          // Add the shapes that comprise the solution.
          assert && assert( challenge.exampleBuildItSolution !== null, 'Error: Challenge does not contain an example solution.' );
          challenge.exampleBuildItSolution.forEach( function( shapePlacementSpec ) {
            self.addUnitSquareDirectlyToBoard( shapePlacementSpec.cellColumn, shapePlacementSpec.cellRow, shapePlacementSpec.color );
          } );
        }
      },

      checkAnswer: function( challenge ) {

        // TODO: Remove this when fake challenges are removed.
        if ( challenge.fakeChallenge ) {
          return this.fakeCorrectAnswerProperty.value;
        }

        var answerIsCorrect = false;
        switch( challenge.checkSpec ) {
          case 'areaEntered':
            // This is a "find the area" style of challenge
            answerIsCorrect = this.areaGuess === challenge.backgroundShape.unitArea;
            break;

          case 'areaConstructed':
            answerIsCorrect = challenge.buildSpec.area === this.shapePlacementBoard.area;
            break;

          case 'areaAndPerimeterConstructed':
            answerIsCorrect = challenge.buildSpec.area === this.shapePlacementBoard.area &&
                              challenge.buildSpec.perimeter === this.shapePlacementBoard.perimeter;
            break;

          case 'areaAndProportionConstructed':
            var color1TargetProportion = challenge.buildSpec.proportion.color1ProportionNumerator / challenge.buildSpec.proportion.color1ProportionDenominator;
            answerIsCorrect = challenge.buildSpec.area === this.shapePlacementBoard.area &&
                              this.testColorProportion( challenge.buildSpec.proportion.color1, color1TargetProportion ) &&
                              this.testColorProportion( challenge.buildSpec.proportion.color2, 1 - color1TargetProportion );
            break;

          case 'areaPerimeterAndProportionConstructed':
            color1TargetProportion = challenge.buildSpec.proportion.color1ProportionNumerator / challenge.buildSpec.proportion.color1ProportionDenominator;
            answerIsCorrect = challenge.buildSpec.area === this.shapePlacementBoard.area &&
                              challenge.buildSpec.perimeter === this.shapePlacementBoard.perimeter &&
                              this.testColorProportion( challenge.buildSpec.proportion.color1, color1TargetProportion ) &&
                              this.testColorProportion( challenge.buildSpec.proportion.color2, 1 - color1TargetProportion );
            break;

          default:
            assert && assert( false, 'Unhandled check spec' );
            answerIsCorrect = false;
            break;
        }

        return answerIsCorrect;
      },

      // Returns true if the proportion of the current shapes that are the provided color is equal to the provided
      // proportion value, false otherwise.
      testColorProportion: function( color, proportion ) {
        var testColor = Color.toColor( color );
        var colorCount = 0;
        this.movableShapes.forEach( function( movableShape ) {
          if ( testColor.equals( Color.toColor( movableShape.color ) ) ) {
            colorCount++;
          }
        } );

        // Compare proportions while accounting for floating point errors.
        return ( Math.abs( proportion - colorCount / this.movableShapes.length ) ) < 1E-6;
      },

      /**
       * Set up anything in the model that is needed for the specified challenge.
       *
       * @param challenge
       */
      setChallenge: function( challenge ) {
        assert && assert( typeof( challenge.backgroundShape !== 'undefined' ) );

        // Set the background shape.  If none is included, the value should be null, which will clear the shape.
        this.shapePlacementBoard.setBackgroundShape( challenge.backgroundShape, true );

        // Set the board to either form composite shapes or allow free placement.
        this.shapePlacementBoard.formComposite = challenge.backgroundShape === null;

        // Clear the 'show dimensions' and 'show grid' flag for each new challenge.
        this.shapePlacementBoard.showDimensionsProperty.value = false;
        this.shapePlacementBoard.showGridProperty.value = false;
      },

      step: function( dt ) {
        this.movableShapes.forEach( function( movableShape ) { movableShape.step( dt ); } );
      },

      // Resets all model elements
      reset: function() {
        this.shapePlacementBoard.releaseAllShapes( false );
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