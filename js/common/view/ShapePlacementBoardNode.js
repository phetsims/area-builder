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

  /**
   * @param shapePlacementBoard
   * @constructor
   */
  function ShapePlacementBoardNode( shapePlacementBoard ) {
    Node.call( this );

    // Create and add the background
    var background = new Rectangle( 0, 0, shapePlacementBoard.size.width, shapePlacementBoard.size.height, 0, 0, {
      fill: 'white',
      stroke: black
    } );
    this.addChild( background );

    // Position the background as the board moves
    shapePlacementBoard.positionProperty.link( function( position ) {
      background.left = position
    } )

  }

  return inherit( Node, ShapePlacementBoardNode, {
    //TODO prototypes
  } );
} );