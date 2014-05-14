// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main model class for the 'Explore' screen of the Area simulation.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var Property = require( 'AXON/Property' );
  var ShapePlacementBoard = require( 'AREA/common/model/ShapePlacementBoard' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var UNIT_SQUARE_LENGTH = 40; // In screen coords, which are roughly pixels
  var BOARD_SIZE = new Dimension2( UNIT_SQUARE_LENGTH * 8, UNIT_SQUARE_LENGTH * 8 );
  var PLAY_AREA_WIDTH = 768; // Based on default size in ScreenView.js
  var SPACE_BETWEEN_PLACEMENT_BOARDS = 40;
  var BOARD_Y_POS = 40;

  function AreaExplorationModel() {
    var thisModel = this;

    // TODO: If a bunch of properties are added, consider making this extend PropertySet
    this.showGrids = new Property( false ); // @public
    this.showBothBoards = new Property( true ); // @public

    // Create the shape placement boards
    var leftBoardDefaultLocation = new Vector2( PLAY_AREA_WIDTH / 2 - SPACE_BETWEEN_PLACEMENT_BOARDS / 2 - BOARD_SIZE.width, BOARD_Y_POS );
    thisModel.leftShapePlacementBoard = new ShapePlacementBoard( BOARD_SIZE, UNIT_SQUARE_LENGTH, leftBoardDefaultLocation ); // @public
    var rightBoardDefaultLocation = new Vector2( PLAY_AREA_WIDTH / 2 + SPACE_BETWEEN_PLACEMENT_BOARDS / 2, BOARD_Y_POS );
    thisModel.rightShapePlacementBoard = new ShapePlacementBoard( BOARD_SIZE, UNIT_SQUARE_LENGTH, rightBoardDefaultLocation ); // @public

    // Center the left board if it is the only one visible
    var leftBoardLocationWhenAlone = new Vector2( PLAY_AREA_WIDTH / 2 - BOARD_SIZE.width / 2, BOARD_Y_POS );
    thisModel.showBothBoards.link( function( showBothBoards ) {
        thisModel.leftShapePlacementBoard.position = showBothBoards ? leftBoardDefaultLocation : leftBoardLocationWhenAlone;
      }
    );

    // Control grid visibility
    this.showGrids.link( function( showGrids ) {
      thisModel.leftShapePlacementBoard.gridVisible = showGrids;
      thisModel.rightShapePlacementBoard.gridVisible = showGrids;
    } );
  }

  AreaExplorationModel.prototype = {

    // Resets all model elements
    reset: function() {
      // TODO
    }

  };

  return AreaExplorationModel;
} );
