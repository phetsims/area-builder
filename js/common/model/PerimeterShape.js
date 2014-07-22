// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model element that describes a shape in terms of 'perimeter points', both exterior and interior (so that holes can
 * be defined).  The shape is defined by straight lines drawn from each point to the next.
 */
define( function( require ) {
  'use strict';

  /**
   * @param {Array<Array<Vector2>>} exteriorPerimeters An array of perimeters, each of which is a sequential array of
   * points.
   * @param {Array<Array<Vector2>>} interiorPerimeters An array of perimeters, each of which is a sequential array of
   * points. Each interior perimeter must be fully contained within an exterior perimeter.
   * @constructor
   */
  function PerimeterShape( exteriorPerimeters, interiorPerimeters ) {
    this.exteriorPerimeters = exteriorPerimeters;
    this.interiorPerimeters = interiorPerimeters;
  }

  return PerimeterShape;
} );