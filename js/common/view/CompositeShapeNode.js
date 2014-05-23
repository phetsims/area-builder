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

  function CompositeShapeNode( perimeterPointsProperty, unitSquareLength, color ) {
    Node.call( this );
    var self = this;
    perimeterPointsProperty.link( function( perimeterPoints ) {
      self.removeAllChildren();
      if ( perimeterPoints.length > 0 ) {
        var mainShape = new Shape();
        mainShape.moveToPoint( perimeterPoints[ 0 ] );
        perimeterPoints.forEach( function( perimeterPoint ) {
          mainShape.lineToPoint( perimeterPoint );
        } );
        mainShape.close();
        self.addChild( new Path( mainShape, {
          fill: color,
          stroke: Color.toColor( color ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR ),
          lineWidth: 2
        } ) );
      }
    } );
  }

  return inherit( Node, CompositeShapeNode );
} );