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
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Shape = require( 'KITE/Shape' );

  function MovableRectangle( size, color, initialPosition ) {
    PropertySet.call( this, {
      position: initialPosition,
      userControlled: false
    } );

    // Non-dynamic attributes
    this.shape = Shape.rect( 0, 0, size.width, size.height ); // @public
    this.color = color; // @public

  }

  return inherit( PropertySet, MovableRectangle, {
    //TODO prototypes
  } );
} );