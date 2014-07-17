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
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var SHADOW_COLOR = 'rgba( 50, 50, 50, 0.5 )';
  var SHADOW_OFFSET = new Vector2( 5, 5 );

  function ShapeView( movableShape ) {
    Node.call( this, { cursor: 'pointer' } );
    var self = this;
    this.color = movableShape.color; // @public

    // Create the shadow
    var shadow = new Path( movableShape.shape, {
      fill: SHADOW_COLOR
    } );
    var representation = new Path( movableShape.shape, {
      fill: movableShape.color,
      stroke: Color.toColor( movableShape.color ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR ),
      lineWidth: 1,
      lineJoin: 'round'
    } );
    this.addChild( shadow );
    this.addChild( representation );

    // Move the shape as the model representation moves
    movableShape.positionProperty.link( function( position ) {
      representation.leftTop = position;
      shadow.leftTop = position.plus( SHADOW_OFFSET );
    } );

    // Derive the opacity of the shape from multiple properties on the model element.  Because the composite shape is
    // used to depict the overall shape when a shape is on the placement board, this element is invisible (opacity set
    // to zero) unless it is user controlled, animating, or fading.
    var mainShapeOpacityProperty = new DerivedProperty(
      [ movableShape.userControlledProperty, movableShape.animatingProperty, movableShape.fadeProportionProperty, movableShape.invisibleWhenStillProperty ],
      function( userControlled, animating, fadeProportion, invisibleWhenStill ) {
        if ( userControlled || animating ) {
          return 1;
        }
        else if ( fadeProportion > 0 ) {
          return 1 - fadeProportion;
        }
        else if ( !invisibleWhenStill ) {
          return 1;
        }
        else {
          return 0;
        }
      } );

    mainShapeOpacityProperty.link( function( opacity ) {
      self.opacity = opacity;
    } );

    var shadowVisibilityProperty = new DerivedProperty(
      [ movableShape.userControlledProperty, movableShape.animatingProperty ],
      function( userControlled, animating ) {
        return ( userControlled || animating );
      } );

    shadowVisibilityProperty.linkAttribute( shadow, 'visible' );

    movableShape.animatingProperty.link( function( animating ) {
      // To avoid certain complications, make it so that users can't grab this when it is moving.
      self.pickable = !animating;
    } );

    movableShape.fadeProportionProperty.link( function( fadeProportion ) {
      // To avoid certain complications, make it so that users can't grab this when it is fading.
      self.pickable = fadeProportion === 0;
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