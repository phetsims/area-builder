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
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var NAV_BAR_ICON_SIZE = new Dimension2( 40, 30 ); // Empirically determined.
  var UNIT_SQUARE_LENGTH = 4; // Empirically determined
  var GRID_STROKE = null;
  var SHAPE_LINE_WIDTH = null;
  var GRID_OPTIONS = {
    backgroundStroke: 'black',
    backgroundLineWidth: 0.5,
    gridStroke: GRID_STROKE,
    shapeLineWidth: SHAPE_LINE_WIDTH
  };

  function createBucketIcon( shapesColor, options ) {
    var icon = new Node();
    var ellipseXRadius = UNIT_SQUARE_LENGTH * 1.2;
    var ellipseYRadius = UNIT_SQUARE_LENGTH * 0.35;
    var bucketDepth = UNIT_SQUARE_LENGTH * 0.8;
    var bodyShape = new Shape().
      moveTo( -ellipseXRadius ).
      lineTo( -ellipseXRadius * 0.75, bucketDepth ).
      quadraticCurveTo( 0, bucketDepth + ellipseYRadius, ellipseXRadius * 0.75, bucketDepth ).
      lineTo( ellipseXRadius, 0 ).
      close();
    icon.addChild( new Path( bodyShape, { fill: 'blue' } ) );
    icon.addChild( new Path( Shape.ellipse( 0, 0, ellipseXRadius, ellipseYRadius ), {
      fill: '#333333'
    } ) );

    icon.mutate( options );
    return icon;
  }

  /**
   * Static object, not meant to be instantiated.
   */
  return {
    createExploreScreenNavBarIcon: function() {

      // root node
      var icon = new Node();

      // background
      icon.addChild( new Rectangle( 0, 0, NAV_BAR_ICON_SIZE.width, NAV_BAR_ICON_SIZE.height, 0, 0, {
        fill: AreaBuilderSharedConstants.BACKGROUND_COLOR
      } ) );

      // left shape placement board and shapes
      var leftBoard = new GridIcon( 4, 4, UNIT_SQUARE_LENGTH, AreaBuilderSharedConstants.GREENISH_COLOR, [
        new Vector2( 1, 1 ), new Vector2( 2, 1 ), new Vector2( 1, 2 )
      ], _.extend( { left: NAV_BAR_ICON_SIZE.width * 0.05, top: NAV_BAR_ICON_SIZE.height * 0.1 }, GRID_OPTIONS ) )
      icon.addChild( leftBoard );

      // right shape placement board and shapes
      var rightBoard = new GridIcon( 4, 4, UNIT_SQUARE_LENGTH, AreaBuilderSharedConstants.PURPLISH_COLOR, [
        new Vector2( 1, 1 ), new Vector2( 2, 1 )
      ], _.extend( { right: NAV_BAR_ICON_SIZE.width * 0.95, top: NAV_BAR_ICON_SIZE.height * 0.1 }, GRID_OPTIONS ) );
      icon.addChild( rightBoard );

      // left bucket
      icon.addChild( createBucketIcon( AreaBuilderSharedConstants.GREENISH_COLOR, {
        centerX: leftBoard.centerX,
        top: leftBoard.bottom + 2
      } ) );

      // right bucket
      icon.addChild( createBucketIcon( AreaBuilderSharedConstants.GREENISH_COLOR, {
        centerX: rightBoard.centerX,
        top: rightBoard.bottom + 2
      } ) );

      return icon;
    }
  };
} );