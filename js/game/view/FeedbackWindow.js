// Copyright 2014-2020, University of Colorado Boulder

/**
 * Base class for a node that looks like a window and provide the user with feedback about what they have entered
 * during the challenge.
 *
 * @author John Blanco
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel from '../../../../sun/js/Panel.js';
import areaBuilder from '../../areaBuilder.js';

// constants
const X_MARGIN = 8;
const TITLE_FONT = new PhetFont( { size: 20, weight: 'bold' } );
const NORMAL_TEXT_FONT = new PhetFont( { size: 18 } );
const CORRECT_ANSWER_BACKGROUND_COLOR = 'white';
const INCORRECT_ANSWER_BACKGROUND_COLOR = PhetColorScheme.PHET_LOGO_YELLOW;

/**
 * Constructor for the window that shows the user what they built.  It is constructed with no contents, and the
 * contents are added later when the build spec is set.
 *
 * @param {string} title
 * @param {number} maxWidth
 * @param {Object} [options]
 * @constructor
 */
function FeedbackWindow( title, maxWidth, options ) {

  options = merge( {
    fill: INCORRECT_ANSWER_BACKGROUND_COLOR,
    stroke: 'black',
    xMargin: X_MARGIN
  }, options );

  this.contentNode = new Node(); // @private

  // title
  this.titleNode = new Text( title, { font: TITLE_FONT } ); // @private
  this.titleNode.scale( Math.min( ( maxWidth - 2 * X_MARGIN ) / this.titleNode.width, 1 ) );
  this.titleNode.top = 5;
  this.contentNode.addChild( this.titleNode );

  // Invoke super constructor - called here because content with no bounds doesn't work.  This does not pass through
  // position options - that needs to be handled in descendant classes.
  Panel.call( this, this.contentNode, { fill: options.fill, stroke: options.stroke, xMargin: options.xMargin } );
}

areaBuilder.register( 'FeedbackWindow', FeedbackWindow );

export default inherit( Panel, FeedbackWindow, {

    /**
     * Set the background color of this window based on whether or not the information being displayed is the correct
     * answer.
     *
     * @param userAnswerIsCorrect
     */
    setColorBasedOnAnswerCorrectness: function( userAnswerIsCorrect ) {
      this.background.fill = userAnswerIsCorrect ? CORRECT_ANSWER_BACKGROUND_COLOR : INCORRECT_ANSWER_BACKGROUND_COLOR;
    }
  },
  {
    // Statics
    X_MARGIN: X_MARGIN, // Must be visible to subtypes so that max width can be calculated and, if necessary, scaled.
    NORMAL_TEXT_FONT: NORMAL_TEXT_FONT // Font used in this window for text that is not the title.
  }
);