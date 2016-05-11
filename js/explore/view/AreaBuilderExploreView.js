// Copyright 2014-2015, University of Colorado Boulder

/**
 * View for the 'Explore' screen of the Area Builder simulation.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var areaBuilder = require( 'AREA_BUILDER/areaBuilder' );
  var AreaBuilderControlPanel = require( 'AREA_BUILDER/common/view/AreaBuilderControlPanel' );
  var AreaBuilderQueryParameters = require( 'AREA_BUILDER/common/AreaBuilderQueryParameters' );
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var BoardDisplayModePanel = require( 'AREA_BUILDER/explore/view/BoardDisplayModePanel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ExploreNode = require( 'AREA_BUILDER/explore/view/ExploreNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );

  // constants
  var SPACE_AROUND_SHAPE_PLACEMENT_BOARD = 15;

  /**
   * @param {AreaBuilderExploreModel} model
   * @constructor
   */
  function AreaBuilderExploreView( model ) {

    ScreenView.call( this, { layoutBounds: AreaBuilderSharedConstants.LAYOUT_BOUNDS } );

    // Create the layers where the shapes will be placed.  The shapes are maintained in separate layers so that they
    // are over all of the shape placement boards in the z-order.
    var movableShapesLayer = new Node( { layerSplit: true } ); // Force the moving shape into a separate layer for improved performance.
    var singleBoardShapesLayer = new Node();
    movableShapesLayer.addChild( singleBoardShapesLayer );
    var dualBoardShapesLayer = new Node();
    movableShapesLayer.addChild( dualBoardShapesLayer );

    // Create the composite nodes that contain the shape placement board, the readout, the bucket, the shape creator
    // nodes, and the eraser button.
    var centerExploreNode = new ExploreNode( model.singleShapePlacementBoard, model.addUserCreatedMovableShape.bind( model ),
      model.movableShapes, model.singleModeBucket, { shapesLayer: singleBoardShapesLayer, shapeDragBounds: this.layoutBounds } );
    this.addChild( centerExploreNode );
    var leftExploreNode = new ExploreNode( model.leftShapePlacementBoard, model.addUserCreatedMovableShape.bind( model ),
      model.movableShapes, model.leftBucket, { shapesLayer: dualBoardShapesLayer, shapeDragBounds: this.layoutBounds  } );
    this.addChild( leftExploreNode );
    var rightExploreNode = new ExploreNode( model.rightShapePlacementBoard, model.addUserCreatedMovableShape.bind( model ),
      model.movableShapes, model.rightBucket, { shapesLayer: dualBoardShapesLayer, shapeDragBounds: this.layoutBounds  } );
    this.addChild( rightExploreNode );

    // Control which board(s), bucket(s), and shapes are visible.
    model.boardDisplayModeProperty.link( function( boardDisplayMode ) {
      centerExploreNode.visible = boardDisplayMode === 'single';
      singleBoardShapesLayer.pickable = boardDisplayMode === 'single';
      leftExploreNode.visible = boardDisplayMode === 'dual';
      rightExploreNode.visible = boardDisplayMode === 'dual';
      dualBoardShapesLayer.pickable = boardDisplayMode === 'dual';
    } );

    // Create and add the panel that contains the ABSwitch.
    var switchPanel = new BoardDisplayModePanel( model.boardDisplayModeProperty );
    this.addChild( switchPanel );

    // Create and add the common control panel.
    var controlPanel = new AreaBuilderControlPanel( model.showShapeBoardGridsProperty, model.showDimensionsProperty );
    this.addChild( controlPanel );

    // Add the reset button.
    this.addChild( new ResetAllButton( {
      radius: 20,
      right: this.layoutBounds.width - 15,
      bottom: this.layoutBounds.height - 15,
      lineWidth: 1,
      listener: function() {
        centerExploreNode.reset();
        leftExploreNode.reset();
        rightExploreNode.reset();
        model.reset();
      },
      touchAreaDilation: 7
    } ) );

    // Add the layers where the movable shapes reside.
    this.addChild( movableShapesLayer );

    // Perform final layout adjustments
    var centerBoardBounds = model.singleShapePlacementBoard.bounds;
    controlPanel.top = centerBoardBounds.maxY + SPACE_AROUND_SHAPE_PLACEMENT_BOARD;
    controlPanel.left = centerBoardBounds.minX;
    switchPanel.top = centerBoardBounds.maxY + SPACE_AROUND_SHAPE_PLACEMENT_BOARD;
    switchPanel.right = centerBoardBounds.maxX;

    // If the appropriate query parameter is set, fill the boards.  This is useful for debugging.
    if ( AreaBuilderQueryParameters.PREFILL_BOARDS ){
      model.fillBoards();
    }
  }

  areaBuilder.register( 'AreaBuilderExploreView', AreaBuilderExploreView );

  return inherit( ScreenView, AreaBuilderExploreView );
} );