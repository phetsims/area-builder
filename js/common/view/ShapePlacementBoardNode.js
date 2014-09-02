// Copyright 2002-2014, University of Colorado Boulder

/**
 * View representation of a ShapePlacementBoard, which is a board (like a whiteboard or bulletin board) where shapes
 * can be placed.
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Grid = require( 'AREA_BUILDER/common/view/Grid' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PerimeterShapeNode = require( 'AREA_BUILDER/common/view/PerimeterShapeNode' );
  var Property = require( 'AXON/Property' );
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
    var grid = new Grid( 0, 0, shapePlacementBoard.size.width, shapePlacementBoard.size.height,
      shapePlacementBoard.unitSquareLength, { stroke: '#C0C0C0' } );
    board.addChild( grid );

    // Track and update the grid visibility
    shapePlacementBoard.showGridProperty.linkAttribute( grid, 'visible' );

    var placementBoardBounds = new Bounds2(
      shapePlacementBoard.position.x,
      shapePlacementBoard.position.y,
      ( shapePlacementBoard.position.x + shapePlacementBoard.size.width ),
      ( shapePlacementBoard.position.y + shapePlacementBoard.size.height )
    );

    // Monitor the background shape and add/remove/update it as it changes.
    this.backgroundShape = new PerimeterShapeNode(
      shapePlacementBoard.backgroundShapeProperty,
      placementBoardBounds,
      shapePlacementBoard.unitSquareLength,
      shapePlacementBoard.showDimensionsProperty,
      shapePlacementBoard.showGridOnBackgroundShapeProperty
    );
    board.addChild( this.backgroundShape );

    // TODO: Temp for testing --------------
    this.addChild( Rectangle.bounds( this.backgroundShape.bounds, { fill: 'rgba( 0, 0, 255, 0.5 )' } ) );// TODO: Temp for testing --------------
    // End of temp for testing --------------


    // Monitor the shapes added by the user to the board and create an equivalent shape with no edges for each.  This
    // may seem a little odd - why hide the shapes that the user placed and depict them with essentially the same
    // thing minus the edge stroke?  The reason is that this makes layering and control of visual modes much easier.
    var shapesLayer = new Node();
    this.addChild( shapesLayer );
    shapePlacementBoard.residentShapes.addItemAddedListener( function( addedShape ) {
      if ( shapePlacementBoard.formComposite ) {
        // Add a representation of the shape.
        var representation = new Path( addedShape.shape, {
          fill: addedShape.color,
          left: addedShape.position.x,
          top: addedShape.position.y
        } );
        shapesLayer.addChild( representation );

        shapePlacementBoard.residentShapes.addItemRemovedListener( function removalListener( removedShape ) {
          if ( removedShape === addedShape ) {
            shapesLayer.removeChild( representation );
            shapePlacementBoard.residentShapes.removeItemRemovedListener( removalListener );
          }
        } );
      }
    } );

    // Add the perimeter shape, which depicts the exterior and interior perimeters formed by the placed shapes.
    var tempRef;
    this.addChild( tempRef = new PerimeterShapeNode(
      shapePlacementBoard.compositeShapeProperty,
      placementBoardBounds,
      shapePlacementBoard.unitSquareLength,
      shapePlacementBoard.showDimensionsProperty,
      new Property( true ) // grid on shape - always shown for the composite shape
    ) );
    // TODO: Temp for testing --------------
//    this.addChild( Rectangle.bounds( tempRef.bounds, { fill: 'rgba( 255, 0, 0, 0.5 )' } ) );// TODO: Temp for testing --------------
    this.addChild( Rectangle.bounds( this.localBounds, { fill: 'rgba( 255, 0, 0, 0.5 )' } ) );// TODO: Temp for testing --------------
    // End of temp for testing --------------

  }

  return inherit( Node, ShapePlacementBoardNode, {
  } );
} );