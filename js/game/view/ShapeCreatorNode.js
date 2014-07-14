// Copyright 2002-2014, University of Colorado Boulder

/**
 * Type that represents a node that can be clicked upon to create new movable shapes in the model.
 *
 * TODO: Look at consolidating this with the creator nodes used in the 'Explore' screen.  They are separate as of this
 * writing but do pretty much the same thing.  The difficulty in doing this at first was that the creator node on
 * the first screen relied upon a model element, and we didn't want one in this case, since the nodes will be going on
 * a carousel.  I'm not sure why I did it that way in the explore view actually, since it doesn't seem important to
 * have a creator node in the model.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Grid = require( 'AREA_BUILDER/common/view/Grid' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableRectangle = require( 'AREA_BUILDER/common/model/MovableRectangle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  // constants
  var BORDER_LINE_WIDTH = 1;

  /**
   * @param shape
   * @param color
   * @param model
   * @param options
   * @constructor
   */
  function ShapeCreatorNode( shape, color, model, options ) {
    Node.call( this, { cursor: 'pointer' } );
    var self = this;

    options = _.extend( {
      gridSpacing: null
    }, options );

    // Create the node that the user will click upon to add a model element to the view.
    // TODO: Assert that path is at 0, 0
    var representation = new Path( shape, {
      fill: color,
      stroke: Color.toColor( color ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR ),
      lineWidth: BORDER_LINE_WIDTH
    } );
    this.addChild( representation );

    // Add grid if specified.
    if ( options.gridSpacing ) {
      var gridNode = new Grid(
          representation.bounds.minX + BORDER_LINE_WIDTH / 2,
          representation.bounds.minY + BORDER_LINE_WIDTH / 2,
          representation.bounds.width - BORDER_LINE_WIDTH,
          representation.bounds.height - BORDER_LINE_WIDTH,
        options.gridSpacing, {
          lineDash: [ 1, 4 ],
          stroke: 'black'
        }
      );
      this.addChild( gridNode );
    }

    // TODO: This will need to be reworked in order to support non-rectangular shapes, and triangles are currently part
    // of the design.  Consider passing through the shape to the constructor of the model element shape.  Kind of a
    // 'common currency' for creating both the view and model element.
    var rectangleSize = new Dimension2( shape.bounds.width, shape.bounds.height );

    // Add the listener that will allow the user to click on this and create a new shape, then position it in the model.
    var parentScreen = null; // needed for coordinate transforms
    var modelElement = null;
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
        var initialPosition = parentScreen.globalToLocalPoint( event.pointer.point ).plus( initialPositionOffset );

        // Create and add the new model element.
        modelElement = new MovableRectangle( rectangleSize, AreaBuilderSharedConstants.GREENISH_COLOR, initialPosition );
        modelElement.userControlled = true;
        model.addModelElement( modelElement );
      },

      translate: function( translationParams ) {
        modelElement.setDestination( modelElement.position.plus( translationParams.delta ) );
      },

      end: function( event, trail ) {
        modelElement.userControlled = false;
        modelElement = null;
      }
    } ) );

    // Pass options through to parent.
    this.mutate( options );
  }

  return inherit( Node, ShapeCreatorNode );
} );