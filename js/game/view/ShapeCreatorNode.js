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
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  /**
   * @param shape
   * @param color
   * @param createModelElementFunction
   * @constructor
   */
  function ShapeCreatorNode( shape, color, createModelElementFunction, options ) {
    Node.call( this, { cursor: 'pointer' } );

    // Create the node that the user will click upon to add a model element to the view.
    var representation = new Path( shape, {
      fill: color,
      stroke: Color.toColor( color ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR )
    } );
    this.addChild( representation );

    // Add the listener that will allow the user to click on this and create a new shape, then position it in the model.
    var modelElement = null;
    this.addInputListener( new SimpleDragHandler( {
      // Allow moving a finger (touch) across this node to interact with it
      allowTouchSnag: true,

      start: function( event, trail ) {
        modelElement = createModelElementFunction();
      },
      translate: function( translationParams ) {
        modelElement.position = modelElement.position.plus( translationParams.delta );
      },
      end: function( event, trail ) {
        modelElement = null;
      }
    } ) );

    // Pass options through to parent.
    this.mutate( options );
  }

  return inherit( Node, ShapeCreatorNode );
} );