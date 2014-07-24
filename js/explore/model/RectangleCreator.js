// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model element that is stationary in the model and can be clicked on in the view in order to add similar looking new
 * model elements to the model.  This is often used to create the illusion of dragging items from a bucket or carousel.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableShape = require( 'AREA_BUILDER/common/model/MovableShape' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param size
   * @param position
   * @param color
   * @param addToModelFunction
   * @constructor
   */
  function RectangleCreator( size, position, color, addToModelFunction ) {
    this.size = size;
    this.position = position;
    this.color = color;
    this.addToModelFunction = addToModelFunction;
    this.activeModelInstance = null;
  }

  return inherit( Object, RectangleCreator, {

    createModelInstance: function() {
      assert && assert( this.activeModelInstance === null, 'Should not be creating a new instance until existing instance is released.' );
      this.activeModelInstance = new MovableShape( Shape.rect( 0, 0, this.size.width, this.size.height ), this.color, this.position );
      this.activeModelInstance.userControlled = true;
      this.addToModelFunction( this.activeModelInstance );
    },

    moveActiveModelInstance: function( delta ) {
      assert && assert( this.activeModelInstance !== null, 'Attempted to move an instance that doesn\'t exist or has been released.' );
      if ( this.activeModelInstance !== null ) {
        this.activeModelInstance.setDestination( this.activeModelInstance.position.plus( delta ), false );
      }
    },

    releaseModelInstance: function() {
      this.activeModelInstance.userControlled = false;
      this.activeModelInstance = null;
    }
  } );
} );