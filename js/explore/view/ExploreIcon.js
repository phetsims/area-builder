// Copyright 2002-2014, University of Colorado Boulder

//REVIEW move this into BoardDisplayModePanel, see issue #39
//REVIEW would be more useful to describe this as being used to create the icons on the control that switches between single and dual boards
/**
 * A Scenery node that represents a set of squares placed on a grid, used for making icons.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {String || Color } color
   * @param {Number} rectangleLength
   * @param {Array<Vector2>} positions
   * @constructor
   */
  function ExploreIcon( color, rectangleLength, positions ) {
    var edgeColor = Color.toColor( color ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR );
    var content = new Node();
    positions.forEach( function( position ) {
      content.addChild( new Rectangle( 0, 0, rectangleLength, rectangleLength, 0, 0, {
        fill: color,
        stroke: edgeColor,
        left: position.x * rectangleLength,
        top: position.y * rectangleLength
      } ) );
    } );
    Panel.call( this, content, { fill: 'white', stroke: 'black', cornerRadius: 0, backgroundPickable: true } );
  }

  return inherit( Panel, ExploreIcon );
} );