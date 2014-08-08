// Copyright 2002-2014, University of Colorado Boulder

/**
 * Data structure for a fraction (possibly improper).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author John Blanco
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

    reduce: function() {

    }
  } );
} );