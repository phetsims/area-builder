// Copyright 2014-2017, University of Colorado Boulder

/**
 * Panel that shows the level, the current challenge, the score, and the time if enabled.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var areaBuilder = require( 'AREA_BUILDER/areaBuilder' );
  var GameTimer = require( 'VEGAS/GameTimer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var labelScoreString = require( 'string!VEGAS/label.score' );
  var labelTimeString = require( 'string!VEGAS/label.time' );
  var levelString = require( 'string!AREA_BUILDER/level' );
  var pattern0Challenge1MaxString = require( 'string!AREA_BUILDER/pattern.0challenge.1max' );

  /**
   * @param levelProperty
   * @param problemNumberProperty
   * @param problemsPerLevel
   * @param scoreProperty
   * @param elapsedTimeProperty
   * @param {Object} [options]
   * @constructor
   */
  function AreaBuilderScoreboard( levelProperty, problemNumberProperty, problemsPerLevel, scoreProperty,
                                  elapsedTimeProperty, options ) {
    Node.call( this );

    options = _.extend( { maxWidth: Number.POSITIVE_INFINITY }, options );

    // Properties that control which elements are visible and which are hidden.  This constitutes the primary API.
    this.timeVisibleProperty = new Property( true );

    // Create the labels
    var levelIndicator = new Text( '', {
      font: new PhetFont( { size: 20, weight: 'bold' } ),
      maxWidth: options.maxWidth
    } );
    levelProperty.link( function( level ) {
      levelIndicator.text = StringUtils.format( levelString, level + 1 );
    } );
    var currentChallengeIndicator = new Text( '', { font: new PhetFont( { size: 16 } ), maxWidth: options.maxWidth } );
    problemNumberProperty.link( function( currentChallenge ) {
      currentChallengeIndicator.text = StringUtils.format( pattern0Challenge1MaxString, currentChallenge + 1, problemsPerLevel );
    } );
    var scoreIndicator = new Text( '', { font: new PhetFont( 20 ), maxWidth: options.maxWidth } );
    scoreProperty.link( function( score ) {
      scoreIndicator.text = StringUtils.format( labelScoreString, score );
    } );
    var elapsedTimeIndicator = new Text( '', { font: new PhetFont( 20 ), maxWidth: options.maxWidth } );
    elapsedTimeProperty.link( function( elapsedTime ) {
      elapsedTimeIndicator.text = StringUtils.format( labelTimeString, GameTimer.formatTime( elapsedTime ) );
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
    this.timeVisibleProperty.link( function( timeVisible ) {
      if ( timeVisible && !vBox.hasChild( elapsedTimeIndicator ) ) {
        // Insert just after the score indicator.
        vBox.insertChild( vBox.indexOfChild( scoreIndicator ) + 1, elapsedTimeIndicator );
      }
      else if ( !timeVisible && vBox.hasChild( elapsedTimeIndicator ) ) {
        vBox.removeChild( elapsedTimeIndicator );
      }
    } );

    this.mutate( options );
  }

  areaBuilder.register( 'AreaBuilderScoreboard', AreaBuilderScoreboard );

  return inherit( Node, AreaBuilderScoreboard );
} );