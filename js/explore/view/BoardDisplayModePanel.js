// Copyright 2014, University of Colorado Boulder

/**
 * Panel that contains a switch that is used to switch between the two exploration modes.
 */
define( function( require ) {
  'use strict';

  // modules
  var ABSwitch = require( 'SUN/ABSwitch' );
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );

  // utility function for creating the icons used on this panel
  function createIcon( color, rectangleLength, rectanglePositions ) {
    var edgeColor = Color.toColor( color ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR );
    var content = new Node();
    rectanglePositions.forEach( function( position ) {
      content.addChild( new Rectangle( 0, 0, rectangleLength, rectangleLength, 0, 0, {
        fill: color,
        stroke: edgeColor,
        left: position.x * rectangleLength,
        top: position.y * rectangleLength
      } ) );
    } );
    return new Panel( content, { fill: 'white', stroke: 'black', cornerRadius: 0, backgroundPickable: true } );
  }

  /**
   *
   * @constructor
   */
  function BoardDisplayModePanel( boardDisplayModeProperty ) {

    var singleBoardIcon = createIcon( AreaBuilderSharedConstants.ORANGISH_COLOR, 6, [
      new Vector2( 0, 1 ),
      new Vector2( 1, 0 ),
      new Vector2( 1, 1 )
    ] );

    var dualBoardIcon = new HBox( {
        children: [
          createIcon( AreaBuilderSharedConstants.GREENISH_COLOR, 6, [
            new Vector2( 0, 0 ),
            new Vector2( 1, 0 ),
            new Vector2( 1, 1 )
          ] ),
          createIcon( AreaBuilderSharedConstants.PURPLISH_COLOR, 6, [
            new Vector2( 0, 0 ),
            new Vector2( 0, 1 ),
            new Vector2( 1, 0 ),
            new Vector2( 1, 1 )
          ] )
        ],
        spacing: 3
      }
    );

    Panel.call( this,
      new VBox( {
        children: [
          new ABSwitch( boardDisplayModeProperty, 'single', singleBoardIcon, 'dual', dualBoardIcon, {
            switchSize: new Dimension2( 36, 18 )
          } )
        ],
        spacing: 10 // Empirically determined
      } ), { fill: AreaBuilderSharedConstants.CONTROL_PANEL_BACKGROUND_COLOR, cornerRadius: 4 }
    );
  }

  return inherit( Panel, BoardDisplayModePanel );
} );