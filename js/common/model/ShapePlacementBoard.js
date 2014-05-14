// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model of a rectangular board (like a white board or bulletin board) upon
 * which various smaller shapes can be placed.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );

  function ShapePlacementBoard( size, unitSquareLength, initialPosition ) {

    this.unitSquareLength = unitSquareLength; // @public

    // The size should be an integer number of unit squares for both dimensions.
    assert && assert( size.width / unitSquareLength === 0 && size.height / unitSquareLength === 0, 'ShapePlacementBoard dimensions must be integral numbers of unit square dimensions' );

    PropertySet.call( this, {

      // Position of the upper left corner of the board
      position: initialPosition,

      // Boolean property that controls whether or not the placement grid is visible
      gridVisible: false
    } );

    // Non-dynamic properties that are externally visible
    this.size = size; // @public
  }

  return inherit( PropertySet, ShapePlacementBoard, {
    //TODO prototypes
  } );
} );