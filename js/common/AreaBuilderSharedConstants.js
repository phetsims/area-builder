// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  return {
    // Colors used for the various shapes
    GREENISH_COLOR: '#33E16E',
    PURPLISH_COLOR: '#9D87C9',
    ORANGISH_COLOR: '#E78B5D',
    PERIMETER_DARKEN_FACTOR: 0.6, // The amount that the perimeter colors are darkened from the main shape color

    // Velocity at which animated elements move
    ANIMATION_VELOCITY: 200, // In screen coordinates per second

    // Various other constants
    CONTROL_PANEL_BACKGROUND_COLOR: 'rgb( 254, 241, 233 )',
    BACKGROUND_SHAPE_COLOR: 'rgb( 0, 113, 189 )',

    UNIT_SQUARE_LENGTH: 35 // In screen coordinates, used in several places
  };
} );