// Copyright 2002-2014, University of Colorado Boulder

/**
 * View representation of a ShapePlacementBoard, which is a board (like a whiteboard or bulletin board) where shapes
 * can be placed.
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Color = require( 'SCENERY/util/Color' );
  var PerimeterShapeNode = require( 'AREA_BUILDER/common/view/PerimeterShapeNode' );
  var Property = require( 'AXON/Property' );
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
    this.backgroundShape = new PerimeterShapeNode(
      shapePlacementBoard.backgroundShapeProperty,
      shapePlacementBoard.unitSquareLength,
      shapePlacementBoard.showDimensionsProperty,
      shapePlacementBoard.showGridOnBackgroundShapeProperty
    );
    board.addChild( this.backgroundShape );

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
    var perimeterColor = shapePlacementBoard.colorHandled === '*' ? 'black' :
                         Color.toColor( shapePlacementBoard.colorHandled ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR );
    this.addChild( new PerimeterShapeNode(
      shapePlacementBoard.compositeShapeProperty,
      shapePlacementBoard.unitSquareLength,
      shapePlacementBoard.showDimensionsProperty,
      new Property( true ) // grid on shape - always shown for the composite shape
    ) );
  }

  return inherit( Node, ShapePlacementBoardNode, {
  } );
} );