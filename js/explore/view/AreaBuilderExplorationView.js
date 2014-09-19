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
  var ABSwitch = require( 'SUN/ABSwitch' );
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Checkbox = require( 'SUN/Checkbox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var DimensionsIcon = require( 'AREA_BUILDER/common/view/DimensionsIcon' );
  var ExploreIcon = require( 'AREA_BUILDER/explore/view/ExploreIcon' );
  var ExploreNode = require( 'AREA_BUILDER/explore/view/ExploreNode' );
  var Grid = require( 'AREA_BUILDER/common/view/Grid' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Panel = require( 'SUN/Panel' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );

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

    //REVIEW move this into BoardDisplayModePanel, see issue #39
    // Create the icons used on the A-B switch
    var dualBoardIcon = new HBox( {
        children: [
          new ExploreIcon( AreaBuilderSharedConstants.GREENISH_COLOR, 6, [
            new Vector2( 0, 0 ),
            new Vector2( 1, 0 ),
            new Vector2( 1, 1 )
          ] ),
          new ExploreIcon( AreaBuilderSharedConstants.PURPLISH_COLOR, 6, [
            new Vector2( 0, 0 ),
            new Vector2( 0, 1 ),
            new Vector2( 1, 0 ),
            new Vector2( 1, 1 )
          ] )
        ],
        spacing: 3
      }
    );
    //REVIEW move this into BoardDisplayModePanel, see issue #39
    var singleBoardIcon = new ExploreIcon( AreaBuilderSharedConstants.ORANGISH_COLOR, 6, [
      new Vector2( 0, 1 ),
      new Vector2( 1, 0 ),
      new Vector2( 1, 1 )
    ] );

    //REVIEW move this into BoardDisplayModePanel, see issue #39
    // Create and add the panel that contains the ABSwitch.
    var switchPanel = new Panel(
      new VBox( {
        children: [
          new ABSwitch( model.boardDisplayModeProperty, 'single', singleBoardIcon, 'dual', dualBoardIcon, { switchSize: new Dimension2( 36, 18 ) } )
        ],
        spacing: 10
      } ), { fill: AreaBuilderSharedConstants.CONTROL_PANEL_BACKGROUND_COLOR }
    );
    this.addChild( switchPanel );

    // Create and add the common control panel.
    var controlPanel = new Panel(
      new VBox( {
        children: [
          new Checkbox( new Grid( new Bounds2( 0, 0, 40, 40 ), 10, { stroke: '#808080', lineDash: [ 1, 2 ] } ), model.showGridsProperty, { spacing: 15 } ),
          new Checkbox( new DimensionsIcon(), model.showDimensionsProperty, { spacing: 15 } )
        ],
        align: 'left',
        spacing: 10
      } ), { fill: AreaBuilderSharedConstants.CONTROL_PANEL_BACKGROUND_COLOR }
    );
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