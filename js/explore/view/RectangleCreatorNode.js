// Copyright 2002-2014, University of Colorado Boulder

/**
 * Type that represents a node that can be clicked on to create new movable
 * rectangles.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  /**
   * @param {RectangleCreator} rectangleCreator
   * @constructor
   */
  function RectangleCreatorNode( rectangleCreator ) {
    Node.call( this, { cursor: 'pointer' } );
    this.color = rectangleCreator.color; // @public

    // Create the node that will visually represent this model element in the view.
    var representation = new Rectangle( 0, 0, rectangleCreator.size.width, rectangleCreator.size.height, 0, 0, {
      fill: rectangleCreator.color,
      stroke: Color.toColor( rectangleCreator.color ).colorUtilsDarker( 0.4 ),
      lineWidth: 2
    } );
    this.addChild( representation );

    // Set position, can't be done in options for Scenery 0.1.  TODO: Move this into path creation when migration to Scenery 0.2 happens.
    representation.leftTop = rectangleCreator.position;

    // Add the listener that will allow the user to click on this and create
    // a new shape, then position it in the model.
    this.addInputListener( new SimpleDragHandler( {
      // Allow moving a finger (touch) across this node to interact with it
      allowTouchSnag: true,

      start: function( event, trail ) {
        rectangleCreator.createModelInstance();
      },
      translate: function( translationParams ) {
        rectangleCreator.moveActiveModelInstance( translationParams.delta );
      },
      end: function( event, trail ) {
        rectangleCreator.releaseModelInstance();
      }
    } ) );
  }

  return inherit( Node, RectangleCreatorNode );
} );