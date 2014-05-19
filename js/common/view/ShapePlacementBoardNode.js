// Copyright 2002-2014, University of Colorado Boulder

/**
 * View representation of a ShapePlacementBoard, which is a board (like a
 * whiteboard or bulletin board) where shapes can be placed.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Grid = require( 'AREA_BUILDER/common/view/Grid' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Line = require( 'SCENERY/nodes/Line' );

  /**
   * @param shapePlacementBoard
   * @constructor
   */
  function ShapePlacementBoardNode( shapePlacementBoard ) {
    Node.call( this );

    // Create and add the background
    var background = new Rectangle( 0, 0, shapePlacementBoard.size.width, shapePlacementBoard.size.height, 0, 0, {
      fill: 'white',
      stroke: 'black'
    } );
    this.addChild( background );

    // Track and update the position
    shapePlacementBoard.positionProperty.link( function( position ) {
      background.left = position.x;
      background.top = position.y;
    } );

    // Create and add the grid
    var lineOptions = { stroke: '#909090', lineWidth: 1 };
    var grid = new Grid( shapePlacementBoard.size, shapePlacementBoard.unitSquareLength, lineOptions );
    background.addChild( grid );

    // Track and update the grid visibility
    shapePlacementBoard.gridVisibleProperty.link( function( gridVisible ) {
      grid.visible = gridVisible;
    } );
  }

  return inherit( Node, ShapePlacementBoardNode, {
    //TODO prototypes
  } );
} );