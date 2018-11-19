// Copyright 2014-2018, University of Colorado Boulder

/**
 * Type that defines a shape that can be moved by the user and placed on the shape placement boards.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var areaBuilder = require( 'AREA_BUILDER/areaBuilder' );
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Color = require( 'SCENERY/util/Color' );
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var FADE_RATE = 2; // proportion per second

  /**
   * @param {Shape} shape
   * @param {Color || string} color
   * @param {Vector2} initialPosition
   * @constructor
   */
  function MovableShape( shape, color, initialPosition ) {
    var self = this;

    // Property that indicates where in model space the upper left corner of this shape is.  In general, this should
    // not be set directly outside of this type, and should only be manipulated through the methods defined below.
    this.positionProperty = new Property( initialPosition );

    // Flag that tracks whether the user is dragging this shape around.  Should be set externally ; generally by the a
    // view node.
    this.userControlledProperty = new Property( false );

    // Flag that indicates whether this element is animating from one location to another ; should not be set externally.
    this.animatingProperty = new Property( false, {
      reentrant: true
    } );

    // Value that indicates how faded out this shape is.  This is used as part of a feature where shapes can fade
    // out.  Once fade has started ; it doesn't stop until it is fully faded ; i.e. the value is 1.  This should not be
    // set externally.
    this.fadeProportionProperty = new Property( 0 );

    // A flag that indicates whether this individual shape should become invisible when it is done animating.  This
    // is generally used in cases where it becomes part of a larger composite shape that is depicted instead.
    this.invisibleWhenStillProperty = new Property( true );

    // Destination is used for animation, and should be set through accessor methods only.
    this.destination = initialPosition.copy(); // @private

    // Emit an event whenever this shape returns to its original position.
    this.returnedToOriginEmitter = new Emitter();
    this.positionProperty.lazyLink( function( position ) {
      if ( position.equals( initialPosition ) ) {
        self.returnedToOriginEmitter.emit();
      }
    } );

    // Non-dynamic attributes
    this.shape = shape; // @public, read only
    this.color = Color.toColor( color ); // @public

    // Internal vars
    this.fading = false; // @private
  }

  areaBuilder.register( 'MovableShape', MovableShape );

  return inherit( Object, MovableShape, {

    step: function( dt ) {
      if ( !this.userControlledProperty.get() ) {

        // perform any animation
        var currentPosition = this.positionProperty.get();
        var distanceToDestination = currentPosition.distance( this.destination );
        if ( distanceToDestination > dt * AreaBuilderSharedConstants.ANIMATION_SPEED ) {
          // Move a step toward the destination.
          var stepAngle = Math.atan2( this.destination.y - currentPosition.y, this.destination.x - currentPosition.x );
          var stepVector = Vector2.createPolar( AreaBuilderSharedConstants.ANIMATION_SPEED * dt, stepAngle );
          this.positionProperty.set( currentPosition.plus( stepVector ) );
        }
        else if ( this.animatingProperty.get() ) {
          // Less than one time step away, so just go to the destination.
          this.positionProperty.set( this.destination );
          this.animatingProperty.set( false );
        }

        // perform any fading
        if ( this.fading ) {
          this.fadeProportionProperty.set( Math.min( 1, this.fadeProportionProperty.get() + ( dt * FADE_RATE ) ) );
          if ( this.fadeProportionProperty.get() >= 1 ) {
            this.fading = false;
          }
        }
      }
    },

    /**
     * Set the destination for this shape.
     * @param {Vector2} destination
     * @param {boolean} animate
     */
    setDestination: function( destination, animate ) {
      this.destination = destination;
      if ( animate ) {
        this.animatingProperty.set( true );
      }
      else {
        this.animatingProperty.set( false );
        this.positionProperty.set( this.destination );
      }
    },

    /**
     * Return the shape to the place where it was originally created.
     * @param {boolean} animate
     */
    returnToOrigin: function( animate ) {
      this.setDestination( this.positionProperty.initialValue, animate );
    },

    fadeAway: function() {
      this.fading = true;
      this.fadeProportionProperty.set( 0.0001 ); // this is done to make sure the shape is made unpickable as soon as fading starts
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
      assert && assert( this.shape.bounds.width % squareLength === 0 && this.shape.bounds.height % squareLength === 0,
        'Error: A dimension of this movable shape is not an integer multiple of the provided dimension' );
      var shapes = [];
      var unitSquareShape = Shape.rect( 0, 0, squareLength, squareLength );
      for ( var column = 0; column < this.shape.bounds.width; column += squareLength ) {
        for ( var row = 0; row < this.shape.bounds.height; row += squareLength ) {
          var constituentShape = new MovableShape( unitSquareShape, this.color, this.positionProperty.initialValue );
          constituentShape.setDestination( this.positionProperty.get().plusXY( column, row ), false );
          constituentShape.invisibleWhenStillProperty.set( this.invisibleWhenStillProperty.get() );
          shapes.push( constituentShape );
        }
      }
      return shapes;
    }
  } );
} );