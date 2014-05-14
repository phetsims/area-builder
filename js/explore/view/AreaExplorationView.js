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
  }

  return inherit( ScreenView, AreaExplorationView );
} );
