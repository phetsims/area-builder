// Copyright 2016-2019, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const areaBuilder = require( 'AREA_BUILDER/areaBuilder' );

  const AreaBuilderQueryParameters = QueryStringMachine.getAll( {

    // fill the shape placement boards on the 'Explore' screen during startup, useful for testing
    prefillBoards: { type: 'flag' }
  } );

  areaBuilder.register( 'AreaBuilderQueryParameters', AreaBuilderQueryParameters );

  return AreaBuilderQueryParameters;
} );
