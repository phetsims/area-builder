// Copyright 2002-2014, University of Colorado Boulder

/**
 * A Scenery node that consists of two fractions and two color patches, used when prompting the user to create a shape
 * that is comprised to two different colors.
 */
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

  /**
   * @param {String || Color} color1 - Color value for the 1st color patch
   * @param {String || Color} color2 - Color value for the 2nd color pathc
   * @param {Fraction} color1Proportion - Fraction for color1, the color2 fraction is deduced from this.
   * @param options
   * @constructor
   */
  function ColorProportionsPrompt( color1, color2, color1Proportion, options ) {
    Node.call( this );

    options = _.extend( {
      font: new PhetFont( { size: 18 } ),
      textFill: 'black',
      multiLine: false
    }, options );

    this.color1FractionNode = new FractionNode( color1Proportion, {
      font: options.font,
      color: options.textFill
    } );
    this.addChild( this.color1FractionNode );
    var color2Proportion = new Fraction( color1Proportion.denominator - color1Proportion.numerator, color1Proportion.denominator );
    this.color2FractionNode = new FractionNode( color2Proportion, {
      font: options.font,
      color: options.textFill
    } );
    this.addChild( this.color2FractionNode );
    var patchRadiusX = this.color1FractionNode.bounds.height * 0.5;
    var patchRadiusY = this.color1FractionNode.bounds.height * 0.35;
    var colorPatchShape = Shape.ellipse( 0, 0, this.color1FractionNode.bounds.height * 0.5, this.color1FractionNode.bounds.height * 0.35 );
    this.color1Patch = new Path( colorPatchShape, {
      fill: color1,
      left: this.color1FractionNode.right + PROMPT_TO_COLOR_SPACING,
      centerY: this.color1FractionNode.centerY
    } );
    this.addChild( this.color1Patch );

    // Position the 2nd prompt based on whether or not the options specify multi-line.
    if ( options.multiLine ) {
      this.color2FractionNode.top = this.color1FractionNode.bottom + MULTI_LINE_SPACING;
    }
    else {
      this.color2FractionNode.left = this.color1Patch.right + SINGLE_LINE_SPACING;
    }

    this.color2Patch = new Path( colorPatchShape, {
      fill: color2,
      left: this.color2FractionNode.right + PROMPT_TO_COLOR_SPACING,
      centerY: this.color2FractionNode.centerY
    } );
    this.addChild( this.color2Patch );

    this.mutate( options );
  }

  return inherit( Node, ColorProportionsPrompt, {

    set color1( color ) {
      this.color1Patch.fill = color;
    },

    set color2( color ) {
      this.color2Patch.fill = color;
    },

    set color1Proportion( color1Proportion ) {
      this.color1FractionNode.fraction = color1Proportion;
      var color2Proportion = new Fraction( color1Proportion.denominator - color1Proportion.numerator, color1Proportion.denominator );
    }
  } );
} );