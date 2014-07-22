// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model element that describes a shape in terms of 'perimeter points', both exterior and interior (so that holes can
 * be defined).  The shape is defined by straight lines drawn from each point to the next.
 */
define( function( require ) {
  'use strict';

  // modules
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // Utility function to compute the unit area of a perimeter shape.
  function calculateUnitArea( exteriorPerimeters, interiorPerimeters, unitLength ) {

    if ( exteriorPerimeters.length === 0 ) {
      return 0;
    }

    // Create a KITE shape that will be defined based on the perimeter points and used to test the unit area.
    var shape = new Shape();

    // Define the shape of the outer perimeter.
    exteriorPerimeters.forEach( function( exteriorPerimeter ) {
      shape.moveToPoint( exteriorPerimeter[ 0 ] );
      for ( var i = 1; i < exteriorPerimeter.length; i++ ) {
        shape.lineToPoint( exteriorPerimeter[ i ] );
      }
      shape.lineToPoint( exteriorPerimeter[ 0 ] );
      shape.close();
    } );

    assert && assert( shape.bounds.width % unitLength === 0 && shape.bounds.height % unitLength === 0,
      'Error: This method will only work with shapes that have bounds of unit width and height.'
    );

    // Subtract out the shape of any interior spaces.
    if ( !shape.bounds.isEmpty() ) {
      interiorPerimeters.forEach( function( interiorPerimeter ) {
        shape.moveToPoint( interiorPerimeter[ 0 ] );
        for ( i = 1; i < interiorPerimeter.length; i++ ) {
          shape.lineToPoint( interiorPerimeter[ i ] );
        }
        shape.lineToPoint( interiorPerimeter[ 0 ] );
        shape.close();
      } );
    }

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
   * @param {Number} unitLength The unit length (i.e. the width or height of a unit square) of the unit sizes that
   * this shape should be constructed from.
   * @constructor
   */
  function PerimeterShape( exteriorPerimeters, interiorPerimeters, unitLength ) {

    // @public, read only
    this.exteriorPerimeters = exteriorPerimeters;

    // @public, read only
    this.interiorPerimeters = interiorPerimeters;

    // @public, read only
    this.unitArea = calculateUnitArea( exteriorPerimeters, interiorPerimeters, unitLength );
  }

  return PerimeterShape;
} );