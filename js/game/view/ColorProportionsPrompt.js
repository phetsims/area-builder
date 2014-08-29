// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var FractionNode = require( 'AREA_BUILDER/game/view/FractionNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var MULTI_LINE_SPACING = 5; // Empirically determined to look good
  var SINGLE_LINE_SPACING = 12; // Empirically determined to look good
  var PROMPT_TO_COLOR_SPACING = 4; // Empirically determined to look good

  function ColorProportionsPrompt( color1, color2, color1Proportion, options ) {
    Node.call( this );

    options = _.extend( {
      font: new PhetFont( { size: 18 } ),
      textFill: 'black',
      multiLine: false
    }, options );

    var color1FractionNode = new FractionNode( color1Proportion, {
      font: options.font,
      color: options.textFill
    } );
    this.addChild( color1FractionNode );
    var color2Proportion = new Fraction( color1Proportion.denominator - color1Proportion.numerator, color1Proportion.denominator );
    var color2FractionNode = new FractionNode( color2Proportion, {
      font: options.font,
      color: options.textFill
    } );
    this.addChild( color2FractionNode );
    var patchRadiusX = color1FractionNode.bounds.height * 0.5;
    var patchRadiusY = color1FractionNode.bounds.height * 0.35;
    var color1Patch = new Path( Shape.ellipse( 0, 0, patchRadiusX, patchRadiusY ), {
      fill: color1,
      left: color1FractionNode.right + PROMPT_TO_COLOR_SPACING,
      centerY: color1FractionNode.centerY
    } );
    this.addChild( color1Patch );

    // Position the 2nd prompt based on whether or not the options specify multi-line.
    if ( options.multiLine ) {
      color2FractionNode.top = color1FractionNode.bottom + MULTI_LINE_SPACING;
    }
    else {
      color2FractionNode.left = color1Patch.right + SINGLE_LINE_SPACING;
    }

    var color2ColorPatch = new Path( Shape.ellipse( 0, 0, patchRadiusX, patchRadiusY ), {
      fill: color2,
      left: color2FractionNode.right + PROMPT_TO_COLOR_SPACING,
      centerY: color2FractionNode.centerY
    } );
    this.addChild( color2ColorPatch );

    this.mutate( options );
  }

  return inherit( Node, ColorProportionsPrompt );
} );