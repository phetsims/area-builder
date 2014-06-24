// Copyright 2002-2014, University of Colorado Boulder

/**
 * A Scenery node that depicts a basic shape with its dimensions labeled, intended for use in control panels.
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
  var FILL_COLOR = AreaBuilderSharedConstants.GREENISH_COLOR;
  var STROKE_COLOR = Color.toColor( FILL_COLOR ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR );

  function DimensionsIcon( options ) {
    Node.call( this );

    // Create the shape out from a collection of squares.
    this.addChild( new Rectangle( 0, 0, SQUARE_LENGTH, SQUARE_LENGTH, 0, 0, { fill: FILL_COLOR, stroke: STROKE_COLOR } ) );
    this.addChild( new Rectangle( SQUARE_LENGTH, 0, SQUARE_LENGTH, SQUARE_LENGTH, 0, 0, { fill: FILL_COLOR, stroke: STROKE_COLOR } ) );
    this.addChild( new Rectangle( SQUARE_LENGTH * 2, 0, SQUARE_LENGTH, SQUARE_LENGTH, 0, 0, { fill: FILL_COLOR, stroke: STROKE_COLOR } ) );
    this.addChild( new Rectangle( 0, SQUARE_LENGTH, SQUARE_LENGTH, SQUARE_LENGTH, 0, 0, { fill: FILL_COLOR, stroke: STROKE_COLOR } ) );
    this.addChild( new Rectangle( SQUARE_LENGTH, SQUARE_LENGTH, SQUARE_LENGTH, SQUARE_LENGTH, 0, 0, { fill: FILL_COLOR, stroke: STROKE_COLOR } ) );
    this.addChild( new Rectangle( SQUARE_LENGTH * 2, SQUARE_LENGTH, SQUARE_LENGTH, SQUARE_LENGTH, 0, 0, { fill: FILL_COLOR, stroke: STROKE_COLOR } ) );

    // Label some of the sides.
    this.addChild( new Text( '2', { font: LABEL_FONT, right: -2, centerY: SQUARE_LENGTH } ) );
    this.addChild( new Text( '2', { font: LABEL_FONT, left: SQUARE_LENGTH * 3 + 2, centerY: SQUARE_LENGTH } ) );
    this.addChild( new Text( '3', { font: LABEL_FONT, centerX: SQUARE_LENGTH * 1.5, bottom: 0 } ) );
    this.addChild( new Text( '3', { font: LABEL_FONT, centerX: SQUARE_LENGTH * 1.5, top: SQUARE_LENGTH * 2 } ) );

    // Pass through any options.
    this.mutate( options );
  }

  return inherit( Node, DimensionsIcon );
} );