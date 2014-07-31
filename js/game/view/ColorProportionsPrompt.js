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

  // strings
  var areString = require( 'string!AREA_BUILDER/are' );

  function ColorProportionsPrompt( color1, color2, color1ProportionNumerator, color1ProportionDenominator, options ) {
    Node.call( this );

    options = _.extend( { font: new PhetFont( { size: 18 } ), textFill: 'black' }, options );

    var targetProportionsUpperText = new Text( color1ProportionNumerator + '/' + color1ProportionDenominator + ' ' + areString, {
      font: options.font,
      fill: options.textFill
    } );
    this.addChild( targetProportionsUpperText );
    var targetProportionsLowerText = new Text( ( color1ProportionDenominator - color1ProportionNumerator ) + '/' + color1ProportionDenominator + ' ' + areString, {
      font: options.font,
      fill: options.textFill,
      top: targetProportionsUpperText.bottom + 5 // Offset empirically determined
    } );
    this.addChild( targetProportionsLowerText );
    var patchRadiusX = targetProportionsUpperText.bounds.height * 0.75;
    var patchRadiusY = targetProportionsUpperText.bounds.height * 0.5;
    var upperColorPatch = new Path( Shape.ellipse( 0, 0, patchRadiusX, patchRadiusY ), {
      fill: color1,
      left: targetProportionsUpperText.right + 8,  // Offset empirically determined
      centerY: targetProportionsUpperText.centerY
    } );
    this.addChild( upperColorPatch );
    var lowerColorPatch = new Path( Shape.ellipse( 0, 0, patchRadiusX, patchRadiusY ), {
      fill: color2,
      left: upperColorPatch.left,
      centerY: targetProportionsLowerText.centerY
    } );
    this.addChild( lowerColorPatch );

    this.mutate( options );
  }

  return inherit( Node, ColorProportionsPrompt );
} );