// Copyright 2014-2018, University of Colorado Boulder

/**
 * A composite node that depicts a shape placement board, a bucket containing shapes to go on the board, an area and
 * perimeter readout, and an erase button.  These are consolidated together in this node to avoid code duplication.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const AreaAndPerimeterDisplay = require( 'AREA_BUILDER/explore/view/AreaAndPerimeterDisplay' );
  const areaBuilder = require( 'AREA_BUILDER/areaBuilder' );
  const AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const BucketFront = require( 'SCENERY_PHET/bucket/BucketFront' );
  const BucketHole = require( 'SCENERY_PHET/bucket/BucketHole' );
  const Color = require( 'SCENERY/util/Color' );
  const EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Shape = require( 'KITE/Shape' );
  const ShapeCreatorNode = require( 'AREA_BUILDER/common/view/ShapeCreatorNode' );
  const ShapeNode = require( 'AREA_BUILDER/common/view/ShapeNode' );
  const ShapePlacementBoardNode = require( 'AREA_BUILDER/common/view/ShapePlacementBoardNode' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const SPACE_AROUND_SHAPE_PLACEMENT_BOARD = AreaBuilderSharedConstants.CONTROLS_INSET;
  const IDENTITY_TRANSFORM = ModelViewTransform2.createIdentity();
  const UNIT_SQUARE_LENGTH = AreaBuilderSharedConstants.UNIT_SQUARE_LENGTH;
  const UNIT_RECTANGLE_SHAPE = Shape.rect( 0, 0, UNIT_SQUARE_LENGTH, UNIT_SQUARE_LENGTH );
  const SHAPE_CREATOR_OFFSET_POSITIONS = [
    // Offsets used for initial position of shape, relative to bucket hole center.  Empirically determined.
    new Vector2( -20 - UNIT_SQUARE_LENGTH / 2, 0 - UNIT_SQUARE_LENGTH / 2 ),
    new Vector2( -10 - UNIT_SQUARE_LENGTH / 2, -2 - UNIT_SQUARE_LENGTH / 2 ),
    new Vector2( 9 - UNIT_SQUARE_LENGTH / 2, 1 - UNIT_SQUARE_LENGTH / 2 ),
    new Vector2( 18 - UNIT_SQUARE_LENGTH / 2, 3 - UNIT_SQUARE_LENGTH / 2 ),
    new Vector2( 3 - UNIT_SQUARE_LENGTH / 2, 5 - UNIT_SQUARE_LENGTH / 2 )
  ];

  /**
   * @param {ShapePlacementBoard} shapePlacementBoard
   * @param {function} addShapeToModel - Function for adding a newly created shape to the model.
   * @param {ObservableArray} movableShapeList - The array that tracks the movable shapes.
   * @param {Bucket} bucket - Model of the bucket that is to be portrayed
   * @param {Object} options
   * @constructor
   */
  function ExploreNode( shapePlacementBoard, addShapeToModel, movableShapeList, bucket, options ) {

    options = _.extend( {

      // drag bounds for the shapes that can go on the board
      shapeDragBounds: Bounds2.EVERYTHING,

      // An optional layer (scenery node) on which movable shapes will be placed.  Passing it in allows it to be
      // created outside this node, which supports some layering which is otherwise not possible.
      shapesLayer: null

    }, options );

    // Verify that the shape placement board is set up to handle a specific color, rather than all colors, since other
    // code below depends on this.
    assert && assert( shapePlacementBoard.colorHandled !== '*' );
    const shapeColor = Color.toColor( shapePlacementBoard.colorHandled );

    Node.call( this );

    // Create the nodes that will be used to layer things visually.
    const backLayer = new Node();
    this.addChild( backLayer );
    let movableShapesLayer;
    if ( !options.shapesLayer ) {
      movableShapesLayer = new Node( { layerSplit: true } ); // Force the moving shape into a separate layer for performance reasons.
      this.addChild( movableShapesLayer );
    }
    else {
      // Assume that this layer was added to the scene graph elsewhere, and doesn't need to be added here.
      movableShapesLayer = options.shapesLayer;
    }
    const bucketFrontLayer = new Node();
    this.addChild( bucketFrontLayer );
    const singleBoardControlsLayer = new Node();
    this.addChild( singleBoardControlsLayer );

    // Add the node that represents the shape placement board.  This is positioned based on this model location, and
    // all other nodes (such as the bucket) are positioned relative to this.
    const shapePlacementBoardNode = new ShapePlacementBoardNode( shapePlacementBoard );
    backLayer.addChild( shapePlacementBoardNode );

    // Add the area and perimeter display
    this.areaAndPerimeterDisplay = new AreaAndPerimeterDisplay(
      shapePlacementBoard.areaAndPerimeterProperty,
      shapeColor,
      shapeColor.colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR ),
      {
        centerX: shapePlacementBoardNode.centerX,
        bottom: shapePlacementBoardNode.top - SPACE_AROUND_SHAPE_PLACEMENT_BOARD
      }
    );
    this.addChild( this.areaAndPerimeterDisplay );

    // Add the bucket view elements
    const bucketFront = new BucketFront( bucket, IDENTITY_TRANSFORM );
    bucketFrontLayer.addChild( bucketFront );
    const bucketHole = new BucketHole( bucket, IDENTITY_TRANSFORM );
    backLayer.addChild( bucketHole );

    // Add the shape creator nodes.  These must be added after the bucket hole for proper layering.
    SHAPE_CREATOR_OFFSET_POSITIONS.forEach( function( offset ) {
      backLayer.addChild( new ShapeCreatorNode( UNIT_RECTANGLE_SHAPE, shapeColor, addShapeToModel, {
        left: bucketHole.centerX + offset.x,
        top: bucketHole.centerY + offset.y,
        shapeDragBounds: options.shapeDragBounds
      } ) );
    } );

    // Add the button that allows the board to be cleared of all shapes.
    this.addChild( new EraserButton( {
      right: bucketFront.right - 3,
      top: bucketFront.bottom + 5,
      touchAreaXDilation: 5,
      touchAreaYDilation: 5,
      listener: function() { shapePlacementBoard.releaseAllShapes( 'fade' ); }
    } ) );

    // Handle the comings and goings of movable shapes.
    movableShapeList.addItemAddedListener( function( addedShape ) {

      if ( addedShape.color.equals( shapeColor ) ) {

        // Create and add the view representation for this shape.
        const shapeNode = new ShapeNode( addedShape, options.shapeDragBounds );
        movableShapesLayer.addChild( shapeNode );

        // Move the shape to the front of this layer when grabbed by the user.
        addedShape.userControlledProperty.link( function( userControlled ) {
          if ( userControlled ) {
            shapeNode.moveToFront();
          }
        } );

        // Add the removal listener for if and when this shape is removed from the model.
        movableShapeList.addItemRemovedListener( function removalListener( removedShape ) {
          if ( removedShape === addedShape ) {
            movableShapesLayer.removeChild( shapeNode );
            movableShapeList.removeItemRemovedListener( removalListener );
          }
        } );
      }
    } );
  }

  areaBuilder.register( 'ExploreNode', ExploreNode );

  return inherit( Node, ExploreNode, {
    reset: function() {
      this.areaAndPerimeterDisplay.reset();
    }
  } );
} );