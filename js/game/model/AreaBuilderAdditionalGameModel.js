// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var ShapePlacementBoard = require( 'AREA_BUILDER/common/model/ShapePlacementBoard' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var UNIT_SQUARE_LENGTH = 35; // In screen coords, which are roughly pixels
  var BOARD_SIZE = new Dimension2( UNIT_SQUARE_LENGTH * 10, UNIT_SQUARE_LENGTH * 8 );

  /**
   *
   * @constructor
   */
  function AreaBuilderAdditionalGameModel() {
    this.shapePlacementBoard = new ShapePlacementBoard(
      BOARD_SIZE,
      UNIT_SQUARE_LENGTH,
      new Vector2( 200, 100 ),
      'blue'
    )
  }

  return AreaBuilderAdditionalGameModel;
} );