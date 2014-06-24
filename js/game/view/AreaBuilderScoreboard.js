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
  var levelString = require( 'string!AREA_BUILDER/level' );
  var scoreString = require( 'string!VEGAS/label.score' );
  var timeString = require( 'string!VEGAS/label.time' );
  var currentChallengeString = require( 'string!AREA_BUILDER/pattern.0challenge.1max' );

  // constants
  var MIN_WIDTH = 150; // in screen coords, empirically determined
  var BACKGROUND_COLOR = AreaBuilderSharedConstants.CONTROL_PANEL_BACKGROUND_COLOR;
  var PANEL_OPTIONS = { fill: BACKGROUND_COLOR, yMargin: 10 };

  /**
   * @param levelProperty
   * @param problemNumberProperty
   * @param problemsPerLevel
   * @param scoreProperty
   * @param elapsedTimeProperty
   * @param timeVisibleProperty
   * @param showGridProperty
   * @param showDimensionsProperty
   * @param options
   * @constructor
   */
  function AreaBuilderScoreboard( levelProperty, problemNumberProperty, problemsPerLevel, scoreProperty, elapsedTimeProperty, timeVisibleProperty, showGridProperty, showDimensionsProperty, options ) {
    Node.call( this );

    // Create the controls and labels, which will appear on both panels.
    var gridCheckbox = new Checkbox( new Grid( 0, 0, 40, 40, 10, { stroke: '#808080', lineDash: [ 1, 2 ] } ), showGridProperty, { spacing: 15 } );
    var dimensionsCheckbox = new Checkbox( new DimensionsIcon(), showDimensionsProperty, { spacing: 15 } );
    var levelIndicator = new Text( '', { font: new PhetFont( { size: 20, weight: 'bold' } )  } );
    levelProperty.link( function( level ) {
      levelIndicator.text = StringUtils.format( levelString, level + 1 );
    } );
    var currentChallengeIndicator = new Text( '', { font: new PhetFont( { size: 16 } )  } );
    problemNumberProperty.link( function( currentChallenge ) {
      currentChallengeIndicator.text = StringUtils.format( currentChallengeString, currentChallenge + 1, problemsPerLevel );
    } );
    var scoreIndicator = new Text( '', { font: new PhetFont( 20 ) } );
    scoreProperty.link( function( score ) {
      scoreIndicator.text = StringUtils.format( scoreString, score );
    } );
    var elapsedTimeIndicator = new Text( '', { font: new PhetFont( 20 ) } );
    elapsedTimeProperty.link( function( elapsedTime ) {
      elapsedTimeIndicator.text = StringUtils.format( timeString, GameTimer.formatTime( elapsedTime ) );
    } );
    var spacer = new HStrut( MIN_WIDTH );

    // Create the panel.
    var vBox = new VBox( {
      children: [
        levelIndicator,
        currentChallengeIndicator,
        scoreIndicator,
        spacer,
        gridCheckbox,
        dimensionsCheckbox
      ],
      spacing: 12
    } );
    this.addChild( new Panel( vBox, PANEL_OPTIONS ) );

    // Add or remove the time indicator.
    timeVisibleProperty.link( function( timeVisible ) {
      if ( timeVisible ) {
        vBox.insertChild( 3, elapsedTimeIndicator );
      }
      else if ( vBox.isChild( elapsedTimeIndicator ) ) {
        vBox.removeChild( elapsedTimeIndicator );
      }
      vBox.updateLayout();
    } );

    this.mutate( options );
  }

  return inherit( Node, AreaBuilderScoreboard );
} );