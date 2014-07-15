// Copyright 2002-2014, University of Colorado Boulder

/**
 * Game model that works in conjunction with the QuizGameModel to add the elements that are specific to the Area
 * Builder game.
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ShapePlacementBoard = require( 'AREA_BUILDER/common/model/ShapePlacementBoard' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var UNIT_SQUARE_LENGTH = AreaBuilderSharedConstants.UNIT_SQUARE_LENGTH; // In screen coords, which are roughly pixels
  var BOARD_SIZE = new Dimension2( UNIT_SQUARE_LENGTH * 12, UNIT_SQUARE_LENGTH * 8 );

  /**
   *
   * @constructor
   */
  function AreaBuilderAdditionalGameModel() {

    PropertySet.call( this, {
      showGrid: true,
      showDimensions: false
    } );

    // Temp property for 'fake' challenges.  TODO - Remove this when all challenges are working.
    this.fakeCorrectAnswerProperty = new Property( false );

    // @public The shape board where the user will build and/or evaluate shapes.
    this.shapePlacementBoard = new ShapePlacementBoard(
      BOARD_SIZE,
      UNIT_SQUARE_LENGTH,
      new Vector2( 200, 100 ),
      AreaBuilderSharedConstants.GREENISH_COLOR,
      this.showGridProperty,
      this.showDimensionsProperty
    );

    // Array where shapes that are added by the user are tracked.
    this.movableShapes = new ObservableArray(); // @public
  }

  return inherit( PropertySet, AreaBuilderAdditionalGameModel, {

      // Function for adding new movable elements to this model
      addModelElement: function( movableShape ) {
        var self = this;
        this.movableShapes.push( movableShape );

        movableShape.userControlledProperty.lazyLink( function( userControlled ) {
          if ( !userControlled ) {
            if ( self.shapePlacementBoard.placeShape( movableShape ) ) {
              if ( movableShape.shape.bounds.width > UNIT_SQUARE_LENGTH || movableShape.shape.bounds.height > UNIT_SQUARE_LENGTH ) {
                // This is a composite shape, meaning that it is made up of more than one unit square.  Rather than
                // tracking these, the design team decided that they should decompose into individual unit squares.
                // This is done here, after placement is complete.
                var decomposeShape = function() {
                  var constituentShapes = movableShape.decomposeIntoSquares( UNIT_SQUARE_LENGTH );
                  constituentShapes.forEach( function( shape ) { self.addModelElement( shape ) } );
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

      // Clear the placement board of all shapes placed on it by the user
      clearUserPlacedShapes: function() {
        this.shapePlacementBoard.releaseAllShapes( false );
      },

      displayCorrectAnswer: function( challenge ) {
        // TODO - stubbed for now
        this.fakeCorrectAnswerProperty.value = true;
      },

      checkAnswer: function( challenge ) {
        var answerIsCorrect = false;
        // TODO: Get rid of the following if clause when fake challenges are removed.
        if ( challenge.fakeChallenge ) {
          answerIsCorrect = this.fakeCorrectAnswerProperty.value;
        }
        else if ( challenge.buildSpec ) {
          answerIsCorrect = challenge.buildSpec.area === this.shapePlacementBoard.area;
          if ( answerIsCorrect && challenge.buildSpec.perimeter ) {
            answerIsCorrect = challenge.buildSpec.perimeter === this.shapePlacementBoard.exteriorPerimeters[0].length;
          }
        }

        return answerIsCorrect;
      },

      step: function( dt ) {
        this.movableShapes.forEach( function( movableShape ) { movableShape.step( dt ); } );
      },

      // Resets all model elements
      reset: function() {
        this.shapePlacementBoard.releaseAllShapes( false );
        this.movableShapes.clear();
      }
    }
  );
} );