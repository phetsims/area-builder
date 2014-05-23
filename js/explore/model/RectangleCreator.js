// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model element that is stationary in the model and can be clicked on in the
 * view in order to add similar looking new model elements to the model.  This
 * is often used to create the illusion of dragging items from a bucket or
 * carousel.
 */
define( function( require ) {
  'use strict';

  // modules
  var MovableRectangle = require( 'AREA_BUILDER/common/model/MovableRectangle' );

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

  RectangleCreator.prototype = {

    createModelInstance: function() {
      assert && assert( this.activeModelInstance === null, 'Should not be creating a new instance until existing instance is released.' );
      this.activeModelInstance = new MovableRectangle( this.size, this.color, this.position );
      this.activeModelInstance.userControlled = true;
      this.addToModelFunction( this.activeModelInstance );
    },

    moveActiveModelInstance: function( delta ) {
      assert && assert( this.activeModelInstance !== null, 'Attempted to move an instance that doesn\'t exist or has been released.' );
      if ( this.activeModelInstance !== null ) {
        this.activeModelInstance.position = this.activeModelInstance.position.plus( delta );
      }
    },

    releaseModelInstance: function() {
      this.activeModelInstance.userControlled = false;
      this.activeModelInstance = null;
    }
  };

  return RectangleCreator;
} );