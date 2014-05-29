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
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  function ShapeView( movableShape ) {
    Node.call( this, { cursor: 'pointer' } );
    var self = this;
    this.color = movableShape.color; // @public

    var representation = new Path( movableShape.shape, {
      fill: movableShape.color,
      stroke: Color.toColor( movableShape.color ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR ),
      lineWidth: 1
    } );
    this.addChild( representation );

    // Move the shape as the model representation moves
    movableShape.positionProperty.link( function( position ) {
      representation.leftTop = position;
    } );

    var visibleProperty = new DerivedProperty(
      [ movableShape.userControlledProperty, movableShape.animatingProperty],
      function( userControlled, animating ) {
        return userControlled || animating;
      } );

    visibleProperty.link( function( visible ) {
      representation.opacity = visible ? 1 : 0;
    } );

    movableShape.animatingProperty.link( function( animating ) {
      // To avoid certain complications, make it so that users can't grab
      // this when it is moving.
      self.pickable = !animating;
    } );

    // Add the listener that will allow the user to drag the shape around.
    this.addInputListener( new SimpleDragHandler( {
      // Allow moving a finger (touch) across a node to pick it up.
      allowTouchSnag: true,

      // Handler that moves the shape in model space.
      translate: function( translationParams ) {
        movableShape.setDestination( movableShape.position.plus( translationParams.delta ), false );
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