// Copyright 2002-2014, University of Colorado Boulder

/**
 * A Scenery node that depicts a basic shape with its dimensions labeled, intended for use in control panels.  This
 * supports two different styles, one that looks like a composite shapes that the user creates, and one that looks like
 * the solid shapes used in the 'find the area' challenges.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var SQUARE_LENGTH = 10; // in screen coordinates
  var LABEL_FONT = new PhetFont( 10 );
  var COMPOSITE_FILL_COLOR = AreaBuilderSharedConstants.GREENISH_COLOR;
  var COMPOSITE_STROKE_COLOR = Color.toColor( COMPOSITE_FILL_COLOR ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR );
  var DEFAULT_SINGLE_RECT_COLOR = new Color( AreaBuilderSharedConstants.PURPLISH_COLOR );
  var DEFAULT_SINGLE_RECT_STROKE = DEFAULT_SINGLE_RECT_COLOR.colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function DimensionsIcon( options ) {
    Node.call( this );

    // Create the composite shape out from a collection of squares.
    this.compositeNode = new Node();
    this.compositeNode.addChild( new Rectangle( 0, 0, SQUARE_LENGTH, SQUARE_LENGTH, 0, 0, { fill: COMPOSITE_FILL_COLOR, stroke: COMPOSITE_STROKE_COLOR } ) );
    this.compositeNode.addChild( new Rectangle( SQUARE_LENGTH, 0, SQUARE_LENGTH, SQUARE_LENGTH, 0, 0, { fill: COMPOSITE_FILL_COLOR, stroke: COMPOSITE_STROKE_COLOR } ) );
    this.compositeNode.addChild( new Rectangle( SQUARE_LENGTH * 2, 0, SQUARE_LENGTH, SQUARE_LENGTH, 0, 0, { fill: COMPOSITE_FILL_COLOR, stroke: COMPOSITE_STROKE_COLOR } ) );
    this.compositeNode.addChild( new Rectangle( 0, SQUARE_LENGTH, SQUARE_LENGTH, SQUARE_LENGTH, 0, 0, { fill: COMPOSITE_FILL_COLOR, stroke: COMPOSITE_STROKE_COLOR } ) );
    this.compositeNode.addChild( new Rectangle( SQUARE_LENGTH, SQUARE_LENGTH, SQUARE_LENGTH, SQUARE_LENGTH, 0, 0, { fill: COMPOSITE_FILL_COLOR, stroke: COMPOSITE_STROKE_COLOR } ) );
    this.compositeNode.addChild( new Rectangle( SQUARE_LENGTH * 2, SQUARE_LENGTH, SQUARE_LENGTH, SQUARE_LENGTH, 0, 0, { fill: COMPOSITE_FILL_COLOR, stroke: COMPOSITE_STROKE_COLOR } ) );
    this.addChild( this.compositeNode );

    //REVIEW is this a rectangle that encloses the grid of 6 rectangles above? why is this needed?
    // Create the single rectangle node
    var singleRectNodeWidth = SQUARE_LENGTH * 3;
    var singleRectNodeHeight = SQUARE_LENGTH * 2;
    this.singleRectNode = new Rectangle( 0, 0, singleRectNodeWidth, singleRectNodeHeight, 0, 0, {
      fill: DEFAULT_SINGLE_RECT_COLOR,
      stroke: DEFAULT_SINGLE_RECT_STROKE
    } );
    this.addChild( this.singleRectNode );

    // Label some of the sides.  This is valid for both modes.
    this.addChild( new Text( '2', { font: LABEL_FONT, right: -2, centerY: SQUARE_LENGTH } ) );
    this.addChild( new Text( '2', { font: LABEL_FONT, left: SQUARE_LENGTH * 3 + 2, centerY: SQUARE_LENGTH } ) );
    this.addChild( new Text( '3', { font: LABEL_FONT, centerX: SQUARE_LENGTH * 1.5, bottom: 0 } ) );
    this.addChild( new Text( '3', { font: LABEL_FONT, centerX: SQUARE_LENGTH * 1.5, top: SQUARE_LENGTH * 2 } ) );

    // Set the default style.
    this.setStyle( 'composite' );

    // Pass through any options.
    this.mutate( options );
  }

  return inherit( Node, DimensionsIcon, {

    //REVIEW doc, describe style values
    setStyle: function( style ) {
      assert && assert( style === 'single' || style === 'composite' );
      switch( style ) {
        case 'composite':
          this.singleRectNode.visible = false;
          this.compositeNode.visible = true;
          break;
        case 'single':
          this.compositeNode.visible = false;
          this.singleRectNode.visible = true;
          break;
      }
    },

    setSingleRectColor: function( color ) {
      this.singleRectNode.fill = color;
      this.singleRectNode.stroke = Color.toColor( color ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR );
    }

  } );
} );