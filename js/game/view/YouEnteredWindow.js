// Copyright 2014-2020, University of Colorado Boulder

/**
 * A Scenery node that is used to show the user what they entered for a 'Find the Area' style of challenge.  It can be
 * dynamically updated if needed.
 *
 * @author John Blanco
 */

import Text from '../../../../scenery/js/nodes/Text.js';
import areaBuilder from '../../areaBuilder.js';
import areaBuilderStrings from '../../areaBuilderStrings.js';
import FeedbackWindow from './FeedbackWindow.js';

const youEnteredString = areaBuilderStrings.youEntered;

// constants
const LINE_SPACING = 5;

class YouEnteredWindow extends FeedbackWindow {

  /**
   * Constructor for the window that shows the user what they built.  It is constructed with no contents, and the
   * contents are added later when the build spec is set.
   *
   * @param maxWidth
   * @param {Object} [options]
   */
  constructor( maxWidth, options ) {

    super( youEnteredString, maxWidth, options );

    // value entered text
    this.valueEnteredNode = new Text( ( 99 ), {
      font: FeedbackWindow.NORMAL_TEXT_FONT,
      top: this.titleNode.bottom + LINE_SPACING
    } );
    this.contentNode.addChild( this.valueEnteredNode );

    // Handle options, mostly those relating to position.
    this.mutate( options );
  }

  // @public
  setValueEntered( valueEntered ) {
    this.valueEnteredNode.text = valueEntered.toString();
    this.valueEnteredNode.centerX = this.titleNode.centerX;
  }
}

areaBuilder.register( 'YouEnteredWindow', YouEnteredWindow );
export default YouEnteredWindow;