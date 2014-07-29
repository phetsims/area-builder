// Copyright 2002-2014, University of Colorado Boulder

/**
 * A 'carousel' user interface component that can contain multiple Scenery nodes and which the user can cycle through.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  // constants
  var ARROW_WIDTH = 12;
  var ARROW_HEIGHT = 40;
  var BUTTON_INSET = 5;
  var INTER_ITEM_SPACING = 5;
  var ITEM_INSET = 10;

  /**
   * @param {Array<Node>} children
   * @param {Object} options
   * @constructor
   */
  function HCarousel( children, options ) {

    options = _.extend(
      {
        numVisibleAtOnce: 4,
        fill: 'white',
        stroke: 'black',
        lineWidth: 1
      }, options );

    // Figure out the maximum child width and height
    var maxChildWidth = 0;
    var maxChildHeight = 0;
    children.forEach( function( child ) {
      maxChildWidth = Math.max( maxChildWidth, child.bounds.width );
      maxChildHeight = Math.max( maxChildHeight, child.bounds.height );
    } );

    // Create the buttons that will be used to scroll through the contents.
    var iconOptions = { stroke: 'white', lineWidth: 4, lineCap: 'round' };
    var nextIcon = new Path( new Shape().moveTo( 0, 0 ).lineTo( ARROW_WIDTH, ARROW_HEIGHT / 2 ).lineTo( 0, ARROW_HEIGHT ), iconOptions );
    var previousIcon = new Path( new Shape().moveTo( ARROW_WIDTH, 0 ).lineTo( 0, ARROW_HEIGHT / 2 ).lineTo( ARROW_WIDTH, ARROW_HEIGHT ), iconOptions );
    var previousButton = new RectangularPushButton( { content: previousIcon } );
    var nextButton = new RectangularPushButton( { content: nextIcon } );

    // Construct the outer container
    var panelWidth = BUTTON_INSET * 2 +
                     previousButton.bounds.width +
                     nextButton.bounds.width +
                     ITEM_INSET * 2 +
                     options.numVisibleAtOnce * maxChildWidth +
                     ( options.numVisibleAtOnce - 1 ) * INTER_ITEM_SPACING;
    var panelHeight = Math.max( BUTTON_INSET * 2 + previousButton.bounds.height, ITEM_INSET * 2 + maxChildHeight );
    Rectangle.call( this, 0, 0, panelWidth, panelHeight, 4, 4, options );

    // Add the content
    var contentRoot = new Node();
    children.forEach( function( child, index ) {
      child.centerX = ITEM_INSET + maxChildWidth / 2 + index * ( maxChildWidth + 2 * INTER_ITEM_SPACING );
      child.centerY = panelHeight / 2;
      contentRoot.addChild( child );
    } );
    contentRoot.left = BUTTON_INSET + nextButton.width + ITEM_INSET;
    this.addChild( contentRoot );

    // Position the buttons and add them to the background
    previousButton.left = BUTTON_INSET;
    previousButton.centerY = panelHeight / 2;
    this.addChild( previousButton );
    nextButton.right = panelWidth - BUTTON_INSET;
    nextButton.centerY = panelHeight / 2;
    this.addChild( nextButton );
  }

  return inherit( Rectangle, HCarousel, {
    //TODO prototypes
  } );
} );