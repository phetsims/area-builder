// Copyright 2002-2014, University of Colorado Boulder

/**
 * Panel that contains controls for turning various tools on and off for the Area Builder game. It is dynamic in the
 * sense that different elements of the panel come and go.
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Checkbox = require( 'SUN/Checkbox' );
  var DimensionsIcon = require( 'AREA_BUILDER/common/view/DimensionsIcon' );
  var GameTimer = require( 'VEGAS/GameTimer' );
  var Grid = require( 'AREA_BUILDER/common/view/Grid' );
  var HStrut = require( 'SUN/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PropertySet = require( 'AXON/PropertySet' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var levelString = require( 'string!AREA_BUILDER/level' );
  var scoreString = require( 'string!VEGAS/label.score' );
  var timeString = require( 'string!VEGAS/label.time' );
  var currentChallengeString = require( 'string!AREA_BUILDER/pattern.0challenge.1max' );

  // constants
  var MIN_WIDTH = 150; // in screen coords, empirically determined
  var BACKGROUND_COLOR = AreaBuilderSharedConstants.CONTROL_PANEL_BACKGROUND_COLOR;
  var PANEL_OPTIONS = { fill: BACKGROUND_COLOR, yMargin: 10, xMargin: 20 };

  /**
   * @param showGridProperty
   * @param showDimensionsProperty
   * @param options
   * @constructor
   */
  function AreaBuilderGameControlPanel( showGridProperty, showDimensionsProperty, options ) {
    Node.call( this );

    // Properties that control which elements are visible and which are hidden.  This constitutes the primary API.
    this.visibilityControls = new PropertySet( {
      gridControlVisible: true,
      dimensionsControlVisible: true
    } );

    // Create the controls and labels
    var gridCheckbox = new Checkbox( new Grid( new Bounds2( 0, 0, 40, 40 ), 10, { stroke: '#808080', lineDash: [ 1, 2 ] } ), showGridProperty, { spacing: 15 } );
    this.dimensionsIcon = new DimensionsIcon(); // @public so that the icon style can be set
    var dimensionsCheckbox = new Checkbox( this.dimensionsIcon, showDimensionsProperty, { spacing: 15 } );

    // Create the panel.
    var vBox = new VBox( {
      children: [
        gridCheckbox,
        dimensionsCheckbox
      ],
      spacing: 12
    } );
    this.addChild( new Panel( vBox, PANEL_OPTIONS ) );

    // Add/remove the grid visibility control.
    this.visibilityControls.gridControlVisibleProperty.link( function( gridControlVisible ) {
      if ( gridControlVisible && !vBox.isChild( gridCheckbox ) ) {
        // Insert after time if times is shown, after score if not.
        var insertAfter = vBox.isChild( elapsedTimeIndicator ) ? vBox.indexOfChild( elapsedTimeIndicator ) : vBox.indexOfChild( scoreIndicator );
        vBox.insertChild( insertAfter + 1, gridCheckbox );
      }
      else if ( !gridControlVisible && vBox.isChild( gridCheckbox ) ) {
        vBox.removeChild( gridCheckbox );
      }
      vBox.updateLayout();
    } );

    // Add/remove the dimension visibility control.
    this.visibilityControls.dimensionsControlVisibleProperty.link( function( dimensionsControlVisible ) {
      if ( dimensionsControlVisible && !vBox.isChild( dimensionsCheckbox ) ) {
        // Insert at bottom.
        vBox.insertChild( vBox.getChildrenCount(), dimensionsCheckbox );
      }
      else if ( !dimensionsControlVisible && vBox.isChild( dimensionsCheckbox ) ) {
        vBox.removeChild( dimensionsCheckbox );
      }
      vBox.updateLayout();
    } );

    this.mutate( options );
  }

  return inherit( Node, AreaBuilderGameControlPanel );
} );