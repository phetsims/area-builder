// Copyright 2002-2014, University of Colorado Boulder

/**
 * Type that represents a movable shape in the view.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  function ShapeView( movableShape ) {
    Node.call( this, { cursor: 'pointer' } );
    this.color = movableShape.color; // @public

    var representation = new Path( movableShape.shape, {
      fill: movableShape.color,
      stroke: Color.toColor( movableShape.color ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR ),
      lineWidth: 1,
      lineDash: [ 4 ]
    } );
    this.addChild( representation );

    // Move the shape as the model representation moves
    movableShape.positionProperty.link( function( position ) {
      representation.leftTop = position;
    } );

    movableShape.userControlledProperty.link( function( userControlled ) {
      representation.lineDash = userControlled ? null : [ 4 ];
    } );

    // Add the listener that will allow the user to drag the shape around.
    this.addInputListener( new SimpleDragHandler( {
      // Allow moving a finger (touch) across a node to pick it up.
      allowTouchSnag: true,

      // Handler that moves the shape in model space.
      translate: function( translationParams ) {
        movableShape.position = movableShape.position.plus( translationParams.delta );
        return translationParams.position;
      },
      start: function( event, trail ) {
        movableShape.userControlled = true;
      },
      end: function( event, trail ) {
        movableShape.userControlled = false;
      }
    } ) );
  }

  return inherit( Node, ShapeView );
} );