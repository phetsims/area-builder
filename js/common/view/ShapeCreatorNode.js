// Copyright 2014-2017, University of Colorado Boulder

/**
 * A Scenery node that can be clicked upon to create new movable shapes in the model.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var areaBuilder = require( 'AREA_BUILDER/areaBuilder' );
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Color = require( 'SCENERY/util/Color' );
  var Grid = require( 'AREA_BUILDER/common/view/Grid' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var MovableShape = require( 'AREA_BUILDER/common/model/MovableShape' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var BORDER_LINE_WIDTH = 1;

  /**
   * @param {Shape} shape
   * @param {String || Color} color
   * @param {Function} addShapeToModel - A function for adding the created shape to the model
   * @param {Object} [options]
   * @constructor
   */
  function ShapeCreatorNode( shape, color, addShapeToModel, options ) {
    assert && assert( shape.bounds.minX === 0 && shape.bounds.minY === 0, 'Error: Shape is expected to be located at 0, 0' );
    Node.call( this, { cursor: 'pointer' } );
    var self = this;

    options = _.extend( {

      // Spacing of the grid, if any, that should be shown on the creator node.  Null indicates no grid.
      gridSpacing: null,

      // Max number of shapes that can be created by this node.
      creationLimit: Number.POSITIVE_INFINITY,

      // Drag bounds for the created shapes.
      shapeDragBounds: Bounds2.EVERYTHING,

      // This is a node that is or will be somewhere up the scene graph tree from this ShapeCreatorNode, doesn't move,
      // and whose parent has the coordinate frame needed to do the appropriate transformations when the a drag takes
      // place on this ShapeCreatorNode. This is needed in cases where the ShapeCreatorNode can be moved while a drag
      // of a created node is still in progress.  This can occur when the ShapeCreatorNode is placed on a carousel and
      // the sim is being used in a multi-touch environment.  See https://github.com/phetsims/area-builder/issues/95 for
      // more information.
      nonMovingAncestor: null
    }, options );

    // parameter check
    if ( options.creationLimit < Number.POSITIVE_INFINITY &&
         ( shape.bounds.width !== AreaBuilderSharedConstants.UNIT_SQUARE_LENGTH ||
           shape.bounds.height !== AreaBuilderSharedConstants.UNIT_SQUARE_LENGTH ) ) {
      // The ability to set a creation limit ONLY works for unit squares.  The reason for this is that non-unit shapes
      // are generally decomposed into unit squares when added to the placement board, so it's hard to track when they
      // get returned to their origin.  It would be possible to do this, but the requirements of the sim at the time of
      // this writing make it unnecessary.  So, if you're hitting this exception, the code may need to be revamped to
      // support creation limits for shapes that are not unit squares.
      throw new Error( 'Creation limit is only supported for unit squares.' );
    }

    // Create the node that the user will click upon to add a model element to the view.
    var representation = new Path( shape, {
      fill: color,
      stroke: Color.toColor( color ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR ),
      lineWidth: BORDER_LINE_WIDTH,
      lineJoin: 'round'
    } );
    this.addChild( representation );

    // Add grid if specified.
    if ( options.gridSpacing ) {
      var gridNode = new Grid( representation.bounds.dilated( -BORDER_LINE_WIDTH ), options.gridSpacing, {
        lineDash: [ 0, 3, 1, 0 ],
        stroke: 'black'
      } );
      this.addChild( gridNode );
    }

    var createdCountProperty = new Property( 0 ); // Used to track the number of shapes created and not returned.

    // If the created count exceeds the max, make this node invisible (which also makes it unusable).
    createdCountProperty.link( function( numCreated ) {
      self.visible = numCreated < options.creationLimit;
    } );

    // variables used by the drag handler
    var parentScreenView = null; // needed for coordinate transforms
    var movableShape = null;
    var shapePositionProperty = new Property( Vector2.ZERO );

    // Link the internal position property to the movable shape.
    shapePositionProperty.link( function( position ){
      if ( movableShape !== null ){
        movableShape.positionProperty.set( position );
      }
    } );

    // Adjust the drag bounds to compensate for the shape that that the entire shape will stay in bounds.
    var shapeDragBounds = options.shapeDragBounds.copy();
    shapeDragBounds.setMaxX( shapeDragBounds.maxX - shape.bounds.width );
    shapeDragBounds.setMaxY( shapeDragBounds.maxY - shape.bounds.height );

    // Add the listener that will allow the user to click on this and create a new shape, then position it in the model.
    this.addInputListener( new MovableDragHandler( shapePositionProperty, {

      dragBounds: shapeDragBounds,
      targetNode: options.nonMovingAncestor,

      // Allow moving a finger (touch) across this node to interact with it
      allowTouchSnag: true,

      startDrag: function( event, trail ) {
        if ( !parentScreenView ) {

          // Find the parent screen view by moving up the scene graph.
          var testNode = self;
          while ( testNode !== null ) {
            if ( testNode instanceof ScreenView ) {
              parentScreenView = testNode;
              break;
            }
            testNode = testNode.parents[ 0 ]; // move up the scene graph by one level
          }
          assert && assert( parentScreenView, 'unable to find parent screen view' );
        }

        // Determine the initial position of the new element as a function of the event position and this node's bounds.
        var upperLeftCornerGlobal = self.parentToGlobalPoint( self.leftTop );
        var initialPositionOffset = upperLeftCornerGlobal.minus( event.pointer.point );
        var initialPosition = parentScreenView.globalToLocalPoint( event.pointer.point.plus( initialPositionOffset ) );
        shapePositionProperty.value = initialPosition;

        // Create and add the new model element.
        movableShape = new MovableShape( shape, color, initialPosition );
        movableShape.userControlledProperty.set( true );
        addShapeToModel( movableShape );

        // If the creation count is limited, adjust the value and monitor the created shape for if/when it is returned.
        if ( options.creationLimit < Number.POSITIVE_INFINITY ) {
          // Use an IIFE to keep a reference of the movable shape in a closure.
          ( function() {
            createdCountProperty.value++;
            var localRefToMovableShape = movableShape;
            localRefToMovableShape.returnedToOriginEmitter.addListener( function returnedToOriginListener() {
              if ( !localRefToMovableShape.userControlledProperty.get() ) {
                // The shape has been returned to its origin.
                createdCountProperty.value--;
                localRefToMovableShape.returnedToOriginEmitter.removeListener( returnedToOriginListener );
              }
            } );
          } )();
        }
      },

      endDrag: function( event, trail ) {
        movableShape.userControlledProperty.set( false );
        movableShape = null;
      }
    } ) );

    // Pass options through to parent.
    this.mutate( options );
  }

  areaBuilder.register( 'ShapeCreatorNode', ShapeCreatorNode );

  return inherit( Node, ShapeCreatorNode );
} );