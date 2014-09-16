// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var ScreenView = require( 'JOIST/ScreenView' );
  var Bounds2 = require( 'DOT/Bounds2' );


  return {
    // Layout bounds used throughout the simulation for laying out the screens.
    LAYOUT_BOUNDS: new Bounds2( 0, 0, 768, 464 ),

    // Colors used for the various shapes
    GREENISH_COLOR: '#33E16E',
    DARK_GREEN_COLOR: '#1A7137',
    PURPLISH_COLOR: '#9D87C9',
    DARK_PURPLE_COLOR: '#634F8C',
    ORANGISH_COLOR: '#FFA64D',
    ORANGE_BROWN_COLOR: '#A95327',
    PALE_BLUE_COLOR: '#5DB9E7',
    DARK_BLUE_COLOR: '#277DA9',
    PINKISH_COLOR: '#E88DC9',
    PURPLE_PINK_COLOR: '#AA548D',
    PERIMETER_DARKEN_FACTOR: 0.6, // The amount that the perimeter colors are darkened from the main shape color

    // Velocity at which animated elements move
    ANIMATION_VELOCITY: 200, // In screen coordinates per second

    // Various other constants
    CONTROL_PANEL_BACKGROUND_COLOR: 'rgb( 254, 241, 233 )',

    UNIT_SQUARE_LENGTH: 32 // In screen coordinates, used in several places
  };
} );