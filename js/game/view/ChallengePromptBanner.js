// Copyright 2002-2014, University of Colorado Boulder

/**
 * A Scenery node that displays the prompt for the challenges in the Area Builder game.  It looks like a banner with
 * text fields that vary for each of the different challenges.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var areaEqualsString = require( 'string!AREA_BUILDER/areaEquals' );
  var buildItString = require( 'string!AREA_BUILDER/buildIt' );
  var findTheAreaString = require( 'string!AREA_BUILDER/findTheArea' );
  var perimeterEqualsString = require( 'string!AREA_BUILDER/perimeterEquals' );

  // constants
  var BACKGROUND_FILL_COLOR = '#2A3AFF';
  var TEXT_FILL_COLOR = 'white';
  var TITLE_FONT = new PhetFont( { size: 24, weight: 'bold' } ); // Font used for the title
  var LARGE_FONT = new PhetFont( { size: 24 } ); // Font for single line text
  var SMALLER_FONT = new PhetFont( { size: 18 } ); // Font for two-line text

  /**
   * @param {Number} width
   * @param {Number} height
   * @param {Object} options
   * @constructor
   */
  function ChallengePromptBanner( width, height, options ) {
    Rectangle.call( this, 0, 0, width, height, 0, 0, { fill: BACKGROUND_FILL_COLOR } );
    var self = this;

    // @public These properties are the main API for this class, and control what is and isn't shown on the banner.
    this.properties = new PropertySet( {
      mode: 'buildIt', // Challenge type being presented to user, valid values are 'buildIt' and 'findArea'.
      targetArea: null,
      targetPerimeter: null,
      promptsVisible: false,
      buildProportions: { numerator: 1, denominator: 1, color1: 'black', color2: 'white' }
    } );

    var title = new Text( '', { font: TITLE_FONT, fill: TEXT_FILL_COLOR, centerY: height / 2 } );
    this.addChild( title );
    title.left = 20;

    this.properties.modeProperty.link( function( mode ) {
      switch( mode ) {
        case 'buildIt':
          title.text = buildItString;
          break;
        case 'findArea':
          title.text = findTheAreaString;
          break;
      }
    } );

    var areaOnlyPrompt = new Text( '', {
      font: LARGE_FONT,
      fill: TEXT_FILL_COLOR,
      centerY: height / 2,
      centerX: width / 2
    } );
    this.addChild( areaOnlyPrompt );
    var areaAndPerimeterPrompt = new MultiLineText( '', {
      font: SMALLER_FONT,
      fill: TEXT_FILL_COLOR,
      align: 'left',
      centerY: height / 2,
      centerX: width / 2
    } );
    this.addChild( areaAndPerimeterPrompt );

    Property.multilink( [ this.properties.targetAreaProperty, this.properties.targetPerimeterProperty ],
      function( targetArea, targetPerimeter ) {
        // Update the text of both build prompts.
        var areaPromptText = targetArea ? StringUtils.format( areaEqualsString, targetArea ) : '';
        areaOnlyPrompt.text = areaPromptText;
        var perimeterPromptText = targetPerimeter ? StringUtils.format( perimeterEqualsString, targetPerimeter ) : '';
        areaAndPerimeterPrompt.text = areaPromptText + '\n' + perimeterPromptText;

        // Update the visibility of the prompts
        areaOnlyPrompt.visible = areaPromptText.length > 0 && perimeterPromptText.length === 0;
        areaAndPerimeterPrompt.visible = areaPromptText.length > 0 && perimeterPromptText.length > 0;
      } );

    // Pass options through to parent class.
    this.mutate( options );
  }

  return inherit( Rectangle, ChallengePromptBanner, {
    //TODO prototypes
  } );
} );