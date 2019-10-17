// Copyright 2014-2019, University of Colorado Boulder

/**
 * Panel that shows the level, the current challenge, the score, and the time if enabled.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const areaBuilder = require( 'AREA_BUILDER/areaBuilder' );
  const GameTimer = require( 'VEGAS/GameTimer' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const labelScoreString = require( 'string!VEGAS/label.score' );
  const labelTimeString = require( 'string!VEGAS/label.time' );
  const levelString = require( 'string!AREA_BUILDER/level' );
  const pattern0Challenge1MaxString = require( 'string!AREA_BUILDER/pattern.0challenge.1max' );

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

    options = merge( { maxWidth: Number.POSITIVE_INFINITY }, options );

    // Properties that control which elements are visible and which are hidden.  This constitutes the primary API.
    this.timeVisibleProperty = new Property( true );

    // Create the labels
    const levelIndicator = new Text( '', {
      font: new PhetFont( { size: 20, weight: 'bold' } ),
      maxWidth: options.maxWidth
    } );
    levelProperty.link( function( level ) {
      levelIndicator.text = StringUtils.format( levelString, level + 1 );
    } );
    const currentChallengeIndicator = new Text( '', { font: new PhetFont( { size: 16 } ), maxWidth: options.maxWidth } );
    problemNumberProperty.link( function( currentChallenge ) {
      currentChallengeIndicator.text = StringUtils.format( pattern0Challenge1MaxString, currentChallenge + 1, problemsPerLevel );
    } );
    const scoreIndicator = new Text( '', { font: new PhetFont( 20 ), maxWidth: options.maxWidth } );
    scoreProperty.link( function( score ) {
      scoreIndicator.text = StringUtils.format( labelScoreString, score );
    } );
    const elapsedTimeIndicator = new Text( '', { font: new PhetFont( 20 ), maxWidth: options.maxWidth } );
    elapsedTimeProperty.link( function( elapsedTime ) {
      elapsedTimeIndicator.text = StringUtils.format( labelTimeString, GameTimer.formatTime( elapsedTime ) );
    } );

    // Create the panel.
    const vBox = new VBox( {
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