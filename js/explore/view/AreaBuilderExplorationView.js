// Copyright 2002-2014, University of Colorado Boulder

//REVIEW type name doesn't correspond to screen, rename AreaBuilderExploreView
/**
 * View for the 'Explore' screen of the Area Builder simulation.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderGameControlPanel = require( 'AREA_BUILDER/game/view/AreaBuilderGameControlPanel' );
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var BoardDisplayModePanel = require( 'AREA_BUILDER/explore/view/BoardDisplayModePanel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ExploreNode = require( 'AREA_BUILDER/explore/view/ExploreNode' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );

  // constants
  var CONTROL_INSET = 15;
  var SPACE_AROUND_SHAPE_PLACEMENT_BOARD = 15;

  /**
   * @param {AreaBuilderExplorationModel} model
   * @constructor
   */
  function AreaBuilderExplorationView( model ) {

    ScreenView.call( this, { renderer: 'svg', layoutBounds: AreaBuilderSharedConstants.LAYOUT_BOUNDS } );

    // Create the composite nodes that contain the shape placement board, the readout, the bucket, the shape creator
    // nodes, and the eraser button.
    var centerExploreNode = new ExploreNode( model.centerShapePlacementBoard, model.addUserCreatedMovableShape.bind( model ),
      model.movableShapes, model.centerBucket );
    this.addChild( centerExploreNode );
    var leftExploreNode = new ExploreNode( model.leftShapePlacementBoard, model.addUserCreatedMovableShape.bind( model ),
      model.movableShapes, model.leftBucket );
    this.addChild( leftExploreNode );
    var rightExploreNode = new ExploreNode( model.rightShapePlacementBoard, model.addUserCreatedMovableShape.bind( model ),
      model.movableShapes, model.rightBucket );
    this.addChild( rightExploreNode );

    // Control which board(s), bucket(s), and shapes are visible.
    model.boardDisplayModeProperty.link( function( boardDisplayMode ) {
      centerExploreNode.visible = boardDisplayMode === 'single';
      leftExploreNode.visible = boardDisplayMode === 'dual';
      rightExploreNode.visible = boardDisplayMode === 'dual';
    } );

    // Create and add the panel that contains the ABSwitch.
    var switchPanel = new BoardDisplayModePanel( model.boardDisplayModeProperty );
    this.addChild( switchPanel );

    // Create and add the common control panel.
    var controlPanel = new AreaBuilderGameControlPanel( model.showGridsProperty, model.showDimensionsProperty );
    this.addChild( controlPanel );

    // Add the reset button.
    this.addChild( new ResetAllButton( {
      radius: 20,
      right: this.layoutBounds.width - CONTROL_INSET,
      bottom: this.layoutBounds.height - CONTROL_INSET,
      lineWidth: 1,
      listener: function() {
        centerExploreNode.reset();
        leftExploreNode.reset();
        rightExploreNode.reset();
        model.reset();
      }
    } ) );

    // Perform final layout adjustments
    var centerBoardBounds = model.centerShapePlacementBoard.bounds;
    controlPanel.top = centerBoardBounds.maxY + SPACE_AROUND_SHAPE_PLACEMENT_BOARD;
    controlPanel.left = centerBoardBounds.minX;
    switchPanel.top = centerBoardBounds.maxY + SPACE_AROUND_SHAPE_PLACEMENT_BOARD;
    switchPanel.right = centerBoardBounds.maxX;
  }

  return inherit( ScreenView, AreaBuilderExplorationView );
} );