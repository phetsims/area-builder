// Copyright 2014-2019, University of Colorado Boulder

/**
 * Panel that contains a switch that is used to switch between the two exploration modes.
 */
define( require => {
  'use strict';

  // modules
  const ABSwitch = require( 'SUN/ABSwitch' );
  const areaBuilder = require( 'AREA_BUILDER/areaBuilder' );
  const AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  const Color = require( 'SCENERY/util/Color' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Vector2 = require( 'DOT/Vector2' );

  // utility function for creating the icons used on this panel
  function createIcon( color, rectangleLength, rectanglePositions ) {
    const edgeColor = Color.toColor( color ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR );
    const content = new Node();
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

    const singleBoardIcon = createIcon( AreaBuilderSharedConstants.ORANGISH_COLOR, 6, [
      new Vector2( 0, 1 ),
      new Vector2( 1, 0 ),
      new Vector2( 1, 1 )
    ] );

    const dualBoardIcon = new HBox( {
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
            switchSize: new Dimension2( 36, 18 ),
            thumbTouchAreaXDilation: 5,
            thumbTouchAreaYDilation: 5
          } )
        ],
        spacing: 10 // Empirically determined
      } ), { fill: AreaBuilderSharedConstants.CONTROL_PANEL_BACKGROUND_COLOR, cornerRadius: 4 }
    );
  }

  areaBuilder.register( 'BoardDisplayModePanel', BoardDisplayModePanel );

  return inherit( Panel, BoardDisplayModePanel );
} );