// Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Explore' screen of the Area simulation.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ShapePlacementBoardNode = require( 'AREA/common/view/ShapePlacementBoardNode' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {AreaExplorationModel} model
   * @constructor
   */
  function AreaExplorationView( model ) {

    var thisScreen = this;
    ScreenView.call( thisScreen );

    this.addChild( new ShapePlacementBoardNode( model.leftShapePlacementBoard ) );

    // TODO: temp - add a couple of rectangles for visual reference.  These will eventually become the 'work areas'.
//    var leftRect = new Rectangle( 0, 0, this.layoutBounds.width * 0.45, this.layoutBounds.height * 0.6, 0, 0, {
//      fill: 'white',
//      stroke: 'black'
//    } );
//    this.addChild( leftRect );
//    var rightRect = new Rectangle( 0, 0, this.layoutBounds.width * 0.45, this.layoutBounds.height * 0.6, 0, 0, {
//      fill: 'white',
//      stroke: 'black'
//    } );
//    this.addChild( rightRect );
//    leftRect.top = 40;
//    leftRect.left = 30;
//    rightRect.top = leftRect.top;
//    rightRect.right = this.layoutBounds.width - 30;
  }

  return inherit( ScreenView, AreaExplorationView );
} );
