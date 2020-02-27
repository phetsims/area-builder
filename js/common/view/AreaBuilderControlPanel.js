// Copyright 2014-2019, University of Colorado Boulder

/**
 * Panel that contains controls for turning various tools on and off for the Area Builder game. It is dynamic in the
 * sense that different elements of the panel come and go.
 *
 * @author John Blanco
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Panel from '../../../../sun/js/Panel.js';
import areaBuilder from '../../areaBuilder.js';
import AreaBuilderSharedConstants from '../AreaBuilderSharedConstants.js';
import DimensionsIcon from './DimensionsIcon.js';
import Grid from './Grid.js';

// constants
const BACKGROUND_COLOR = AreaBuilderSharedConstants.CONTROL_PANEL_BACKGROUND_COLOR;
const PANEL_OPTIONS = { fill: BACKGROUND_COLOR, yMargin: 10, xMargin: 20 };

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
  const gridCheckbox = new Checkbox(
    new Grid( new Bounds2( 0, 0, 40, 40 ), 10, { stroke: '#b0b0b0' } ),
    showGridProperty,
    { spacing: 15 }
  );
  this.dimensionsIcon = new DimensionsIcon(); // @public so that the icon style can be set
  const dimensionsCheckbox = new Checkbox( this.dimensionsIcon, showDimensionsProperty, { spacing: 15 } );

  // Create the panel.
  const vBox = new VBox( {
    children: [
      gridCheckbox,
      dimensionsCheckbox
    ],
    spacing: 8,
    align: 'left'
  } );
  this.addChild( new Panel( vBox, PANEL_OPTIONS ) );

  // Add/remove the grid visibility control.
  this.gridControlVisibleProperty.link( function( gridControlVisible ) {
    if ( gridControlVisible && !vBox.hasChild( gridCheckbox ) ) {
      vBox.insertChild( 0, gridCheckbox );
    }
    else if ( !gridControlVisible && vBox.hasChild( gridCheckbox ) ) {
      vBox.removeChild( gridCheckbox );
    }
  } );

  // Add/remove the dimension visibility control.
  this.dimensionsControlVisibleProperty.link( function( dimensionsControlVisible ) {
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

inherit( Node, AreaBuilderControlPanel );
export default AreaBuilderControlPanel;