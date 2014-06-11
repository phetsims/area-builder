// Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Explore' screen of the Area Builder simulation.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var ABSwitch = require( 'SUN/ABSwitch' );
  var AreaAndPerimeterDisplay = require( 'AREA_BUILDER/explore/view/AreaAndPerimeterDisplay' );
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var BucketFront = require( 'SCENERY_PHET/bucket/BucketFront' );
  var BucketHole = require( 'SCENERY_PHET/bucket/BucketHole' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Checkbox = require( 'SUN/Checkbox' );
  var Color = require( 'SCENERY/util/Color' );
  var CompositeShapeNode = require( 'AREA_BUILDER/common/view/CompositeShapeNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var EraserButton = require( 'AREA_BUILDER/common/view/EraserButton' );
  var Grid = require( 'AREA_BUILDER/common/view/Grid' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PaperAirplaneNode = require( 'AREA_BUILDER/common/view/PaperAirplaneNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangleCreatorNode = require( 'AREA_BUILDER/explore/view/RectangleCreatorNode' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ShapePlacementBoardNode = require( 'AREA_BUILDER/common/view/ShapePlacementBoardNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );
  var ShapeView = require( 'AREA_BUILDER/common/view/ShapeView' );

  // constants
  var CONTROL_INSET = 15;

  // Map of colors used for the shapes to the mode where those shapes are visible
  var MAP_COLORS_TO_MODES = {};
  MAP_COLORS_TO_MODES[ AreaBuilderSharedConstants.GREENISH_COLOR ] = 'dual';
  MAP_COLORS_TO_MODES[ AreaBuilderSharedConstants.PURPLISH_COLOR ] = 'dual';
  MAP_COLORS_TO_MODES[ AreaBuilderSharedConstants.ORANGISH_COLOR ] = 'single';

  /**
   * @param {AreaBuilderExplorationModel} model
   * @constructor
   */
  function AreaBuilderExplorationView( model ) {

    var thisScreen = this;
    ScreenView.call( thisScreen );

    // TODO: There is a lot of opportunity for consolidation below.

    // Create the nodes needed for the required layering
    var backLayer = new Node();
    this.addChild( backLayer );
    var creatorLayer = new Node();
    this.addChild( creatorLayer );
    var bucketFrontLayer = new Node();
    this.addChild( bucketFrontLayer );
    var compositeShapesLayer = new Node();
    this.addChild( compositeShapesLayer );
    var movableShapesLayer = new Node();
    this.addChild( movableShapesLayer );
    var topControlsLayer = new Node();
    this.addChild( topControlsLayer );

    // Add the shape placement boards
    var leftBoardNode = new ShapePlacementBoardNode( model.leftShapePlacementBoard );
    backLayer.addChild( leftBoardNode );
    var rightBoardNode = new ShapePlacementBoardNode( model.rightShapePlacementBoard );
    backLayer.addChild( rightBoardNode );
    var centerBoardNode = new ShapePlacementBoardNode( model.centerShapePlacementBoard );
    backLayer.addChild( centerBoardNode );

    // Add the clear buttons TODO: add undo button.
    var leftBoardClearButton = new EraserButton( {
      left: leftBoardNode.left + 3,
      bottom: leftBoardNode.bottom - 5,
      listener: function() { model.leftShapePlacementBoard.releaseAllShapes( true ); }
    } );
    topControlsLayer.addChild( leftBoardClearButton );
    var rightBoardClearButton = new EraserButton( {
      right: rightBoardNode.right - 3,
      bottom: rightBoardNode.bottom - 5,
      listener: function() { model.rightShapePlacementBoard.releaseAllShapes( true ); }
    } );
    topControlsLayer.addChild( rightBoardClearButton );
    var centerBoardClearButton = new EraserButton( {
      left: centerBoardNode.left + 3,
      bottom: centerBoardNode.bottom - 5,
      listener: function() { model.centerShapePlacementBoard.releaseAllShapes( true ); }
    } );
    topControlsLayer.addChild( centerBoardClearButton );

    // Add the composite shapes, i.e. the ones that aggregate what the user
    // has added as individual shapes.
    var centerCompositeShape = new CompositeShapeNode(
      model.centerShapePlacementBoard.exteriorPerimetersProperty,
      model.centerShapePlacementBoard.interiorPerimetersProperty,
      model.unitSquareLength,
      model.centerShapePlacementBoard.colorHandled );
    compositeShapesLayer.addChild( centerCompositeShape );
    var leftCompositeShape = new CompositeShapeNode(
      model.leftShapePlacementBoard.exteriorPerimetersProperty,
      model.leftShapePlacementBoard.interiorPerimetersProperty,
      model.unitSquareLength,
      model.leftShapePlacementBoard.colorHandled );
    compositeShapesLayer.addChild( leftCompositeShape );
    var rightCompositeShape = new CompositeShapeNode(
      model.rightShapePlacementBoard.exteriorPerimetersProperty,
      model.rightShapePlacementBoard.interiorPerimetersProperty,
      model.unitSquareLength,
      model.rightShapePlacementBoard.colorHandled );
    compositeShapesLayer.addChild( rightCompositeShape );

    // Add the area and perimeter displays
    var leftAreaAndPerimeterDisplay = new AreaAndPerimeterDisplay( model.leftShapePlacementBoard.areaProperty,
      AreaBuilderSharedConstants.GREENISH_COLOR, model.leftShapePlacementBoard.perimeterProperty,
      Color.toColor( AreaBuilderSharedConstants.GREENISH_COLOR ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR ),
      { centerX: leftBoardNode.centerX, bottom: leftBoardNode.top - 8 } );
    backLayer.addChild( leftAreaAndPerimeterDisplay );
    var rightAreaAndPerimeterDisplay = new AreaAndPerimeterDisplay( model.rightShapePlacementBoard.areaProperty,
      AreaBuilderSharedConstants.PURPLISH_COLOR, model.rightShapePlacementBoard.perimeterProperty,
      Color.toColor( AreaBuilderSharedConstants.PURPLISH_COLOR ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR ),
      { centerX: rightBoardNode.centerX, bottom: rightBoardNode.top - 8 } );
    backLayer.addChild( rightAreaAndPerimeterDisplay );
    var centerAreaAndPerimeterDisplay = new AreaAndPerimeterDisplay( model.centerShapePlacementBoard.areaProperty,
      AreaBuilderSharedConstants.ORANGISH_COLOR, model.centerShapePlacementBoard.perimeterProperty,
      Color.toColor( AreaBuilderSharedConstants.ORANGISH_COLOR ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR ),
      { centerX: centerBoardNode.centerX, bottom: centerBoardNode.top - 8 } );
    backLayer.addChild( centerAreaAndPerimeterDisplay );

    // Add the bucket views
    var invertIdentityTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping( Vector2.ZERO, Vector2.ZERO, 1 );
    var leftBucketFront = new BucketFront( model.leftBucket, invertIdentityTransform );
    leftBucketFront.addChild( new PaperAirplaneNode( { right: leftBucketFront.width * 0.35, top: leftBucketFront.height * 0.3 } ) );
    bucketFrontLayer.addChild( leftBucketFront );
    var leftBucketHole = new BucketHole( model.leftBucket, invertIdentityTransform );
    backLayer.addChild( leftBucketHole );
    var rightBucketFront = new BucketFront( model.rightBucket, invertIdentityTransform );
    rightBucketFront.addChild( new PaperAirplaneNode( { right: rightBucketFront.width * 0.35, top: rightBucketFront.height * 0.3 } ) );
    bucketFrontLayer.addChild( rightBucketFront );
    var rightBucketHole = new BucketHole( model.rightBucket, invertIdentityTransform );
    backLayer.addChild( rightBucketHole );
    var centerBucketFront = new BucketFront( model.centerBucket, invertIdentityTransform );
    centerBucketFront.addChild( new PaperAirplaneNode( { right: centerBucketFront.width * 0.35, top: centerBucketFront.height * 0.3 } ) );
    bucketFrontLayer.addChild( centerBucketFront );
    var centerBucketHole = new BucketHole( model.centerBucket, invertIdentityTransform );
    backLayer.addChild( centerBucketHole );

    // Add the creator nodes.
    model.rectangleCreators.forEach( function( rectangleCreator ) {
      creatorLayer.addChild( new RectangleCreatorNode( rectangleCreator ) );
    } );

    // Handle the comings and goings of movable shapes.
    model.movableShapes.addItemAddedListener( function( addedShape ) {
      // Create and add the view representation for this shape.
      var shapeNode = new ShapeView( addedShape );
      movableShapesLayer.addChild( shapeNode );

      // Move the shape to the front when grabbed by the user.
      addedShape.userControlledProperty.link( function( userControlled ) {
        if ( userControlled ) {
          shapeNode.moveToFront();
        }
      } );

      // Add the removal listener for if and when this shape is removed from the model.
      model.movableShapes.addItemRemovedListener( function removalListener( removedShape ) {
        if ( removedShape === addedShape ) {
          movableShapesLayer.removeChild( shapeNode );
          model.movableShapes.removeItemRemovedListener( removalListener );
        }
      } );
    } );

    // Control which board(s), bucket(s), and shapes are visible.
    model.boardDisplayMode.link( function( boardDisplayMode ) {
      leftBoardNode.visible = boardDisplayMode === 'dual';
      leftBoardClearButton.visible = boardDisplayMode === 'dual';
      leftAreaAndPerimeterDisplay.visible = leftBoardNode.visible;
      leftBucketFront.visible = boardDisplayMode === 'dual';
      leftBucketHole.visible = boardDisplayMode === 'dual';
      leftCompositeShape.visible = boardDisplayMode === 'dual';
      rightBoardNode.visible = boardDisplayMode === 'dual';
      rightBoardClearButton.visible = boardDisplayMode === 'dual';
      rightAreaAndPerimeterDisplay.visible = rightBoardNode.visible;
      rightBucketFront.visible = boardDisplayMode === 'dual';
      rightBucketHole.visible = boardDisplayMode === 'dual';
      rightCompositeShape.visible = boardDisplayMode === 'dual';
      centerBoardNode.visible = boardDisplayMode === 'single';
      centerBoardClearButton.visible = boardDisplayMode === 'single';
      centerAreaAndPerimeterDisplay.visible = centerBoardNode.visible;
      centerBucketFront.visible = boardDisplayMode === 'single';
      centerBucketHole.visible = boardDisplayMode === 'single';
      centerCompositeShape.visible = boardDisplayMode === 'single';
      movableShapesLayer.children.forEach( function( shapeNode ) {
        // TODO: This works, but I'm not crazy about the idea of mapping
        // TODO: color to visibility - it seems indirect and brittle.  Keep
        // TODO: thinking about this and maybe replace with something better.
        assert && assert( shapeNode instanceof ShapeView, 'Only shapes should be on the shape layer' );
        shapeNode.visible = ( boardDisplayMode === MAP_COLORS_TO_MODES[ shapeNode.color ] );
      } );
      creatorLayer.children.forEach( function( creatorNode ) {
        // TODO: Same deal as above vis a vis color.
        assert && assert( creatorNode instanceof RectangleCreatorNode, 'Only creator nodes should be on the creator node layer' );
        creatorNode.visible = ( boardDisplayMode === MAP_COLORS_TO_MODES[ creatorNode.color ] );
      } );
    } );

    // Create and add the control panel
    // TODO: These icons are temporary until we work some things out.
    var twoRectIcon = new Node();
    var iconRectOptions = { fill: 'white', stroke: 'black' };
    twoRectIcon.addChild( new Rectangle( 0, 0, 24, 24, 0, 0, iconRectOptions ) );
    twoRectIcon.addChild( new Rectangle( 26, 0, 24, 24, 0, 0, iconRectOptions ) );
    var greenFill = AreaBuilderSharedConstants.GREENISH_COLOR;
    var greenStroke = Color.toColor( greenFill ).darkerColor( 0.6 );
    twoRectIcon.addChild( new Rectangle( 6, 6, 6, 6, 0, 0, { fill: greenFill, stroke: greenStroke } ) );
    twoRectIcon.addChild( new Rectangle( 12, 6, 6, 6, 0, 0, { fill: greenFill, stroke: greenStroke } ) );
    twoRectIcon.addChild( new Rectangle( 12, 12, 6, 6, 0, 0, { fill: greenFill, stroke: greenStroke } ) );
    var purpleFill = AreaBuilderSharedConstants.PURPLISH_COLOR;
    var purpleStroke = Color.toColor( purpleFill ).darkerColor( 0.6 );
    twoRectIcon.addChild( new Rectangle( 32, 6, 6, 6, 0, 0, { fill: purpleFill, stroke: purpleStroke } ) );
    twoRectIcon.addChild( new Rectangle( 38, 6, 6, 6, 0, 0, { fill: purpleFill, stroke: purpleStroke } ) );
    twoRectIcon.addChild( new Rectangle( 32, 12, 6, 6, 0, 0, { fill: purpleFill, stroke: purpleStroke } ) );
    twoRectIcon.addChild( new Rectangle( 38, 12, 6, 6, 0, 0, { fill: purpleFill, stroke: purpleStroke } ) );
    var oneRectIcon = new Rectangle( 0, 0, 24, 24, 0, 0, iconRectOptions );
    var orangeFill = AreaBuilderSharedConstants.ORANGISH_COLOR;
    var orangeStroke = Color.toColor( orangeFill ).darkerColor( 0.6 );
    oneRectIcon.addChild( new Rectangle( 12, 6, 6, 6, 0, 0, { fill: orangeFill, stroke: orangeStroke } ) );
    oneRectIcon.addChild( new Rectangle( 6, 12, 6, 6, 0, 0, { fill: orangeFill, stroke: orangeStroke } ) );
    oneRectIcon.addChild( new Rectangle( 12, 12, 6, 6, 0, 0, { fill: orangeFill, stroke: orangeStroke } ) );

    var controlPanel = new Panel(
      new VBox( {
        children: [
          new ABSwitch( model.boardDisplayMode, 'single', oneRectIcon, 'dual', twoRectIcon, { switchSize: new Dimension2( 40, 20 ) } ),
          new Checkbox( new Grid( 0, 0, 40, 40, 10, { stroke: '#808080', lineDash: [ 1, 2 ] } ), model.showGrids, { spacing: 15 } )
        ],
        align: 'left',
        spacing: 10
      } ), { fill: 'rgb( 255, 242, 234 )'}
    );
    this.addChild( controlPanel );

    // Add the reset button.
    backLayer.addChild( new ResetAllButton( {
      radius: 22,
      right: this.layoutBounds.width - CONTROL_INSET,
      bottom: this.layoutBounds.height - CONTROL_INSET,
      lineWidth: 1,
      listener: function() { model.reset(); }
    } ) );

    // Layout
    controlPanel.bottom = this.layoutBounds.height - CONTROL_INSET;
    controlPanel.left = CONTROL_INSET;
  }

  return inherit( ScreenView, AreaBuilderExplorationView );
} );
