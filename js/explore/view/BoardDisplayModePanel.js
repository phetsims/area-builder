// Copyright 2002-2014, University of Colorado Boulder

/**
 * Panel that contains a switch that is used to switch between the two exploration modes.
 */
define( function( require ) {
  'use strict';

  // modules
  var ABSwitch = require( 'SUN/ABSwitch' );
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var ExploreIcon = require( 'AREA_BUILDER/explore/view/ExploreIcon' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   *
   * @constructor
   */
  function BoardDisplayModePanel( boardDisplayModeProperty ) {

    var singleBoardIcon = new ExploreIcon( AreaBuilderSharedConstants.ORANGISH_COLOR, 6, [
      new Vector2( 0, 1 ),
      new Vector2( 1, 0 ),
      new Vector2( 1, 1 )
    ] );

    var dualBoardIcon = new HBox( {
        children: [
          new ExploreIcon( AreaBuilderSharedConstants.GREENISH_COLOR, 6, [
            new Vector2( 0, 0 ),
            new Vector2( 1, 0 ),
            new Vector2( 1, 1 )
          ] ),
          new ExploreIcon( AreaBuilderSharedConstants.PURPLISH_COLOR, 6, [
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
          new ABSwitch( boardDisplayModeProperty, 'single', singleBoardIcon, 'dual', dualBoardIcon, { switchSize: new Dimension2( 36, 18 ) } )
        ],
        spacing: 10 // Empirically determined
      } ), { fill: AreaBuilderSharedConstants.CONTROL_PANEL_BACKGROUND_COLOR }
    );
  }

  return inherit( Panel, BoardDisplayModePanel );
} );