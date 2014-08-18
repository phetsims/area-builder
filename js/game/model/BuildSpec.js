// Copyright 2002-2014, University of Colorado Boulder

/**
 * Defines a 'build specification', which is used to define what a user should build when presented with a 'build it'
 * style challenge in the Area Builder game.
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {number} area
   * @param {number} perimeter
   * @param {Color || String} color1
   * @param {Fraction} color1Proportion
   * @param {Color || String} color2
   * @constructor
   */
  function BuildSpec( area, perimeter, color1, color1Proportion, color2 ) {
    assert && assert( typeof( area) === 'number' );
    this.area = area;
    if ( perimeter !== null ) {
      assert && assert( typeof( perimeter ) === 'number' );
      this.perimeter = perimeter;
    }
    if ( color1 !== null ) {
      assert && assert( typeof( color1Proportion ) === 'Fraction' && color2 !== null );
      this.color1 = color1;
      this.color2 = color2;
      this.color1Proportion = color1Proportion;
    }
  }

  return inherit( Object, BuildSpec, {}, {
    areaOnlyBuildSpec: function( area ) {
      return new BuildSpec( area, null, null, null, null );
    },

    areaAndPerimeterBuildSpec: function( area, perimeter ) {
      return new BuildSpec( area, perimeter, null, null, null );
    },

    areaAndProportionsBuildSpec: function( area, color1, color1Proportion, color2 ) {
      return new BuildSpec( area, null, color1, color1Proportion, color2 );
    },

    areaPerimeterAndProportionsBuildSpec: function( area, perimeter, color1, color1Proportion, color2 ) {
      return new BuildSpec( area, perimeter, color1, color1Proportion, color2 );
    }
  } );
} );