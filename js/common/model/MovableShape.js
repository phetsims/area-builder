// Copyright 2002-2014, University of Colorado Boulder

/**
 * Type that defines a shape that can be moved by the user and placed on the shape placement boards.
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var FADE_RATE = 2; // proportion per second

  /**
   * @param {Shape} shape
   * @param {Color || String} color
   * @param {Vector2} initialPosition
   * @constructor
   */
  function MovableShape( shape, color, initialPosition ) {
    var self = this;

    PropertySet.call( this, {

      // Property that indicates where in model space the upper left corner
      // of this shape is.  In general, this should not be set directly
      // outside of this type, and should only be manipulated through the
      // methods defined below.
      position: initialPosition,

      // Flag that tracks whether the user is dragging this shape around.  Can
      // should be set externally, generally by the a view node.
      userControlled: false,

      // Flag that indicates whether this element is animating from one
      // location to another, should not be set externally.
      animating: false,

      // Value that indicates how faded out this shape is.  This is used as
      // part of a feature where shapes can fade out.  Once fade has started,
      // it doesn't stop until it is fully faded, i.e. the value is 1.  This
      // should not be set externally.
      fadeProportion: 0,

      // A flag that indicates whether this individual shape should become
      // invisible when it is done animating.  This is generally used in cases
      // where it becomes part of a larger composite shape that is depicted
      // instead.
      invisibleWhenStill: true
    } );

    // Destination is used for animation, and should be set through accessor methods only.
    this.destination = initialPosition.copy(); // @private

    // Trigger an event whenever this shape returns to its original position.
    this.positionProperty.lazyLink( function( position ) {
      if ( position.equals( initialPosition ) ) {
        self.trigger( 'returnedHome' );
      }
    } );

    // Non-dynamic attributes
    this.shape = shape; // @public
    this.color = Color.toColor( color ); // @public

    // Internal vars
    this.fading = false; // @private
  }

  return inherit( PropertySet, MovableShape, {

    step: function( dt ) {
      if ( !this.userControlled ) {

        // perform any animation
        var distanceToDestination = this.position.distance( this.destination );
        if ( distanceToDestination > dt * AreaBuilderSharedConstants.ANIMATION_VELOCITY ) {
          // Move a step toward the destination.
          var stepAngle = Math.atan2( this.destination.y - this.position.y, this.destination.x - this.position.x );
          var stepVector = Vector2.createPolar( AreaBuilderSharedConstants.ANIMATION_VELOCITY * dt, stepAngle );
          this.position = this.position.plus( stepVector );
        }
        else if ( this.animating ) {
          // Less than one time step away, so just go to the destination.
          this.position = this.destination;
          this.animating = false;
        }

        // perform any fading
        if ( this.fading ) {
          this.fadeProportion = Math.min( 1, this.fadeProportion + ( dt * FADE_RATE ) );
          if ( this.fadeProportion >= 1 ) {
            // Return to origin when fully faded.
            //TODO: (see issue #27) This is a bit inelegant, since I am basically relying on the idea that the model
            // will delete this when it goes home, which isn't obvious.  As noted elsewhere, I should consider a better
            // scheme for signalling that a shape should be discarded.
            this.goHome( false );
            this.fading = false;
          }
        }
      }
    },

    setDestination: function( destination, animate ) {
      this.destination = destination;
      if ( animate ) {
        this.animating = true;
      }
      else {
        this.position = destination;
      }
    },

    goHome: function( animate ) {
      this.setDestination( this.positionProperty.initialValue, animate );
    },

    fadeAway: function() {
      this.fading = true;
    },

    /**
     * Returns a set of squares that are of the specified size and are positioned correctly such that they collectively
     * make up the same shape as this rectangle.  The specified length must be an integer value of the length and
     * width or things will get weird.
     *
     * NOTE: This only works properly for rectangular shapes!
     *
     * @public
     * @param squareLength
     */
    decomposeIntoSquares: function( squareLength ) {
      assert && assert( this.shape.bounds.width % squareLength === 0 && this.shape.bounds.height % squareLength === 0, 'Error: A dimension of this movable shape is not an integer multiple of the provided dimension' );
      var shapes = [];
      var unitSquareShape = Shape.rect( 0, 0, squareLength, squareLength );
      for ( var column = 0; column < this.shape.bounds.width; column += squareLength ) {
        for ( var row = 0; row < this.shape.bounds.height; row += squareLength ) {
          var constituentShape = new MovableShape( unitSquareShape, this.color, this.positionProperty.initialValue );
          constituentShape.setDestination( this.position.plusXY( column, row ), false );
          constituentShape.invisibleWhenStill = this.invisibleWhenStill;
          shapes.push( constituentShape );
        }
      }
      return shapes;
    }
  } );
} );