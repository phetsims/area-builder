// Copyright 2002-2014, University of Colorado Boulder

/**
 * Panel that shows the level, the current challenge, the score, and the time if enabled.
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

  /**
   * @param levelProperty
   * @param problemNumberProperty
   * @param problemsPerLevel
   * @param scoreProperty
   * @param elapsedTimeProperty
   * @param options
   * @constructor
   */
  function AreaBuilderScoreboard( levelProperty, problemNumberProperty, problemsPerLevel, scoreProperty, elapsedTimeProperty, options ) {
    Node.call( this );

    // Properties that control which elements are visible and which are hidden.  This constitutes the primary API.
    this.visibilityControls = new PropertySet( {
      timeVisible: true
    } );

    // Create the labels
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

    // Create the panel.
    var vBox = new VBox( {
      children: [
        levelIndicator,
        currentChallengeIndicator,
        scoreIndicator,
        elapsedTimeIndicator
      ],
      spacing: 12
    } );
    this.addChild( vBox );

    // Add/remove the time indicator.
    this.visibilityControls.timeVisibleProperty.link( function( timeVisible ) {
      if ( timeVisible && !vBox.isChild( elapsedTimeIndicator ) ) {
        // Insert just after the score indicator.
        vBox.insertChild( vBox.indexOfChild( scoreIndicator ) + 1, elapsedTimeIndicator );
      }
      else if ( !timeVisible && vBox.isChild( elapsedTimeIndicator ) ) {
        vBox.removeChild( elapsedTimeIndicator );
      }
      vBox.updateLayout();
    } );

    this.mutate( options );
  }

  return inherit( Node, AreaBuilderScoreboard );
} );