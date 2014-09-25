// Copyright 2002-2014, University of Colorado Boulder

/**
 * This file contains the code used to generate the screen icons that need to be produced in code in order to look half
 * decent.
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var GridIcon = require( 'AREA_BUILDER/common/view/GridIcon' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  var NAV_BAR_ICON_SIZE = new Dimension2( 40, 30 ); // Empirically determined.
  var GRID_STROKE = 'white';
  var SHAPE_LINE_WIDTH = null;

  /**
   * Static object, not meant to be instantiated.
   */
  return {
    createExploreScreenNavBarIcon: function() {
      var icon = new Node();
      icon.addChild( new Rectangle( 0, 0, NAV_BAR_ICON_SIZE.width, NAV_BAR_ICON_SIZE.height, 0, 0, {
        fill: AreaBuilderSharedConstants.BACKGROUND_COLOR
      } ) );
      icon.addChild( new GridIcon( 4, 4, 4, 'red', [
        new Vector2( 1, 1 ), new Vector2( 2, 1 ), new Vector2( 1, 2 )
      ], {
        gridStroke: GRID_STROKE,
        shapeLineWidth: SHAPE_LINE_WIDTH,
        left: NAV_BAR_ICON_SIZE * 0.1,
        top: NAV_BAR_ICON_SIZE * 0.1
      } ) );
      return icon;
    }
  };
} );