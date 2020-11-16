// Copyright 2014-2020, University of Colorado Boulder

/**
 * Type that represents a movable shape in the view.
 *
 * @author John Blanco
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import MovableDragHandler from '../../../../scenery-phet/js/input/MovableDragHandler.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Color from '../../../../scenery/js/util/Color.js';
import areaBuilder from '../../areaBuilder.js';
import AreaBuilderSharedConstants from '../AreaBuilderSharedConstants.js';
import Grid from './Grid.js';

// constants
const SHADOW_COLOR = 'rgba( 50, 50, 50, 0.5 )';
const SHADOW_OFFSET = new Vector2( 5, 5 );
const OPACITY_OF_TRANSLUCENT_SHAPES = 0.65; // Value empirically determined.
const UNIT_LENGTH = AreaBuilderSharedConstants.UNIT_SQUARE_LENGTH;
const BORDER_LINE_WIDTH = 1;

class ShapeNode extends Node {

  /**
   * @param {MovableShape} movableShape
   * @param {Bounds2} dragBounds
   */
  constructor( movableShape, dragBounds ) {
    super( { cursor: 'pointer' } );
    const self = this;
    this.color = movableShape.color; // @public

    // Set up the mouse and touch areas for this node so that this can still be grabbed when invisible.
    this.touchArea = movableShape.shape;
    this.mouseArea = movableShape.shape;

    // Set up a root node whose visibility and opacity will be manipulated below.
    const rootNode = new Node();
    this.addChild( rootNode );

    // Create the shadow
    const shadow = new Path( movableShape.shape, {
      fill: SHADOW_COLOR,
      leftTop: SHADOW_OFFSET
    } );
    rootNode.addChild( shadow );

    // Create the primary representation
    const representation = new Path( movableShape.shape, {
      fill: movableShape.color,
      stroke: Color.toColor( movableShape.color ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR ),
      lineWidth: 1,
      lineJoin: 'round'
    } );
    rootNode.addChild( representation );

    // Add the grid
    representation.addChild( new Grid( representation.bounds.dilated( -BORDER_LINE_WIDTH ), UNIT_LENGTH, {
      lineDash: [ 0, 3, 1, 0 ],
      stroke: 'black'
    } ) );

    // Move this node as the model representation moves
    movableShape.positionProperty.link( position => {
      this.leftTop = position;
    } );

    // Because a composite shape is often used to depict the overall shape when a shape is on the placement board, this
    // element may become invisible unless it is user controlled, animating, or fading.
    const visibleProperty = new DerivedProperty( [
        movableShape.userControlledProperty,
        movableShape.animatingProperty,
        movableShape.fadeProportionProperty,
        movableShape.invisibleWhenStillProperty ],
      ( userControlled, animating, fadeProportion, invisibleWhenStill ) => userControlled || animating || fadeProportion > 0 || !invisibleWhenStill );

    // Opacity is also a derived property, range is 0 to 1.
    const opacityProperty = new DerivedProperty( [
        movableShape.userControlledProperty,
        movableShape.animatingProperty,
        movableShape.fadeProportionProperty ],
      ( userControlled, animating, fadeProportion ) => {
        if ( userControlled || animating ) {
          // The shape is either being dragged by the user or is moving to a position, so should be fully opaque.
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

    opacityProperty.link( opacity => {
      rootNode.opacity = opacity;
    } );

    visibleProperty.link( visible => {
      rootNode.visible = visible;
    } );

    const shadowVisibilityProperty = new DerivedProperty(
      [ movableShape.userControlledProperty, movableShape.animatingProperty ],
      ( userControlled, animating ) => userControlled || animating );

    shadowVisibilityProperty.linkAttribute( shadow, 'visible' );

    function updatePickability() {
      // To avoid certain complications, this node should not be pickable if it is animating or fading.
      self.pickable = !movableShape.animatingProperty.get() && movableShape.fadeProportionProperty.get() === 0;
    }

    movableShape.animatingProperty.link( () => {
      updatePickability();
    } );

    movableShape.fadeProportionProperty.link( fadeProportion => {
      updatePickability();
    } );

    // Adjust the drag bounds to compensate for the shape that that the entire shape will stay in bounds.
    const shapeDragBounds = new Bounds2(
      dragBounds.minX,
      dragBounds.minY,
      dragBounds.maxX - movableShape.shape.bounds.width,
      dragBounds.maxY - movableShape.shape.bounds.height
    );

    // Add the listener that will allow the user to drag the shape around.
    this.addInputListener( new MovableDragHandler( movableShape.positionProperty, {

      dragBounds: shapeDragBounds,

      // Allow moving a finger (touch) across a node to pick it up.
      allowTouchSnag: true,

      startDrag: ( event, trail ) => {
        movableShape.userControlledProperty.set( true );
      },

      endDrag: ( event, trail ) => {
        movableShape.userControlledProperty.set( false );
      }
    } ) );
  }
}

areaBuilder.register( 'ShapeNode', ShapeNode );
export default ShapeNode;