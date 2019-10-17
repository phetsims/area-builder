// Copyright 2014-2019, University of Colorado Boulder

/**
 * A Scenery node that depicts a grid with squares on it.  This is used in several places in the simulation to create
 * icons that look like the things that the user might create when using the simulation.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const areaBuilder = require( 'AREA_BUILDER/areaBuilder' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Color = require( 'SCENERY/util/Color' );
  const Grid = require( 'AREA_BUILDER/common/view/Grid' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {number} columns
   * @param {number} rows
   * @param {number} cellLength
   * @param {string} shapeFillColor
   * @param {Array<Vector2>} occupiedCells
   * @param {Object} [options]
   * @constructor
   */
  function GridIcon( columns, rows, cellLength, shapeFillColor, occupiedCells, options ) {

    Node.call( this );
    const self = this;

    options = merge( {
      // defaults
      gridStroke: 'black',
      gridLineWidth: 1,
      backgroundStroke: null,
      backgroundFill: 'white',
      backgroundLineWidth: 1,
      shapeStroke: new Color( shapeFillColor ).colorUtilsDarker( 0.2 ), // darkening factor empirically determined
      shapeLineWidth: 1
    }, options );

    this.addChild( new Rectangle( 0, 0, columns * cellLength, rows * cellLength, 0, 0, {
      fill: options.backgroundFill,
      stroke: options.backgroundStroke,
      lineWidth: options.backgroundLineWidth
    } ) );

    this.addChild( new Grid( new Bounds2( 0, 0, columns * cellLength, rows * cellLength ), cellLength, {
      stroke: options.gridStroke,
      lineWidth: options.gridLineWidth,
      fill: options.gridFill
    } ) );

    occupiedCells.forEach( function( occupiedCell ) {
      self.addChild( new Rectangle( 0, 0, cellLength, cellLength, 0, 0, {
        fill: shapeFillColor,
        stroke: options.shapeStroke,
        lineWidth: options.shapeLineWidth,
        left: occupiedCell.x * cellLength,
        top: occupiedCell.y * cellLength
      } ) );
    } );

    // Pass options through to the parent class.
    this.mutate( options );
  }

  areaBuilder.register( 'GridIcon', GridIcon );

  return inherit( Node, GridIcon );
} );