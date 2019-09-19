// Copyright 2014-2017, University of Colorado Boulder

/**
 * Static factory for creating the number-on-a-grid icons used in the level selection screen of the Area Builder game.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const areaBuilder = require( 'AREA_BUILDER/areaBuilder' );
  const AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  const GridIcon = require( 'AREA_BUILDER/common/view/GridIcon' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const NUM_COLUMNS = 8;
  const NUM_ROWS = 9;
  const CELL_LENGTH = 3;
  const GRID_ICON_OPTIONS = {
    gridStroke: '#dddddd',
    gridLineWidth: 0.25,
    shapeLineWidth: 0.25
  };

  /**
   * Static object, not meant to be instantiated.
   */
  const GameIconFactory = {
    createIcon: function( level ) {
      let color;
      let occupiedCells;
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
          color = AreaBuilderSharedConstants.ORANGE_BROWN_COLOR;
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
          color = AreaBuilderSharedConstants.DARK_GREEN_COLOR;
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
          color = AreaBuilderSharedConstants.PURPLISH_COLOR;
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
          color = AreaBuilderSharedConstants.PINKISH_COLOR;
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

        default:
          throw new Error( 'Unsupported game level: ' + level );
      }
      return new GridIcon( NUM_COLUMNS, NUM_ROWS, CELL_LENGTH, color, occupiedCells, GRID_ICON_OPTIONS );
    }
  };

  areaBuilder.register( 'GameIconFactory', GameIconFactory );

  return GameIconFactory;
} );