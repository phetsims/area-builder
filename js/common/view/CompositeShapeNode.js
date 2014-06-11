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
  var Grid = require( 'AREA_BUILDER/common/view/Grid' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  function CompositeShapeNode( exteriorPerimetersProperty, interiorPerimetersProperty, unitSquareLength, color ) {

    Node.call( this );

    var compositeShapeNode = new Path( null, { fill: color } );
    this.addChild( compositeShapeNode );
    var gridLayer = new Node();
    this.addChild( gridLayer );
    var perimeterNode = new Path( null, {
      stroke: Color.toColor( color ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR ),
      lineWidth: 2
    } );
    this.addChild( perimeterNode );

    function update() {
      var i;
      var mainShape = new Shape();

      // Define the shape of the outer perimeter.
      exteriorPerimetersProperty.value.forEach( function( exteriorPerimeterPoints ) {
        mainShape.moveToPoint( exteriorPerimeterPoints[ 0 ] );
        for ( i = 1; i < exteriorPerimeterPoints.length; i++ ) {
          mainShape.lineToPoint( exteriorPerimeterPoints[ i ] );
        }
        mainShape.lineToPoint( exteriorPerimeterPoints[ 0 ] );
        mainShape.close();
      } );

      gridLayer.removeAllChildren();

      // Add in the shape of any interior spaces and the grid.
      if ( !mainShape.bounds.isEmpty() ) {
        interiorPerimetersProperty.value.forEach( function( interiorPerimeterPoints ) {
          mainShape.moveToPoint( interiorPerimeterPoints[ 0 ] );
          for ( i = 1; i < interiorPerimeterPoints.length; i++ ) {
            mainShape.lineToPoint( interiorPerimeterPoints[ i ] );
          }
          mainShape.lineToPoint( interiorPerimeterPoints[ 0 ] );
          mainShape.close();
        } );

        compositeShapeNode.setShape( mainShape );
        perimeterNode.setShape( mainShape );

        // TODO: Consider optimization where grid is only redrawn if bounds of shape changes.
        if ( mainShape.bounds.width >= 2 * unitSquareLength || mainShape.bounds.height >= 2 * unitSquareLength ) {
          // Add the grid
          var gridNode = new Grid( mainShape.bounds.minX, mainShape.bounds.minY, mainShape.bounds.width, mainShape.bounds.height, unitSquareLength, {
              lineDash: [ 1, 4 ],
              stroke: 'black'
            }
          );
          gridNode.clipArea = mainShape;
          gridLayer.addChild( gridNode );
        }
      }
      else {
        compositeShapeNode.setShape( null );
        perimeterNode.setShape( null );
      }
    }

    exteriorPerimetersProperty.link( function() {
      update();
    } );

    interiorPerimetersProperty.link( function( innerPerimeter ) {
      update();
    } );
  }

  return inherit( Node, CompositeShapeNode );
} );