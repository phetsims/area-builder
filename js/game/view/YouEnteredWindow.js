// Copyright 2002-2014, University of Colorado Boulder

/**
 * A Scenery node that is used to show the user what they entered for a 'Find the Area' style of challenge.  It can be
 * dynamically updated if needed.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var FeedbackWindow = require( 'AREA_BUILDER/game/view/FeedbackWindow' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var youEnteredString = require( 'string!AREA_BUILDER/youEntered' );

  // constants
  var LINE_SPACING = 5;

  /**
   * Constructor for the window that shows the user what they built.  It is constructed with no contents, and the
   * contents are added later when the build spec is set.
   *
   * @param maxWidth
   * @param {Object} [options]
   * @constructor
   */
  function YouEnteredWindow( maxWidth, options ) {

    FeedbackWindow.call( this, youEnteredString, maxWidth, options );

    // value entered text
    this.valueEnteredNode = new Text( ( 99 ), {
      font: FeedbackWindow.NORMAL_TEXT_FONT,
      top: this.titleNode.bottom + LINE_SPACING
    } );
    this.contentNode.addChild( this.valueEnteredNode );

    // Handle options, mostly those relating to position.
    this.mutate( options );
  }

  return inherit( FeedbackWindow, YouEnteredWindow, {

    // @public
    setValueEntered: function( valueEntered ) {
      this.valueEnteredNode.text = valueEntered.toString();
      this.valueEnteredNode.centerX = this.titleNode.centerX;
    }
  } );
} );