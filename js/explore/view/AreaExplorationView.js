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
  var Checkbox = require( 'SUN/Checkbox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Grid = require( 'AREA/common/view/Grid' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Panel = require( 'SUN/Panel' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ShapePlacementBoardNode = require( 'AREA/common/view/ShapePlacementBoardNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {AreaExplorationModel} model
   * @constructor
   */
  function AreaExplorationView( model ) {

    var thisScreen = this;
    ScreenView.call( thisScreen );

    // Add the shape placement boards
    this.addChild( new ShapePlacementBoardNode( model.leftShapePlacementBoard ) );

    // Create and add the control panel
    var controlPanel = new Panel(
      new VBox( {
        children: [
          new Checkbox( new Grid( new Dimension2( 40, 40 ), 10, { stroke: 'black' } ), model.showGrids )
        ]
      } )
    );
    this.addChild( controlPanel );
  }

  return inherit( ScreenView, AreaExplorationView );
} );
