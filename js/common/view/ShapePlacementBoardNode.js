// Copyright 2002-2014, University of Colorado Boulder

/**
 * View representation of a ShapePlacementBoard, which is a board (like a
 * whiteboard or bulletin board) where shapes can be placed.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
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
    var grid = new Node();
    var lineOptions = { stroke: '#909090', lineWidth: 1 };
    for ( var i = shapePlacementBoard.unitSquareLength; i < shapePlacementBoard.size.width; i += shapePlacementBoard.unitSquareLength ) {
      // Add a vertical line
      grid.addChild( new Line( i, 0, i, shapePlacementBoard.size.height, lineOptions ) );
    }
    for ( i = shapePlacementBoard.unitSquareLength; i < shapePlacementBoard.size.height; i += shapePlacementBoard.unitSquareLength ) {
      // Add a horizontal line
      grid.addChild( new Line( 0, i, shapePlacementBoard.size.width, i, lineOptions ) );
    }
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