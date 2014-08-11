// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var MULTI_LINE_SPACING = 5; // Empirically determined to look good
  var SINGLE_LINE_SPACING = 8; // Empirically determined to look good
  var PROMPT_TO_COLOR_SPACING = 4; // Empirically determined to look good

  function ColorProportionsPrompt( color1, color2, color1Proportion, options ) {
    Node.call( this );

    options = _.extend( {
      font: new PhetFont( { size: 18 } ),
      textFill: 'black',
      multiLine: false
    }, options );

    var color1ProportionText = new Text( color1Proportion.toString(), {
      font: options.font,
      fill: options.textFill
    } );
    this.addChild( color1ProportionText );
    var color2ProportionText = new Text( ( color1Proportion.denominator - color1Proportion.numerator ) + '/' + color1Proportion.denominator, {
      font: options.font,
      fill: options.textFill
    } );
    this.addChild( color2ProportionText );
    var patchRadiusX = color1ProportionText.bounds.height * 0.75;
    var patchRadiusY = color1ProportionText.bounds.height * 0.5;
    var color1Patch = new Path( Shape.ellipse( 0, 0, patchRadiusX, patchRadiusY ), {
      fill: color1,
      left: color1ProportionText.right + PROMPT_TO_COLOR_SPACING,
      centerY: color1ProportionText.centerY
    } );
    this.addChild( color1Patch );

    // Position the 2nd prompt based on whether or not the options specify multi-line.
    if ( options.multiLine ) {
      color2ProportionText.top = color1ProportionText.bottom + MULTI_LINE_SPACING;
    }
    else {
      color2ProportionText.left = color1Patch.right + SINGLE_LINE_SPACING;
    }

    var color2ColorPatch = new Path( Shape.ellipse( 0, 0, patchRadiusX, patchRadiusY ), { fill: color2,
      left: color2ProportionText.right + PROMPT_TO_COLOR_SPACING,
      centerY: color2ProportionText.centerY
    } );
    this.addChild( color2ColorPatch );

    this.mutate( options );
  }

  return inherit( Node, ColorProportionsPrompt );
} );