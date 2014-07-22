// Copyright 2002-2014, University of Colorado Boulder

/**
 * View representation of a ShapePlacementBoard, which is a board (like a whiteboard or bulletin board) where shapes
 * can be placed.
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var PerimeterShapeNode = require( 'AREA_BUILDER/common/view/PerimeterShapeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Grid = require( 'AREA_BUILDER/common/view/Grid' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param shapePlacementBoard
   * @constructor
   */
  function ShapePlacementBoardNode( shapePlacementBoard ) {
    Node.call( this );

    // Create and add the board itself.
    var board = new Rectangle( 0, 0, shapePlacementBoard.size.width, shapePlacementBoard.size.height, 0, 0, {
      fill: 'white',
      stroke: 'black'
    } );
    this.addChild( board );

    // Set the position
    board.left = shapePlacementBoard.position.x;
    board.top = shapePlacementBoard.position.y;

    // Create and add the grid
    var grid = new Grid( 0, 0, shapePlacementBoard.size.width, shapePlacementBoard.size.height, shapePlacementBoard.unitSquareLength, { stroke: '#C0C0C0' } );
    board.addChild( grid );

    // Track and update the grid visibility
    shapePlacementBoard.showGridProperty.linkAttribute( grid, 'visible' );

    // Monitor the background shape and add/remove/update it as it changes.
    board.addChild( new PerimeterShapeNode(
      shapePlacementBoard.backgroundShapeProperty,
      shapePlacementBoard.unitSquareLength,
      AreaBuilderSharedConstants.BACKGROUND_SHAPE_COLOR,
      shapePlacementBoard.showDimensionsProperty,
      { showGrid: false }
    ) );

    // Add the composite shape, which depicts the collection of all shapes added to the board.
    this.addChild( new PerimeterShapeNode(
      shapePlacementBoard.compositeShapeProperty,
      shapePlacementBoard.unitSquareLength,
      shapePlacementBoard.colorHandled,
      shapePlacementBoard.showDimensionsProperty
    ) );
  }

  return inherit( Node, ShapePlacementBoardNode );
} );