// Copyright 2016-2025, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author John Blanco
 */

import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';
import areaBuilder from '../areaBuilder.js';

const AreaBuilderQueryParameters = QueryStringMachine.getAll( {

  // fill the shape placement boards on the 'Explore' screen during startup, useful for testing
  prefillBoards: { type: 'flag' }
} );

areaBuilder.register( 'AreaBuilderQueryParameters', AreaBuilderQueryParameters );
export default AreaBuilderQueryParameters;