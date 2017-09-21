// Copyright 2014-2016, University of Colorado Boulder

/**
 * Model element that describes a shape in terms of 'perimeter points', both exterior and interior.  The interior
 * perimeters allow holes to be defined.  The shape is defined by straight lines drawn from each point to the next.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var areaBuilder = require( 'AREA_BUILDER/areaBuilder' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var FLOATING_POINT_ERR_TOLERANCE = 1e-6;

  // Utility function to compute the unit area of a perimeter shape.
  function calculateUnitArea( shape, unitLength ) {

    if ( !shape.bounds.isFinite() ) {
      return 0;
    }

    assert && assert( shape.bounds.width % unitLength < FLOATING_POINT_ERR_TOLERANCE &&
                      shape.bounds.height % unitLength < FLOATING_POINT_ERR_TOLERANCE,
      'Error: This method will only work with shapes that have bounds of unit width and height.'
    );

    // Compute the unit area by testing whether or not points on a sub-grid are contained in the shape.
    var unitArea = 0;
    var testPoint = new Vector2( 0, 0 );
    for ( var row = 0; row * unitLength < shape.bounds.height; row++ ) {
      for ( var column = 0; column * unitLength < shape.bounds.width; column++ ) {
        // Scan four points in the unit square.  This allows support for triangular 1/2 unit square shapes.  This is
        // in-lined rather than looped for the sake of efficiency, since this approach avoids vector allocations.
        testPoint.setXY( shape.bounds.minX + ( column + 0.25 ) * unitLength, shape.bounds.minY + ( row + 0.5 ) * unitLength );
        if ( shape.containsPoint( testPoint ) ) {
          unitArea += 0.25;
        }
        testPoint.setXY( shape.bounds.minX + ( column + 0.5 ) * unitLength, shape.bounds.minY + ( row + 0.25 ) * unitLength );
        if ( shape.containsPoint( testPoint ) ) {
          unitArea += 0.25;
        }
        testPoint.setXY( shape.bounds.minX + ( column + 0.5 ) * unitLength, shape.bounds.minY + ( row + 0.75 ) * unitLength );
        if ( shape.containsPoint( testPoint ) ) {
          unitArea += 0.25;
        }
        testPoint.setXY( shape.bounds.minX + ( column + 0.75 ) * unitLength, shape.bounds.minY + ( row + 0.5 ) * unitLength );
        if ( shape.containsPoint( testPoint ) ) {
          unitArea += 0.25;
        }
      }
    }
    return unitArea;
  }

  /**
   * @param {Array<Array<Vector2>>} exteriorPerimeters An array of perimeters, each of which is a sequential array of
   * points.
   * @param {Array<Array<Vector2>>} interiorPerimeters An array of perimeters, each of which is a sequential array of
   * points. Each interior perimeter must be fully contained within an exterior perimeter.
   * @param {number} unitLength The unit length (i.e. the width or height of a unit square) of the unit sizes that
   * this shape should be constructed from.
   * @param {Object} [options]
   * @constructor
   */
  function PerimeterShape( exteriorPerimeters, interiorPerimeters, unitLength, options ) {
    var self = this;
    var i;

    options = _.extend( {
      fillColor: null,
      edgeColor: null
    }, options ); // Make sure options is defined.

    // @public, read only
    this.fillColor = options.fillColor;

    // @public, read only
    this.edgeColor = options.edgeColor;

    // @public, read only
    this.exteriorPerimeters = exteriorPerimeters;

    // @public, read only
    this.interiorPerimeters = interiorPerimeters;

    // @private
    this.unitLength = unitLength;

    // @private A Kite shape created from the points, useful in various situations.
    this.kiteShape = new Shape();
    exteriorPerimeters.forEach( function( exteriorPerimeter ) {
      self.kiteShape.moveToPoint( exteriorPerimeter[ 0 ] );
      for ( i = 1; i < exteriorPerimeter.length; i++ ) {
        self.kiteShape.lineToPoint( exteriorPerimeter[ i ] );
      }
      self.kiteShape.lineToPoint( exteriorPerimeter[ 0 ] );
      self.kiteShape.close();
    } );

    // Only add interior spaces if there is a legitimate external perimeter.
    if ( !self.kiteShape.bounds.isEmpty() ) {
      interiorPerimeters.forEach( function( interiorPerimeter ) {
        self.kiteShape.moveToPoint( interiorPerimeter[ 0 ] );
        for ( i = 1; i < interiorPerimeter.length; i++ ) {
          self.kiteShape.lineToPoint( interiorPerimeter[ i ] );
        }
        self.kiteShape.lineToPoint( interiorPerimeter[ 0 ] );
        self.kiteShape.close();
      } );
    }

    // @public, read only
    this.unitArea = calculateUnitArea( this.kiteShape, unitLength );
  }

  areaBuilder.register( 'PerimeterShape', PerimeterShape );

  return inherit( Object, PerimeterShape, {

    // Returns a linearly translated version of this perimeter shape.
    translated: function( x, y ) {
      var exteriorPerimeters = [];
      var interiorPerimeters = [];
      this.exteriorPerimeters.forEach( function( exteriorPerimeter, index ) {
        exteriorPerimeters.push( [] );
        exteriorPerimeter.forEach( function( point ) {
          exteriorPerimeters[ index ].push( point.plusXY( x, y ) );
        } );
      } );
      this.interiorPerimeters.forEach( function( interiorPerimeter, index ) {
        interiorPerimeters.push( [] );
        interiorPerimeter.forEach( function( point ) {
          interiorPerimeters[ index ].push( point.plusXY( x, y ) );
        } );
      } );
      return new PerimeterShape( exteriorPerimeters, interiorPerimeters, this.unitLength, {
        fillColor: this.fillColor,
        edgeColor: this.edgeColor
      } );
    },

    getWidth: function() {
      return this.kiteShape.bounds.width;
    },

    getHeight: function() {
      return this.kiteShape.bounds.height;
    }
  } );
} );