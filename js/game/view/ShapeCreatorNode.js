// Copyright 2002-2014, University of Colorado Boulder

/**
 * Type that represents a node that can be clicked upon to create new movable shapes in the model.
 *
 * TODO: Look at consolidating this with the creator nodes used in the 'Explore' screen.  They are separate as of this
 * writing but do pretty much the same thing.  The difficulty in doing this at first was that the creator node on
 * the first screen relied upon a model element, and we didn't want one in this case, since the nodes will be going on
 * a carousel.  I'm not sure why I did it that way in the explore view actually.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableRectangle = require( 'AREA_BUILDER/common/model/MovableRectangle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

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

    // Create the node that the user will click upon to add a model element to the view.
    var representation = new Path( shape, {
      fill: color,
      stroke: Color.toColor( color ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR )
    } );
    this.addChild( representation );

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
        // Move up the scene graph until the parent screen is found.
        var testNode = self;
        while ( testNode !== null ) {
          if ( testNode instanceof ScreenView ) {
            parentScreen = testNode;
            break;
          }
          testNode = testNode.parents[0]; // Move up the scene graph by one level
        }

        debugger;
        modelElement = new MovableRectangle( rectangleSize, AreaBuilderSharedConstants.GREENISH_COLOR, parentScreen.localToGlobalPoint( self.center ) );
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