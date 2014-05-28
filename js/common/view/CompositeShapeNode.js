// Copyright 2002-2014, University of Colorado Boulder

/**
 * A shape that is composed of a number of unit shapes, but is drawn as more
 * of a contiguous shape with an emphasized perimeter and with dotted lines
 * representing the inner edges of the unit squares.
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  function CompositeShapeNode( outerPerimeterPointsProperty, interiorPerimetersProperty, unitSquareLength, color ) {
    Node.call( this );
    var self = this;
    var compositeShapeNode = null;

    function update() {
      var i;

      if ( compositeShapeNode ) {
        self.removeChild( compositeShapeNode );
      }

      // Define the shape of the outer perimeter.
      var outerPerimeterPoints = outerPerimeterPointsProperty.value;
      if ( outerPerimeterPoints.length > 0 ) {
        var mainShape = new Shape();
        mainShape.moveToPoint( outerPerimeterPoints[ 0 ] );
        for ( i = 1; i < outerPerimeterPoints.length; i++ ) {
          mainShape.lineToPoint( outerPerimeterPoints[i] );
        }
        mainShape.close();
      }

      // Add in the shape of any interior spaces.
      var interiorPerimeters = interiorPerimetersProperty.value;
      interiorPerimeters.forEach( function( interiorPerimeterPoints ) {
        mainShape.moveToPoint( interiorPerimeterPoints[ 0 ] );
        for ( i = 1; i < interiorPerimeterPoints.length; i++ ) {
          mainShape.lineToPoint( interiorPerimeterPoints[ i ] );
        }
        mainShape.lineToPoint( interiorPerimeterPoints[ 0 ] );
      } );

      compositeShapeNode = new Path( mainShape, {
//        fill: color,
        stroke: Color.toColor( color ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR ),
        lineWidth: 2
      } );
      self.addChild( compositeShapeNode );
    }

    outerPerimeterPointsProperty.link( function() {
      update();
    } );

    interiorPerimetersProperty.link( function( innerPerimeter ) {
      update();
    } );
  }

  return inherit( Node, CompositeShapeNode );
} );