// Copyright 2014-2015, University of Colorado Boulder

/**
 * View representation of a ShapePlacementBoard, which is a board (like a whiteboard or bulletin board) where shapes
 * can be placed.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var Grid = require( 'AREA_BUILDER/common/view/Grid' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PerimeterShapeNode = require( 'AREA_BUILDER/common/view/PerimeterShapeNode' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {ShapePlacementBoard} shapePlacementBoard
   * @constructor
   */
  function ShapePlacementBoardNode( shapePlacementBoard ) {
    Node.call( this );

    // Create and add the board itself.
    var board = Rectangle.bounds( shapePlacementBoard.bounds, { fill: 'white', stroke: 'black' } );
    this.addChild( board );

    // Create and add the grid
    var grid = new Grid( shapePlacementBoard.bounds, shapePlacementBoard.unitSquareLength, { stroke: '#C0C0C0' } );
    this.addChild( grid );

    // Track and update the grid visibility
    shapePlacementBoard.showGridProperty.linkAttribute( grid, 'visible' );

    // Monitor the background shape and add/remove/update it as it changes.
    this.backgroundShape = new PerimeterShapeNode(
      shapePlacementBoard.backgroundShapeProperty,
      shapePlacementBoard.bounds,
      shapePlacementBoard.unitSquareLength,
      shapePlacementBoard.showDimensionsProperty,
      shapePlacementBoard.showGridOnBackgroundShapeProperty
    );
    this.addChild( this.backgroundShape );

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
    this.addChild( new PerimeterShapeNode(
      shapePlacementBoard.compositeShapeProperty,
      shapePlacementBoard.bounds,
      shapePlacementBoard.unitSquareLength,
      shapePlacementBoard.showDimensionsProperty,
      new Property( true ) // grid on shape - always shown for the composite shape
    ) );
  }

  return inherit( Node, ShapePlacementBoardNode );
} );