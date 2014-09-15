// Copyright 2002-2014, University of Colorado Boulder

/**
 * A Scenery node that depicts a grid with squares on it.  This is used in several places in the simulation to create
 * icons that look like the things that the user might create when using the simulation.
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Color = require( 'SCENERY/util/Color' );
  var Grid = require( 'AREA_BUILDER/common/view/Grid' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Number} columns
   * @param {Number} rows
   * @param {Number} cellLength
   * @param {String} shapeFillColor
   * @param {Array<Vector2>} occupiedCells
   * @param {Object} [options]
   * @constructor
   */
  function GridIcon( columns, rows, cellLength, shapeFillColor, occupiedCells, options ) {

    Node.call( this );
    var self = this;

    options = _.extend( {
      // defaults
      gridStroke: 'black',
      gridLineWidth: 1,
      backgroundFill: 'white',
      shapeStroke: new Color( shapeFillColor ).colorUtilsDarker( 0.2 ), // darkening factor empirically determined
      shapeLineWidth: 1
    }, options );

    if ( options.backgroundFill ) {
      this.addChild( new Rectangle( 0, 0, columns * cellLength, rows * cellLength, 0, 0, { fill: options.backgroundFill } ) );
    }

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
      } ) )
    } );

    // Pass options through to the parent class.
    this.mutate( options );
  }

  return inherit( Node, GridIcon, {
    //TODO prototypes
  } );
} );