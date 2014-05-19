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
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var BucketFront = require( 'SCENERY_PHET/bucket/BucketFront' );
  var BucketHole = require( 'SCENERY_PHET/bucket/BucketHole' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Checkbox = require( 'SUN/Checkbox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Grid = require( 'AREA_BUILDER/common/view/Grid' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ShapePlacementBoardNode = require( 'AREA_BUILDER/common/view/ShapePlacementBoardNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );
  var ShapeView = require( 'AREA_BUILDER/common/view/ShapeView' );

  // constants
  var CONTROL_INSET = 20;

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

    // Create the nodes needed for the required layering
    var backLayer = new Node();
    this.addChild( backLayer );
    var shapeLayer = new Node();
    this.addChild( shapeLayer );
    var bucketFrontLayer = new Node();
    this.addChild( bucketFrontLayer );

    // Add the shape placement boards
    var leftBoardNode = new ShapePlacementBoardNode( model.leftShapePlacementBoard );
    backLayer.addChild( leftBoardNode );
    var rightBoardNode = new ShapePlacementBoardNode( model.rightShapePlacementBoard );
    backLayer.addChild( rightBoardNode );
    var centerBoardNode = new ShapePlacementBoardNode( model.centerShapePlacementBoard );
    backLayer.addChild( centerBoardNode );

    // Add the bucket views
    var invertIdentityTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping( Vector2.ZERO, Vector2.ZERO, 1 );
    var leftBucketFront = new BucketFront( model.leftBucket, invertIdentityTransform );
    bucketFrontLayer.addChild( leftBucketFront );
    var leftBucketHole = new BucketHole( model.leftBucket, invertIdentityTransform );
    backLayer.addChild( leftBucketHole );
    var rightBucketFront = new BucketFront( model.rightBucket, invertIdentityTransform );
    bucketFrontLayer.addChild( rightBucketFront );
    var rightBucketHole = new BucketHole( model.rightBucket, invertIdentityTransform );
    backLayer.addChild( rightBucketHole );
    var centerBucketFront = new BucketFront( model.centerBucket, invertIdentityTransform );
    bucketFrontLayer.addChild( centerBucketFront );
    var centerBucketHole = new BucketHole( model.centerBucket, invertIdentityTransform );
    backLayer.addChild( centerBucketHole );

    // Create a function for handling the addition of new shapes to the model
    function handleShapeAdded( addedShape ) {

      // Create and add the view representation for this shape.
      var shapeNode = new ShapeView( addedShape );
      shapeLayer.addChild( shapeNode );

      // Move the shape to the front when grabbed by the user.
      addedShape.userControlledProperty.link( function( userControlled ) {
        if ( userControlled ) {
          shapeNode.moveToFront();
        }
      } );

      // Add the removal listener for if and when this shape is removed from the model.
      model.movableShapes.addItemRemovedListener( function removalListener( removedShape ) {
        if ( removedShape === addedShape ) {
          shapesLayer.removeChild( shapeNode );
          model.movableShapeList.removeItemRemovedListener( removalListener );
        }
      } );
    }

    // Add the initial movable shapes.
    model.movableShapes.forEach( handleShapeAdded );

    // Handle shapes that are added after initialization.
    model.movableShapes.addItemAddedListener( handleShapeAdded );

    // Control which board(s), bucket(s), and shapes are visible.
    model.boardDisplayMode.link( function( boardDisplayMode ) {
      rightBoardNode.visible = boardDisplayMode === 'dual';
      leftBoardNode.visible = boardDisplayMode === 'dual';
      centerBoardNode.visible = boardDisplayMode === 'single';
      leftBucketFront.visible = boardDisplayMode === 'dual';
      leftBucketHole.visible = boardDisplayMode === 'dual';
      rightBucketFront.visible = boardDisplayMode === 'dual';
      rightBucketHole.visible = boardDisplayMode === 'dual';
      centerBucketFront.visible = boardDisplayMode === 'single';
      centerBucketHole.visible = boardDisplayMode === 'single';
      shapeLayer.children.forEach( function( shapeNode ) {
        // TODO: This works, but I'm not crazy about the idea of mapping
        // TODO: color to visibility - it seems indirect and brittle.  Keep
        // TODO: thinking about this and maybe replace with something better.
        assert && assert( shapeNode instanceof ShapeView, 'Only shapes should be on the shape layer' );
        shapeNode.visible = ( boardDisplayMode === MAP_COLORS_TO_MODES[ shapeNode.shapeModel.color ] );
      } );
    } );

    // Create and add the control panel
    // TODO: These icons are temporary until we work some things out.
    var twoRectIcon = new Node();
    var iconRectOptions = { fill: 'white', stroke: 'black' };
    twoRectIcon.addChild( new Rectangle( 0, 0, 24, 24, 0, 0, iconRectOptions ) );
    twoRectIcon.addChild( new Rectangle( 26, 0, 24, 24, 0, 0, iconRectOptions ) );
    twoRectIcon.addChild( new Rectangle( 6, 6, 6, 6, 0, 0, { fill: '#34E16E', stroke: 'green' } ) );
    twoRectIcon.addChild( new Rectangle( 12, 6, 6, 6, 0, 0, { fill: '#34E16E', stroke: 'green' } ) );
    twoRectIcon.addChild( new Rectangle( 6, 12, 6, 6, 0, 0, { fill: '#34E16E', stroke: 'green' } ) );
    twoRectIcon.addChild( new Rectangle( 32, 6, 6, 6, 0, 0, { fill: '#E0B7E1', stroke: 'purple' } ) );
    twoRectIcon.addChild( new Rectangle( 38, 12, 6, 6, 0, 0, { fill: '#E0B7E1', stroke: 'purple' } ) );
    var oneRectIcon = new Rectangle( 0, 0, 24, 24, 0, 0, iconRectOptions );
    oneRectIcon.addChild( new Rectangle( 6, 6, 6, 6, 0, 0, { fill: '#34E16E', stroke: 'green' } ) );
    oneRectIcon.addChild( new Rectangle( 12, 6, 6, 6, 0, 0, { fill: '#34E16E', stroke: 'green' } ) );
    oneRectIcon.addChild( new Rectangle( 6, 12, 6, 6, 0, 0, { fill: '#34E16E', stroke: 'green' } ) );

    var controlPanel = new Panel(
      new VBox( {
        children: [
          new ABSwitch( model.boardDisplayMode, 'single', oneRectIcon, 'dual', twoRectIcon, { switchSize: new Dimension2( 30, 15 ) } ),
          new Checkbox( new Grid( new Dimension2( 40, 40 ), 10, { stroke: '#808080', lineDash: [ 2, 3 ] } ), model.showGrids )
        ],
        align: 'left',
        spacing: 10
      } ), { fill: 'rgb( 255, 242, 234 )'}
    );
    this.addChild( controlPanel );

    // Layout
    controlPanel.bottom = this.layoutBounds.height - CONTROL_INSET;
    controlPanel.left = CONTROL_INSET;
  }

  return inherit( ScreenView, AreaBuilderExplorationView );
} );
