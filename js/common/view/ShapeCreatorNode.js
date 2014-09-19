// Copyright 2002-2014, University of Colorado Boulder

/**
 * Type that represents a node that can be clicked upon to create new movable shapes in the model.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Color = require( 'SCENERY/util/Color' );
  var Grid = require( 'AREA_BUILDER/common/view/Grid' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableShape = require( 'AREA_BUILDER/common/model/MovableShape' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

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
      creationLimit: Number.POSITIVE_INFINITY

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
      var gridNode = new Grid( representation.bounds.dilated( -BORDER_LINE_WIDTH ), options.gridSpacing, { lineDash: [ 2, 4 ], stroke: 'black' } );
      this.addChild( gridNode );
    }

    var createdCount = new Property( 0 ); // Used to track the number of shapes created and not returned.

    // If the created count exceeds the max, make this node invisible (which also makes it unusable).
    createdCount.link( function( numCreated ) {
      self.visible = numCreated < options.creationLimit;
    } );

    // Add the listener that will allow the user to click on this and create a new shape, then position it in the model.
    //REVIEW why are parentScreen and movableShape defined here? they are used only inside the SimpleDragHandler.
    //REVIEW consider factoring this out into an inner subtype of SimpleDragHandler
    var parentScreen = null; // needed for coordinate transforms
    var movableShape = null;
    this.addInputListener( new SimpleDragHandler( {
      // Allow moving a finger (touch) across this node to interact with it
      allowTouchSnag: true,

      start: function( event, trail ) {

        // Find the parent screen by moving up the scene graph.
        var testNode = self;
        while ( testNode !== null ) {
          if ( testNode instanceof ScreenView ) {
            parentScreen = testNode;
            break;
          }
          testNode = testNode.parents[0]; // Move up the scene graph by one level
        }

        // Determine the initial position of the new element as a function of the event position and this node's bounds.
        var upperLeftCornerGlobal = self.parentToGlobalPoint( self.leftTop );
        var initialPositionOffset = upperLeftCornerGlobal.minus( event.pointer.point );
        var initialPosition = parentScreen.globalToLocalPoint( event.pointer.point.plus( initialPositionOffset ) );

        // Create and add the new model element.
        movableShape = new MovableShape( shape, color, initialPosition );
        movableShape.userControlled = true;
        addShapeToModel( movableShape );

        // If the creation count is limited, adjust the value and monitor the created shape for if/when it is returned.
        if ( options.creationLimit < Number.POSITIVE_INFINITY ) {
          // Use an IIFE to keep a reference of the movable shape in a closure.
          (function() {
            createdCount.value++;
            var localRefToMovableShape = movableShape;
            localRefToMovableShape.on( 'returnedHome', function returnedToOriginListener() {
              if ( !localRefToMovableShape.userControlled ) {
                // The shape has been returned to its origin.
                createdCount.value--;
                localRefToMovableShape.off( 'returnedHome', returnedToOriginListener );
              }
            } );
          })();
        }
      },

      translate: function( translationParams ) {
        movableShape.setDestination( movableShape.position.plus( translationParams.delta ) );
      },

      end: function( event, trail ) {
        movableShape.userControlled = false;
        movableShape = null;
      }
    } ) );

    // Pass options through to parent.
    this.mutate( options );
  }

  return inherit( Node, ShapeCreatorNode );
} );