// Copyright 2002-2014, University of Colorado Boulder

/**
 * Defines a 'build specification', which is used to define what a user should build when presented with a 'build it'
 * style challenge in the Area Builder game.
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {number} area
   * @param {number} perimeter
   * @param {Color || String} color1
   * @param {Color || String} color2
   * @param {Fraction} color1Proportion
   * @constructor
   */
  function BuildSpec( area, perimeter, color1, color2, color1Proportion ) {
    assert && assert( typeof( area) === 'number' );
    this.area = area;
    if ( perimeter !== null ) {
      assert && assert( typeof( perimeter ) === 'number' );
      this.perimeter = perimeter;
    }
    if ( color1 !== null && color1Proportion !== null && color2 !== null ) {
      assert && assert( color1Proportion instanceof Fraction );
      this.proportions = {};
      this.proportions.color1 = Color.toColor( color1 );
      this.proportions.color2 = Color.toColor( color2 );
      this.proportions.color1Proportion = color1Proportion;
    }
  }

  return inherit( Object, BuildSpec, {}, {
    areaOnly: function( area ) {
      return new BuildSpec( area, null, null, null, null );
    },

    areaAndPerimeter: function( area, perimeter ) {
      return new BuildSpec( area, perimeter, null, null, null );
    },

    areaAndProportions: function( area, color1, color2, color1Proportion ) {
      return new BuildSpec( area, null, color1, color2, color1Proportion );
    },

    areaPerimeterAndProportions: function( area, perimeter, color1, color2, color1Proportion ) {
      return new BuildSpec( area, perimeter, color1, color2, color1Proportion );
    }
  } );
} );