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
  var Grid = require( 'AREA_BUILDER/common/view/Grid' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var SHADOW_COLOR = 'rgba( 50, 50, 50, 0.5 )';
  var SHADOW_OFFSET = new Vector2( 5, 5 );
  var OPACITY_OF_TRANSLUCENT_SHAPES = 0.65; // Value empirically determined.
  var UNIT_LENGTH = AreaBuilderSharedConstants.UNIT_SQUARE_LENGTH;
  var BORDER_LINE_WIDTH = 1;

  /**
   * @param {MovableShape} movableShape
   * @constructor
   */
  function ShapeNode( movableShape ) {
    Node.call( this, { cursor: 'pointer' } );
    var self = this;
    this.color = movableShape.color; // @public

    // Set up the mouse and touch areas for this node so that this can still be grabbed when invisible.
    this.touchArea = movableShape.shape;
    this.mouseArea = movableShape.shape;

    // Set up a root node whose visibility and opacity will be manipulated below.
    var rootNode = new Node();
    this.addChild( rootNode );

    // Create the shadow
    var shadow = new Path( movableShape.shape, {
      fill: SHADOW_COLOR,
      leftTop: SHADOW_OFFSET
    } );
    rootNode.addChild( shadow );

    // Create the primary representation
    var representation = new Path( movableShape.shape, {
      fill: movableShape.color,
      stroke: Color.toColor( movableShape.color ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR ),
      lineWidth: 1,
      lineJoin: 'round'
    } );
    rootNode.addChild( representation );

    // Add the grid
    representation.addChild( new Grid( representation.bounds.dilated( -BORDER_LINE_WIDTH ), UNIT_LENGTH, { lineDash: [ 0, 3, 1, 0 ], stroke: 'black' } ) );

    // Move this node as the model representation moves
    movableShape.positionProperty.link( function( position ) {
      self.leftTop = position;
    } );

    // Because a composite shape is often used to depict the overall shape when a shape is on the placement board, this
    // element may become invisible unless it is user controlled, animating, or fading.
    var visibleProperty = new DerivedProperty( [
        movableShape.userControlledProperty,
        movableShape.animatingProperty,
        movableShape.fadeProportionProperty,
        movableShape.invisibleWhenStillProperty ],
      function( userControlled, animating, fadeProportion, invisibleWhenStill ) {
        return ( userControlled || animating || fadeProportion > 0 || !invisibleWhenStill );
      } );

    // Opacity is also a derived property, range is 0 to 1.
    var opacityProperty = new DerivedProperty( [
        movableShape.userControlledProperty,
        movableShape.animatingProperty,
        movableShape.fadeProportionProperty ],
      function( userControlled, animating, fadeProportion ) {
        if ( userControlled || animating ) {
          // The shape is either being dragged by the user or is moving to a location, so should be fully opaque.
          return 1;
        }
        else if ( fadeProportion > 0 ) {
          // The shape is fading away.
          return 1 - fadeProportion;
        }
        else {
          // The shape is not controlled by the user, animated, or fading, so it is most likely placed on the board.
          // If it is visible, it will be translucent, since some of the games use shapes in this state to place over
          // other shapes for comparative purposes.
          return OPACITY_OF_TRANSLUCENT_SHAPES;
        }
      }
    );

    opacityProperty.link( function( opacity ) {
      rootNode.opacity = opacity;
    } );

    visibleProperty.link( function( visible ) {
      rootNode.visible = visible;
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

  return inherit( Node, ShapeNode );
} );