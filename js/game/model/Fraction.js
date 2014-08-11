// Copyright 2002-2014, University of Colorado Boulder

/**
 * Data structure for a fraction (possibly improper).
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Number} numerator must be an integer
   * @param {Number} denominator must be an integer
   * @constructor
   */
  function Fraction( numerator, denominator ) {
    assert && assert( Util.isInteger( numerator ) ) && assert( Util.isInteger( denominator ) );
    this.numerator = numerator;
    this.denominator = denominator;
  }

  return inherit( Object, Fraction, {

    getValue: function() {
      return this.numerator / this.denominator;
    },

    isInteger: function() {
      return Util.isInteger( this.getValue() );
    },

    toString: function() {
      return this.numerator + '/' + this.denominator;
    },

    // @private, find the greatest common denominator using the classic algorithm
    gcd: function( a, b ) {
      return b === 0 ? a : this.gcd( b, a % b );
    },

    reduce: function() {
      var gcd = this.gcd( this.numerator, this.denominator );
      this.numerator = gcd === 0 ? 0 : Math.round( this.numerator / gcd );
      this.denominator = gcd === 0 ? 0 : Math.round( this.denominator / gcd );
    }
  } );
} );