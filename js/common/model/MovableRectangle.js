// Copyright 2002-2014, University of Colorado Boulder

/**
 * Type that defines a rectangle that can be moved by the user and placed on
 * the placement boards.
 *
 * TODO: If other shapes, such as triangles, are added to the simulation, this
 * class should be split into a base class and a set of subclasses.
 */


define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  function MovableRectangle( size, color, initialPosition ) {
    var self = this;

    PropertySet.call( this, {

      // Position property.  In general, this should not be set directly, and
      // should only be manipulated through the methods below.
      position: initialPosition,

      userControlled: false,
      animating: false // Read only, do not set externally.
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
    this.shape = Shape.rect( 0, 0, size.width, size.height ); // @public
    this.color = color; // @public
  }

  return inherit( PropertySet, MovableRectangle, {

    step: function( dt ) {
      if ( !this.userControlled ) {
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
    }
  } );
} );