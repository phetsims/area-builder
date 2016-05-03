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

  var getQueryParameter = phet.chipper.getQueryParameter;

  var AreaBuilderQueryParameters = {

    // fill the shape placement boards on the 'Explore' screen during startup, useful for testing
    PREFILL_BOARDS: !!getQueryParameter( 'prefillBoards' )
  };

  areaBuilder.register( 'AreaBuilderQueryParameters', AreaBuilderQueryParameters );

  return AreaBuilderQueryParameters;
} );
