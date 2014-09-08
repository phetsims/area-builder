// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Fraction} fraction
   * @param {Object} options
   * @constructor
   */
  function FractionNode( fraction, options ) {
    Node.call( this );
    options = _.extend( {
      // default options
      font: new PhetFont( { size: 18 } ),
      color: 'black',
      fractionBarLineWidth: 1,

      // this option controls the width of the fraction bar as a function of the widest of the numerator and denominator.
      fractionBarWidthProportion: 1.1
    }, options );

    assert && assert( options.fractionBarWidthProportion >= 1, 'The fraction bar must be at least the width of the larger fraction component.' );

    // Create and add the pieces
    var numeratorNode = new Text( fraction.numerator.toString(), { font: options.font, fill: options.color } );
    this.addChild( numeratorNode );
    var denominatorNode = new Text( fraction.denominator.toString(), { font: options.font, fill: options.color } );
    this.addChild( denominatorNode );
    var fractionBarWidth = options.fractionBarWidthProportion * Math.max( numeratorNode.width, denominatorNode.width );
    var fractionBarNode = new Line( 0, 0, fractionBarWidth, 0, {
      stroke: options.color,
      lineWidth: options.fractionBarLineWidth
    } );
    this.addChild( fractionBarNode );

    // layout
    numeratorNode.centerX = fractionBarWidth / 2;
    denominatorNode.centerX = fractionBarWidth / 2;
    fractionBarNode.centerY = numeratorNode.bottom;
    denominatorNode.top = fractionBarNode.bottom;
  }

  return inherit( Node, FractionNode );
} );