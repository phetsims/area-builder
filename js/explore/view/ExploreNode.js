// Copyright 2002-2014, University of Colorado Boulder

/**
 * A composite node that depicts a shape placement board, a bucket containing shapes to go on the board, an area and
 * perimeter readout, and an erase button.  These are consolidated together in this node to avoid code duplication.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaAndPerimeterDisplay = require( 'AREA_BUILDER/explore/view/AreaAndPerimeterDisplay' );
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var BucketFront = require( 'SCENERY_PHET/bucket/BucketFront' );
  var BucketHole = require( 'SCENERY_PHET/bucket/BucketHole' );
  var Color = require( 'SCENERY/util/Color' );
  var EraserButton = require( 'AREA_BUILDER/common/view/EraserButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var ShapeCreatorNode = require( 'AREA_BUILDER/common/view/ShapeCreatorNode' );
  var ShapePlacementBoardNode = require( 'AREA_BUILDER/common/view/ShapePlacementBoardNode' );
  var ShapeNode = require( 'AREA_BUILDER/common/view/ShapeNode' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var SPACE_AROUND_SHAPE_PLACEMENT_BOARD = 15;
  var IDENTITY_TRANSFORM = ModelViewTransform2.createIdentity();
  var UNIT_SQUARE_LENGTH = AreaBuilderSharedConstants.UNIT_SQUARE_LENGTH;
  var UNIT_RECTANGLE_SHAPE = new Shape.rect( 0, 0, UNIT_SQUARE_LENGTH, UNIT_SQUARE_LENGTH );
  var SHAPE_CREATOR_OFFSET_POSITIONS = [
    // Offsets used for initial position of shape, relative to bucket hole center.  Empirically determined.
    new Vector2( -20 - UNIT_SQUARE_LENGTH / 2, 0 - UNIT_SQUARE_LENGTH / 2 ),
    new Vector2( -10 - UNIT_SQUARE_LENGTH / 2, -2 - UNIT_SQUARE_LENGTH / 2 ),
    new Vector2( 9 - UNIT_SQUARE_LENGTH / 2, 1 - UNIT_SQUARE_LENGTH / 2 ),
    new Vector2( 18 - UNIT_SQUARE_LENGTH / 2, 3 - UNIT_SQUARE_LENGTH / 2 ),
    new Vector2( 3 - UNIT_SQUARE_LENGTH / 2, 5 - UNIT_SQUARE_LENGTH / 2 )
  ];

  /**
   * @param {ShapePlacementBoard} shapePlacementBoard
   * @param {Function} addShapeToModel - Function for adding a newly created shape to the model.
   * @param {ObservableArray} movableShapeList - The array that tracks the movable shapes.
   * @param {Bucket} bucket - Model of the bucket that is to be portrayed
   * @constructor
   */
  function ExploreNode( shapePlacementBoard, addShapeToModel, movableShapeList, bucket ) {

    // Verify that the shape placement board is set up to handle a specific color, rather than all colors, since other
    // code below depends on this.
    assert && assert( shapePlacementBoard.colorHandled !== '*' );
    var shapeColor = Color.toColor( shapePlacementBoard.colorHandled );

    Node.call( this );

    // Create the nodes that will be used to layer things visually.
    var backLayer = new Node();
    this.addChild( backLayer );
    var movableShapesLayer = new Node( { layerSplit: true } ); // Force the moving shape into a separate layer for performance reasons.
    this.addChild( movableShapesLayer );
    var bucketFrontLayer = new Node();
    this.addChild( bucketFrontLayer );
    var singleBoardControlsLayer = new Node();
    this.addChild( singleBoardControlsLayer );

    // Add the node that represents the shape placement board.  This is positioned based on this model location, and
    // all other nodes (such as the bucket) are positioned relative to this.
    var shapePlacementBoardNode = new ShapePlacementBoardNode( shapePlacementBoard );
    backLayer.addChild( shapePlacementBoardNode );

    // Add the area and perimeter display
    this.areaAndPerimeterDisplay = new AreaAndPerimeterDisplay(
      shapePlacementBoard.areaProperty,
      shapeColor,
      shapePlacementBoard.perimeterProperty,
      shapeColor.colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR ),
      { centerX: shapePlacementBoardNode.centerX, bottom: shapePlacementBoardNode.top - SPACE_AROUND_SHAPE_PLACEMENT_BOARD }
    );
    this.addChild( this.areaAndPerimeterDisplay );

    // Add the bucket view elements
    var bucketFront = new BucketFront( bucket, IDENTITY_TRANSFORM );
    bucketFrontLayer.addChild( bucketFront );
    var bucketHole = new BucketHole( bucket, IDENTITY_TRANSFORM );
    backLayer.addChild( bucketHole );

    // Add the shape creator nodes.  These must be added after the bucket hole for proper layering.
    SHAPE_CREATOR_OFFSET_POSITIONS.forEach( function( offset ) {
      backLayer.addChild( new ShapeCreatorNode( UNIT_RECTANGLE_SHAPE, shapeColor,
        addShapeToModel, {
          left: bucketHole.centerX + offset.x,
          top: bucketHole.centerY + offset.y
        } ) );
    } );

    // Add the button that allows the board to be cleared of all shapes.
    this.addChild( new EraserButton( {
      right: bucketFront.right - 3,
      top: bucketFront.bottom + 5,
      listener: function() { shapePlacementBoard.releaseAllShapes( 'fade' ); }
    } ) );

    // Handle the comings and goings of movable shapes.
    movableShapeList.addItemAddedListener( function( addedShape ) {

      if ( addedShape.color.equals( shapeColor ) ) {

        // Create and add the view representation for this shape.
        var shapeNode = new ShapeNode( addedShape );
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

  return inherit( Node, ExploreNode, {
    reset: function() {
      this.areaAndPerimeterDisplay.reset();
    }
  } );
} );