// Copyright 2002-2014, University of Colorado Boulder

/**
 * A Scenery node that depicts a basic shape with its dimensions labeled, intended for use in control panels.  This
 * supports two different styles, one that looks like a composite shapes that the user creates, and one that looks like
 * the background shapes used in the 'find the area' challenges.
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
  var BACKGROUND_FILL_COLOR = AreaBuilderSharedConstants.BACKGROUND_SHAPE_COLOR;
  var STROKE_COLOR = Color.toColor( COMPOSITE_FILL_COLOR ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR );

  function DimensionsIcon( options ) {
    Node.call( this );

    // Create the composite shape out from a collection of squares.
    this.compositeNode = new Node();
    this.compositeNode.addChild( new Rectangle( 0, 0, SQUARE_LENGTH, SQUARE_LENGTH, 0, 0, { fill: COMPOSITE_FILL_COLOR, stroke: STROKE_COLOR } ) );
    this.compositeNode.addChild( new Rectangle( SQUARE_LENGTH, 0, SQUARE_LENGTH, SQUARE_LENGTH, 0, 0, { fill: COMPOSITE_FILL_COLOR, stroke: STROKE_COLOR } ) );
    this.compositeNode.addChild( new Rectangle( SQUARE_LENGTH * 2, 0, SQUARE_LENGTH, SQUARE_LENGTH, 0, 0, { fill: COMPOSITE_FILL_COLOR, stroke: STROKE_COLOR } ) );
    this.compositeNode.addChild( new Rectangle( 0, SQUARE_LENGTH, SQUARE_LENGTH, SQUARE_LENGTH, 0, 0, { fill: COMPOSITE_FILL_COLOR, stroke: STROKE_COLOR } ) );
    this.compositeNode.addChild( new Rectangle( SQUARE_LENGTH, SQUARE_LENGTH, SQUARE_LENGTH, SQUARE_LENGTH, 0, 0, { fill: COMPOSITE_FILL_COLOR, stroke: STROKE_COLOR } ) );
    this.compositeNode.addChild( new Rectangle( SQUARE_LENGTH * 2, SQUARE_LENGTH, SQUARE_LENGTH, SQUARE_LENGTH, 0, 0, { fill: COMPOSITE_FILL_COLOR, stroke: STROKE_COLOR } ) );
    this.addChild( this.compositeNode );

    // Create the background node
    this.backgroundNode = new Node();
    this.backgroundNode.addChild( new Rectangle( 0, 0, SQUARE_LENGTH * 3, SQUARE_LENGTH * 2, 0, 0, { fill: BACKGROUND_FILL_COLOR, stroke: STROKE_COLOR } ) );
    this.addChild( this.backgroundNode );

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
    setStyle: function( style ) {
      assert && assert( style === 'background' || style === 'composite' );
      switch( style ) {
        case 'composite':
          this.backgroundNode.visible = false;
          this.compositeNode.visible = true;
          break;
        case 'background':
          this.compositeNode.visible = false;
          this.backgroundNode.visible = true;
          break;
      }
    }
  } );
} );