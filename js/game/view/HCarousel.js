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
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  // constants
  var ARROW_WIDTH = 12;
  var ARROW_HEIGHT = 40;
  var BUTTON_INSET = 5;
  var MIN_INTER_ITEM_SPACING = 5;
  var Y_MARGIN = 5;

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
                     MIN_INTER_ITEM_SPACING * 2 +
                     options.numVisibleAtOnce * maxChildWidth +
                     ( options.numVisibleAtOnce - 1 ) * 2 * MIN_INTER_ITEM_SPACING;
    var panelHeight = Math.max( BUTTON_INSET * 2 + previousButton.bounds.height, Y_MARGIN * 2 + maxChildHeight );
    Rectangle.call( this, 0, 0, panelWidth, panelHeight, 4, 4, options );

    // Position and add the buttons
    previousButton.left = BUTTON_INSET;
    previousButton.centerY = panelHeight / 2;
    this.addChild( previousButton );
    nextButton.right = panelWidth - BUTTON_INSET;
    nextButton.centerY = panelHeight / 2;
    this.addChild( nextButton );

    // Add the content.  It is structured as a 'windowNode' that defines the clip area and a 'scrollingNode' that moves
    // beneath the clip window.
    var windowNode = new Node();
    windowNode.clipArea = new Shape.rect( previousButton.right + MIN_INTER_ITEM_SPACING / 2,
      0, nextButton.left - previousButton.right - MIN_INTER_ITEM_SPACING, panelHeight );
    this.addChild( windowNode );
    var scrollingNode = new Rectangle( 0, 0,
        BUTTON_INSET + previousButton.width + children.length * ( maxChildWidth + 2 * MIN_INTER_ITEM_SPACING),
      panelHeight, 0, 0, { fill: 'rgba( 0, 0, 0, 0)' }
    );
    children.forEach( function( child, index ) {
      child.centerX = previousButton.right + MIN_INTER_ITEM_SPACING + maxChildWidth / 2 + index * ( maxChildWidth + 2 * MIN_INTER_ITEM_SPACING );
      child.centerY = panelHeight / 2;
      scrollingNode.addChild( child );
    } );
    windowNode.addChild( scrollingNode );

    // Set up the scrolling functions.
    var targetPosition = new Property( 0 );
    var scrollDistance = maxChildWidth + 2 * MIN_INTER_ITEM_SPACING;

    function scrollRight() {
      targetPosition.value += 1;
    }

    function scrollLeft() {
      targetPosition.value -= 1;
    }

    targetPosition.link( function( pos ) {

      // Enable/disable the navigation buttons.
      nextButton.enabled = pos > options.numVisibleAtOnce - children.length;
      previousButton.enabled = pos < 0;

      // Set up the animation to scroll to the next location.
      new TWEEN.Tween( scrollingNode ).to( { left: targetPosition.value * scrollDistance }, 200 ).easing( TWEEN.Easing.Cubic.InOut ).start();
    } );

    // Hook up the scrolling nodes to the buttons.
    nextButton.addListener( scrollLeft );
    previousButton.addListener( scrollRight );

  }

  return inherit( Rectangle, HCarousel );
} );