// Copyright 2002-2014, University of Colorado Boulder

/**
 * A Scenery node that depicts a basic shape with its dimensions labeled, intended for use in control panels.  It
 * includes an overlying grid that can be turned on or off.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Color = require( 'SCENERY/util/Color' );
  var Grid = require( 'AREA_BUILDER/common/view/Grid' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var UNIT_LENGTH = 10; // in screen coordinates
  var WIDTH = 3 * UNIT_LENGTH;
  var HEIGHT = 2 * UNIT_LENGTH; // in screen coordinates
  var LABEL_FONT = new PhetFont( 10 );
  var DEFAULT_FILL_COLOR = AreaBuilderSharedConstants.GREENISH_COLOR;

  /**
   * @param {Object} [options]
   * @constructor
   */
  function DimensionsIcon( options ) {
    Node.call( this );

    // Create the background rectangle node.
    this.singleRectNode = new Rectangle( 0, 0, WIDTH, HEIGHT, 0, 0 );
    this.addChild( this.singleRectNode );

    // Add the grid.
    this.grid = new Grid( new Bounds2( 0, 0, WIDTH, HEIGHT ), UNIT_LENGTH, { stroke: '#b0b0b0', lineDash: [ 1, 2 ] } );
    this.addChild( this.grid );

    // Initialize the color.
    this.setColor( DEFAULT_FILL_COLOR );

    // Label the sides.
    this.addChild( new Text( '2', { font: LABEL_FONT, right: -2, centerY: WIDTH / 2 } ) );
    this.addChild( new Text( '2', { font: LABEL_FONT, left: WIDTH + 2, centerY: HEIGHT / 2 } ) );
    this.addChild( new Text( '3', { font: LABEL_FONT, centerX: WIDTH / 2, bottom: 0 } ) );
    this.addChild( new Text( '3', { font: LABEL_FONT, centerX: WIDTH / 2, top: HEIGHT } ) );

    // Pass through any options.
    this.mutate( options );
  }

  return inherit( Node, DimensionsIcon, {

    setGridVisible: function( gridVisible ) {
      assert && assert( typeof( gridVisible ) === 'boolean' );
      this.grid.visible = gridVisible;
    },

    setColor: function( color ) {
      this.singleRectNode.fill = color;
      var strokeColor = Color.toColor( color ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR );
      this.singleRectNode.stroke = strokeColor;
      this.grid.stroke = strokeColor;
    }
  } );
} );