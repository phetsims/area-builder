// Copyright 2014-2015, University of Colorado Boulder

/**
 * Panel that contains controls for turning various tools on and off for the Area Builder game. It is dynamic in the
 * sense that different elements of the panel come and go.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var areaBuilder = require( 'AREA_BUILDER/areaBuilder' );
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var CheckBox = require( 'SUN/CheckBox' );
  var DimensionsIcon = require( 'AREA_BUILDER/common/view/DimensionsIcon' );
  var Grid = require( 'AREA_BUILDER/common/view/Grid' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var BACKGROUND_COLOR = AreaBuilderSharedConstants.CONTROL_PANEL_BACKGROUND_COLOR;
  var PANEL_OPTIONS = { fill: BACKGROUND_COLOR, yMargin: 10, xMargin: 20 };

  /**
   * @param showGridProperty
   * @param showDimensionsProperty
   * @param {Object} [options]
   * @constructor
   */
  function AreaBuilderControlPanel( showGridProperty, showDimensionsProperty, options ) {
    Node.call( this );

    // Properties that control which elements are visible and which are hidden.  This constitutes the primary API.
    this.gridControlVisibleProperty = new Property( true );
    this.dimensionsControlVisibleProperty = new Property( true );

    // Create the controls and labels
    var gridCheckbox = new CheckBox( new Grid( new Bounds2( 0, 0, 40, 40 ), 10, { stroke: '#b0b0b0' } ), showGridProperty, { spacing: 15 } );
    this.dimensionsIcon = new DimensionsIcon(); // @public so that the icon style can be set
    var dimensionsCheckbox = new CheckBox( this.dimensionsIcon, showDimensionsProperty, { spacing: 15 } );

    // Create the panel.
    var vBox = new VBox( {
      children: [
        gridCheckbox,
        dimensionsCheckbox
      ],
      spacing: 8,
      align: 'left'
    } );
    this.addChild( new Panel( vBox, PANEL_OPTIONS ) );

    // Add/remove the grid visibility control.
    this.visibilityControls.gridControlVisibleProperty.link( function( gridControlVisible ) {
      if ( gridControlVisible && !vBox.hasChild( gridCheckbox ) ) {
        vBox.insertChild( 0, gridCheckbox );
      }
      else if ( !gridControlVisible && vBox.hasChild( gridCheckbox ) ) {
        vBox.removeChild( gridCheckbox );
      }
    } );

    // Add/remove the dimension visibility control.
    this.visibilityControls.dimensionsControlVisibleProperty.link( function( dimensionsControlVisible ) {
      if ( dimensionsControlVisible && !vBox.hasChild( dimensionsCheckbox ) ) {
        // Insert at bottom.
        vBox.insertChild( vBox.getChildrenCount(), dimensionsCheckbox );
      }
      else if ( !dimensionsControlVisible && vBox.hasChild( dimensionsCheckbox ) ) {
        vBox.removeChild( dimensionsCheckbox );
      }
    } );

    this.mutate( options );
  }

  areaBuilder.register( 'AreaBuilderControlPanel', AreaBuilderControlPanel );

  return inherit( Node, AreaBuilderControlPanel );
} );