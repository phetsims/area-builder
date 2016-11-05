// Copyright 2014-2015, University of Colorado Boulder

/**
 * Base class for a node that looks like a window and provide the user with feedback about what they have entered
 * during the challenge.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var areaBuilder = require( 'AREA_BUILDER/areaBuilder' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );

  // constants
  var X_MARGIN = 8;
  var TITLE_FONT = new PhetFont( { size: 20, weight: 'bold' } );
  var NORMAL_TEXT_FONT = new PhetFont( { size: 18 } );
  var CORRECT_ANSWER_BACKGROUND_COLOR = 'white';
  var INCORRECT_ANSWER_BACKGROUND_COLOR = PhetColorScheme.PHET_YELLOW;

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

    options = _.extend( {
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

  return inherit( Panel, FeedbackWindow, {

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
} );