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
  var UNIT_SQUARE_LENGTH = 20; // In screen coords, which are roughly pixels
  var BOARD_SIZE = new Dimension2( UNIT_SQUARE_LENGTH * 10, UNIT_SQUARE_LENGTH * 10 );

  function AreaExplorationModel() {
    var thisModel = this;

    // TODO: If a bunch of properties are added, consider making this extend PropertySet
    this.showGrids = new Property( false ); // @public

    // Create the shape placement boards
    thisModel.leftShapePlacementBoard = new ShapePlacementBoard( BOARD_SIZE, UNIT_SQUARE_LENGTH, Vector2.ZERO ); // @public

    // Control grid visibility
    this.showGrids.link( function( showGrids ) {
      thisModel.leftShapePlacementBoard.gridVisible = showGrids;
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
