// Copyright 2014-2019, University of Colorado Boulder

/**
 * A node that pretty much fills the screen and that allows the user to select the game level that they wish to play.
 *
 * TODO: This was copied from Balancing Act, used for fast proto, should be replaced with generalized version.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const areaBuilder = require( 'AREA_BUILDER/areaBuilder' );
  const AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LevelSelectionButton = require( 'VEGAS/LevelSelectionButton' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TimerToggleButton = require( 'SCENERY_PHET/buttons/TimerToggleButton' );
  const Vector2 = require( 'DOT/Vector2' );

  // strings
  const chooseYourLevelString = require( 'string!VEGAS/chooseYourLevel' );

  // constants
  var CONTROL_BUTTON_TOUCH_AREA_DILATION = 4;

  /**
   * @param {function} startLevelFunction - Function used to initiate a game
   * level, will be called with a zero-based index value.
   * @param {function} resetFunction - Function to reset game and scores.
   * @param {Property} timerEnabledProperty
   * @param {Array} iconNodes - Set of iconNodes to use on the buttons, sizes
   * should be the same, length of array must match number of levels.
   * @param {Array} scores - Current scores, used to decide which stars to
   * illuminate on the level start buttons, length must match number of levels.
   * @param {Object} [options] - See code below for options and default values.
   * @constructor
   */
  function StartGameLevelNode( startLevelFunction,
                               resetFunction,
                               timerEnabledProperty,
                               iconNodes,
                               scores,
                               options ) {

    Node.call( this );

    options = _.extend( {

      // defaults
      numLevels: 4,
      titleString: chooseYourLevelString,
      maxTitleWidth: 500,
      numStarsOnButtons: 5,
      perfectScore: 10,
      buttonBackgroundColor: '#A8BEFF',
      numButtonRows: 1, // For layout
      controlsInset: 12,
      size: AreaBuilderSharedConstants.LAYOUT_BOUNDS
    }, options );

    // Verify parameters
    if ( iconNodes.length !== options.numLevels || scores.length !== options.numLevels ) {
      throw new Error( 'Number of game levels doesn\'t match length of provided arrays' );
    }

    // Title
    var title = new Text( options.titleString, { font: new PhetFont( 30 ), maxWidth: options.maxTitleWidth } );
    this.addChild( title );

    // Add the buttons
    function createLevelStartFunction( level ) {
      return function() { startLevelFunction( level ); };
    }

    var buttons = new Array( options.numLevels );
    for ( var i = 0; i < options.numLevels; i++ ) {
      buttons[ i ] = new LevelSelectionButton(
        iconNodes[ i ],
        scores[ i ],
        {
          listener: createLevelStartFunction( i ),
          baseColor: options.buttonBackgroundColor,
          scoreDisplayOptions: {
            numberOfStars: options.numStarsOnButtons,
            perfectScore: options.perfectScore
          }
        }
      );
      buttons[ i ].scale( 0.80 );
      this.addChild( buttons[ i ] );
    }

    // Sound and timer controls.
    var timerToggleButton = new TimerToggleButton( timerEnabledProperty, {
      touchAreaXDilation: CONTROL_BUTTON_TOUCH_AREA_DILATION,
      touchAreaYDilation: CONTROL_BUTTON_TOUCH_AREA_DILATION
    } );
    this.addChild( timerToggleButton );

    // Reset button.
    var resetButton = new ResetAllButton( {
      listener: resetFunction,
      radius: AreaBuilderSharedConstants.RESET_BUTTON_RADIUS
    } );
    this.addChild( resetButton );

    // Layout
    var numColumns = options.numLevels / options.numButtonRows;
    var buttonSpacingX = buttons[ 0 ].width * 1.2; // Note: Assumes all buttons are the same size.
    var buttonSpacingY = buttons[ 0 ].height * 1.2;  // Note: Assumes all buttons are the same size.
    var firstButtonOrigin = new Vector2( options.size.width / 2 - ( numColumns - 1 ) * buttonSpacingX / 2,
      options.size.height * 0.5 - ( ( options.numButtonRows - 1 ) * buttonSpacingY ) / 2 );
    for ( var row = 0; row < options.numButtonRows; row++ ) {
      for ( var col = 0; col < numColumns; col++ ) {
        var buttonIndex = row * numColumns + col;
        buttons[ buttonIndex ].centerX = firstButtonOrigin.x + col * buttonSpacingX;
        buttons[ buttonIndex ].centerY = firstButtonOrigin.y + row * buttonSpacingY;
      }
    }
    resetButton.right = options.size.width - options.controlsInset;
    resetButton.bottom = options.size.height - options.controlsInset;
    title.centerX = options.size.width / 2;
    title.centerY = buttons[ 0 ].top / 2;
    timerToggleButton.left = options.controlsInset;
    timerToggleButton.bottom = options.size.height - options.controlsInset;
  }

  areaBuilder.register( 'StartGameLevelNode', StartGameLevelNode );

  // Inherit from Node.
  return inherit( Node, StartGameLevelNode );
} );
