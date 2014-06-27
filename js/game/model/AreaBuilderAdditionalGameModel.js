// Copyright 2002-2014, University of Colorado Boulder

/**
 * Game model that works in conjunction with the QuizGameModel to add the elements that are specific to the Area
 * Builder game.
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Property = require( 'AXON/Property' );
  var ShapePlacementBoard = require( 'AREA_BUILDER/common/model/ShapePlacementBoard' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var UNIT_SQUARE_LENGTH = 35; // In screen coords, which are roughly pixels
  var BOARD_SIZE = new Dimension2( UNIT_SQUARE_LENGTH * 12, UNIT_SQUARE_LENGTH * 8 );

  /**
   *
   * @constructor
   */
  function AreaBuilderAdditionalGameModel() {

    // Temp property for 'fake' challenges.  TODO - Remove this when all challenges are working.
    this.fakeCorrectAnswerProperty = new Property( false );

    // @public The shape board where the user will build and/or evaluate shapes.
    this.shapePlacementBoard = new ShapePlacementBoard(
      BOARD_SIZE,
      UNIT_SQUARE_LENGTH,
      new Vector2( 200, 100 ),
      'red'
    );

    // Array where shapes that are added by the user are tracked.
    this.movableShapes = new ObservableArray(); // @public
  }

  AreaBuilderAdditionalGameModel.prototype = {

    // Function for adding new movable elements to this model
    addModelElement: function( shape ) {
      var self = this;
      this.movableShapes.push( shape );
      shape.userControlledProperty.link( function( userControlled ) {
        if ( !userControlled ) {
          if ( !self.shapePlacementBoard.placeShape( shape ) ) {
            // Shape did not go onto board, possibly because it's not over the board or the board is fill.  Send it home.
            shape.goHome();
          }
        }
      } );

      //TODO: This doesn't feel quite right and should be revisited later in the evolution of this simulation.  It is
      //TODO: relying on the shape to return to its origin and not be user controlled in order to remove it from the
      //TODO: model.  It may make more sense to have an explicit 'freed' or 'dismissed' signal or something of that
      //TODO: nature.
      shape.on( 'returnedHome', function() {
        if ( !shape.userControlled ) {
          // The shape has been returned to the bucket.
          self.movableShapes.remove( shape );
        }
      } );
    },

    displayCorrectAnswer: function( challenge ) {
      // TODO - stubbed for now
      this.fakeCorrectAnswerProperty.value = true;
    },

    checkAnswer: function( challenge ) {
      // TODO: Temp
      return this.fakeCorrectAnswerProperty.value;
    },

    step: function( dt ) {
      this.movableShapes.forEach( function( movableShape ) { movableShape.step( dt ); } );
    },

    // Resets all model elements
    reset: function() {
      this.shapePlacementBoards.forEach( function( board ) { board.releaseAllShapes(); } );
      this.shapePlacementBoards.reset();
      this.movableShapes.clear();
    }
  };

  return AreaBuilderAdditionalGameModel;
} );