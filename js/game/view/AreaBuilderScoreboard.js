// Copyright 2002-2014, University of Colorado Boulder

/**
 * Scoreboard used in the Area Builder game.  This actually consists of two panels, one where time is shown and one
 * where it isn't, and which one is visible is determined by a property parameter.
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Checkbox = require( 'SUN/Checkbox' );
  var DimensionsIcon = require( 'AREA_BUILDER/common/view/DimensionsIcon' );
  var GameTimer = require( 'VEGAS/GameTimer' );
  var Grid = require( 'AREA_BUILDER/common/view/Grid' );
  var HStrut = require( 'SUN/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var levelString = require( 'string!VEGAS/label.level' );
  var scoreString = require( 'string!VEGAS/label.score' );
  var timeString = require( 'string!VEGAS/label.time' );

  // constants
  var BACKGROUND_COLOR = AreaBuilderSharedConstants.CONTROL_PANEL_BACKGROUND_COLOR;
  var LABEL_FONT = new PhetFont( 20 );
  var MIN_WIDTH = 150; // in screen coords, empirically determined

  /**
   * @param levelProperty
   * @param scoreProperty
   * @param elapsedTimeProperty
   * @param timeVisibleProperty
   * @param showGridProperty
   * @param showDimensionsProperty
   * @param options
   * @constructor
   */
  function AreaBuilderScoreboard( levelProperty, scoreProperty, elapsedTimeProperty, timeVisibleProperty, showGridProperty, showDimensionsProperty, options ) {
    Node.call( this );

    // Create the controls and labels, which will appear on both panels.
    var gridCheckbox = new Checkbox( new Grid( 0, 0, 40, 40, 10, { stroke: '#808080', lineDash: [ 1, 2 ] } ), showGridProperty, { spacing: 15 } );
    var dimensionsCheckbox = new Checkbox( new DimensionsIcon, showDimensionsProperty, { spacing: 15 } );
    var levelIndicator = new Text( '', { font: LABEL_FONT } );
    levelProperty.link( function( level ) {
      levelIndicator.text = StringUtils.format( levelString, level + 1 );
    } );
    var scoreIndicator = new Text( '', { font: LABEL_FONT } );
    scoreProperty.link( function( score ) {
      scoreIndicator.text = StringUtils.format( scoreString, score );
    } );
    var elapsedTimeIndicator = new Text( '', { font: LABEL_FONT } );
    elapsedTimeProperty.link( function( elapsedTime ) {
      elapsedTimeIndicator.text = StringUtils.format( timeString, GameTimer.formatTime( elapsedTime ) );
    } );
    var spacer = new HStrut( MIN_WIDTH );

    // Create the panel that includes the time.
    var panelWithTimerContents = new VBox( {
      children: [
        spacer,
        levelIndicator,
        scoreIndicator,
        elapsedTimeIndicator,
        gridCheckbox,
        dimensionsCheckbox
      ],
      spacing: 20
    } );

    this.addChild( new Panel( panelWithTimerContents, { fill: BACKGROUND_COLOR } ) );

    // Pass options through to parent class.
    this.mutate( options );
  }

  return inherit( Node, AreaBuilderScoreboard );
} );