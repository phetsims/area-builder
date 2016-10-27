// Copyright 2016, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var areaBuilder = require( 'AREA_BUILDER/areaBuilder' );

  var AreaBuilderQueryParameters = QueryStringMachine.getAll( {

    // fill the shape placement boards on the 'Explore' screen during startup, useful for testing
    prefillBoards: { type: 'flag' }
  } );

  areaBuilder.register( 'AreaBuilderQueryParameters', AreaBuilderQueryParameters );

  return AreaBuilderQueryParameters;
} );
