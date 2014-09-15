// Copyright 2002-2014, University of Colorado Boulder

/**
 * Static factory for creating the number-on-a-grid icons used in the level selection screen of the Area Builder game.
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var GridIcon = require( 'AREA_BUILDER/common/view/GridIcon' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var NUM_COLUMNS = 8;
  var NUM_ROWS = 9;
  var CELL_LENGTH = 3;
  var GRID_ICON_OPTIONS = {
    gridStroke: '#eeeeee',
    gridLineWidth: 0.25,
    shapeLineWidth: 0.25
  };

  /**
   * Static object, not meant to be instantiated.
   */
  return {
    createIcon: function( level ) {
      var color;
      var occupiedCells;
      switch( level ) {
        case 1:
          color = AreaBuilderSharedConstants.ORANGISH_COLOR;
          occupiedCells = [
            new Vector2( 4, 1 ),
            new Vector2( 3, 2 ),
            new Vector2( 4, 2 ),
            new Vector2( 4, 3 ),
            new Vector2( 4, 4 ),
            new Vector2( 4, 5 ),
            new Vector2( 4, 6 ),
            new Vector2( 3, 7 ),
            new Vector2( 4, 7 ),
            new Vector2( 5, 7 )
          ];
          break;

        case 2:
          color = AreaBuilderSharedConstants.PURPLISH_COLOR;
          occupiedCells = [
            new Vector2( 2, 1 ),
            new Vector2( 3, 1 ),
            new Vector2( 4, 1 ),
            new Vector2( 5, 1 ),
            new Vector2( 2, 2 ),
            new Vector2( 5, 2 ),
            new Vector2( 5, 3 ),
            new Vector2( 2, 4 ),
            new Vector2( 3, 4 ),
            new Vector2( 4, 4 ),
            new Vector2( 5, 4 ),
            new Vector2( 2, 5 ),
            new Vector2( 2, 6 ),
            new Vector2( 2, 7 ),
            new Vector2( 3, 7 ),
            new Vector2( 4, 7 ),
            new Vector2( 5, 7 )
          ];
          break;

        case 3:
          color = AreaBuilderSharedConstants.GREENISH_COLOR;
          occupiedCells = [
            new Vector2( 2, 1 ),
            new Vector2( 3, 1 ),
            new Vector2( 4, 1 ),
            new Vector2( 5, 1 ),
            new Vector2( 5, 2 ),
            new Vector2( 5, 3 ),
            new Vector2( 3, 4 ),
            new Vector2( 4, 4 ),
            new Vector2( 5, 4 ),
            new Vector2( 5, 5 ),
            new Vector2( 5, 6 ),
            new Vector2( 2, 7 ),
            new Vector2( 3, 7 ),
            new Vector2( 4, 7 ),
            new Vector2( 5, 7 )
          ];
          break;

        case 4:
          color = AreaBuilderSharedConstants.ORANGE_BROWN_COLOR;
          occupiedCells = [
            new Vector2( 5, 1 ),
            new Vector2( 2, 2 ),
            new Vector2( 5, 2 ),
            new Vector2( 2, 3 ),
            new Vector2( 5, 3 ),
            new Vector2( 2, 4 ),
            new Vector2( 5, 4 ),
            new Vector2( 2, 5 ),
            new Vector2( 3, 5 ),
            new Vector2( 4, 5 ),
            new Vector2( 5, 5 ),
            new Vector2( 6, 5 ),
            new Vector2( 5, 6 ),
            new Vector2( 5, 7 )
          ];
          break;

        case 5:
          color = AreaBuilderSharedConstants.DARK_GREEN_COLOR;
          occupiedCells = [
            new Vector2( 2, 1 ),
            new Vector2( 3, 1 ),
            new Vector2( 4, 1 ),
            new Vector2( 5, 1 ),
            new Vector2( 2, 2 ),
            new Vector2( 2, 3 ),
            new Vector2( 2, 4 ),
            new Vector2( 3, 4 ),
            new Vector2( 4, 4 ),
            new Vector2( 5, 4 ),
            new Vector2( 5, 5 ),
            new Vector2( 5, 6 ),
            new Vector2( 2, 7 ),
            new Vector2( 3, 7 ),
            new Vector2( 4, 7 ),
            new Vector2( 5, 7 )
          ];
          break;

        case 6:
          color = '#277DA9';
          occupiedCells = [
            new Vector2( 2, 1 ),
            new Vector2( 3, 1 ),
            new Vector2( 4, 1 ),
            new Vector2( 5, 1 ),
            new Vector2( 2, 2 ),
            new Vector2( 2, 3 ),
            new Vector2( 2, 4 ),
            new Vector2( 3, 4 ),
            new Vector2( 4, 4 ),
            new Vector2( 5, 4 ),
            new Vector2( 2, 5 ),
            new Vector2( 5, 5 ),
            new Vector2( 2, 6 ),
            new Vector2( 5, 6 ),
            new Vector2( 2, 7 ),
            new Vector2( 3, 7 ),
            new Vector2( 4, 7 ),
            new Vector2( 5, 7 )
          ];
          break;
      }
      return new GridIcon( NUM_COLUMNS, NUM_ROWS, CELL_LENGTH, color, occupiedCells, GRID_ICON_OPTIONS );
    }
  };
} );