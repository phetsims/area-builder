// Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Explore' screen of the Area simulation.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // moduls
  var ABSwitch = require( 'SUN/ABSwitch' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Checkbox = require( 'SUN/Checkbox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Grid = require( 'AREA/common/view/Grid' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ShapePlacementBoardNode = require( 'AREA/common/view/ShapePlacementBoardNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var CONTROL_INSET = 20;

  /**
   * @param {AreaExplorationModel} model
   * @constructor
   */
  function AreaExplorationView( model ) {

    var thisScreen = this;
    ScreenView.call( thisScreen );

    // Add the shape placement boards
    this.addChild( new ShapePlacementBoardNode( model.leftShapePlacementBoard ) );
    this.addChild( new ShapePlacementBoardNode( model.rightShapePlacementBoard ) );

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

    // Create and add the control panel
    var controlPanel = new Panel(
      new VBox( {
        children: [
          new ABSwitch( model.showBothBoards, true, twoRectIcon, false, oneRectIcon, { switchSize: new Dimension2( 30, 15 ) } ),
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

  return inherit( ScreenView, AreaExplorationView );
} );
