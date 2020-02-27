// Copyright 2014-2020, University of Colorado Boulder

/**
 * Panel that shows the level, the current challenge, the score, and the time if enabled.
 *
 * @author John Blanco
 */

import Property from '../../../../axon/js/Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import GameTimer from '../../../../vegas/js/GameTimer.js';
import vegasStrings from '../../../../vegas/js/vegas-strings.js';
import areaBuilderStrings from '../../area-builder-strings.js';
import areaBuilder from '../../areaBuilder.js';

const labelScorePatternString = vegasStrings.label.scorePattern;
const labelTimeString = vegasStrings.label.time;
const levelString = areaBuilderStrings.level;
const pattern0Challenge1MaxString = areaBuilderStrings.pattern[ '0challenge' ][ '1max' ];

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
    scoreIndicator.text = StringUtils.format( labelScorePatternString, score );
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

inherit( Node, AreaBuilderScoreboard );
export default AreaBuilderScoreboard;