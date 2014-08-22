// Copyright 2002-2014, University of Colorado Boulder

// Copyright 2002-2014, University of Colorado Boulder

/**
 * Base class for a node that looks like a window and provide the user with feedback about what they have entered
 * during the challenge.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var X_MARGIN = 5;
  var TITLE_FONT = new PhetFont( { size: 20, weight: 'bold' } );
  var CORRECT_ANSWER_BACKGROUND_COLOR = 'white';
  var INCORRECT_ANSWER_BACKGROUND_COLOR = '#F2E916';

  /**
   * Constructor for the window that shows the user what they built.  It is constructed with no contents, and the
   * contents are added later when the build spec is set.
   *
   * @param {String} title
   * @param {Number} maxWidth
   * @param {object} options
   * @constructor
   */
  function FeedbackWindow( title, maxWidth, options ) {

    options = _.extend( { fill: INCORRECT_ANSWER_BACKGROUND_COLOR, stroke: 'black' }, options );

    // make the max width available to descendant classes
    this.maxWidth = maxWidth; // @protected

    // content root
    this.contentNode = new Node();

    // title
    this.titleNode = new Text( title, { font: TITLE_FONT } );
    this.titleNode.scale( Math.min( ( maxWidth - 2 * X_MARGIN ) / this.titleNode.width, 1 ) );
    this.titleNode.top = 5;
    this.contentNode.addChild( this.titleNode );

    // super constructor - called here because content with no bounds doesn't work
    Panel.call( this, this.contentNode, options );
  }

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
      X_MARGIN: X_MARGIN
    }
  );
} );