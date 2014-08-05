// Copyright 2002-2014, University of Colorado Boulder

/**
 * A Scenery node that depicts a banner containing information about solutions for challenges.  This is generally used
 * to show the user information about a challenge that was not correctly solved.
 *
 * TODO: Consider consolidation with ChallengePromptBanner
 */
define( function( require ) {
  'use strict';

  // modules
  var ColorProportionsPrompt = require( 'AREA_BUILDER/game/view/ColorProportionsPrompt' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var areaEqualsString = require( 'string!AREA_BUILDER/areaEquals' );
  var aSolutionString = require( 'string!AREA_BUILDER/aSolutionColon' );
  var perimeterEqualsString = require( 'string!AREA_BUILDER/perimeterEquals' );
  var solutionString = require( 'string!AREA_BUILDER/solution' );

  // constants
  var BACKGROUND_FILL_COLOR = '#26B853';
  var TEXT_FILL_COLOR = 'white';
  var TITLE_FONT = new PhetFont( { size: 24, weight: 'bold' } ); // Font used for the title
  var LARGE_FONT = new PhetFont( { size: 24 } ); // Font for single line text
  var SMALLER_FONT = new PhetFont( { size: 18 } ); // Font for two-line text
  var TITLE_INDENT = 15;

  /**
   * @param {Number} width
   * @param {Number} height
   * @param {Object} options
   * @constructor
   */
  function SolutionBanner( width, height, options ) {
    Rectangle.call( this, 0, 0, width, height, 0, 0, { fill: BACKGROUND_FILL_COLOR } );

    // @public These properties are the main API for this class, and they control what is and isn't shown on the banner.
    this.properties = new PropertySet( {
      mode: 'buildIt', // Challenge type being presented to user, valid values are 'buildIt' and 'findArea'.
      targetArea: null,
      targetPerimeter: null,
      targetProportions: null
    } );

    var title = new Text( '', { font: TITLE_FONT, fill: TEXT_FILL_COLOR, centerY: height / 2, left: TITLE_INDENT } );
    this.addChild( title );

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

    var targetProportionsPrompt = new Node();
    this.addChild( targetProportionsPrompt );

    function updatePromptPositions() {
      var promptCenterX;
      if ( targetProportionsPrompt.getChildrenCount() > 0 ) {
        targetProportionsPrompt.right = width - TITLE_INDENT;
        targetProportionsPrompt.centerY = height / 2;
        promptCenterX = ( title.width + TITLE_INDENT + targetProportionsPrompt.left ) / 2;
      }
      else {
        promptCenterX = ( width + title.width + TITLE_INDENT ) / 2;
      }
      areaOnlyPrompt.centerX = promptCenterX;
      areaAndPerimeterPrompt.centerX = promptCenterX;
      areaAndPerimeterPrompt.centerY = height / 2;
    }

    this.properties.modeProperty.link( function( mode ) {
      switch( mode ) {
        case 'buildIt':
          title.text = aSolutionString;
          break;
        case 'findArea':
          title.text = solutionString;
          break;
        default:
          title.text = 'undefined';
          break;
      }
      updatePromptPositions();
    } );

    // TODO: This works, but is not a great way to do it, since it causes multiple updates.  Replace at some point with
    // TODO: a single constructor and handle it differently in the main view class.
    Property.multilink( [ this.properties.targetAreaProperty, this.properties.targetPerimeterProperty, this.properties.targetProportionsProperty ],
      function( targetArea, targetPerimeter, targetProportions ) {

        // Update the text of the textual prompts.
        var areaPromptText = targetArea ? StringUtils.format( areaEqualsString, targetArea ) : '';
        areaOnlyPrompt.text = areaPromptText;
        var perimeterPromptText = targetPerimeter ? StringUtils.format( perimeterEqualsString, targetPerimeter ) : '';
        areaAndPerimeterPrompt.text = areaPromptText + '\n' + perimeterPromptText;

        // Update the proportions prompt.
        targetProportionsPrompt.removeAllChildren();
        if ( targetProportions !== null ) {
          targetProportionsPrompt.addChild( new ColorProportionsPrompt(
            targetProportions.color1,
            targetProportions.color2,
            targetProportions.color1ProportionNumerator,
            targetProportions.color1ProportionDenominator,
            { textFill: 'white' } ) );
        }

        // Update the visibility of the prompts
        areaOnlyPrompt.visible = areaPromptText.length > 0 && perimeterPromptText.length === 0;
        areaAndPerimeterPrompt.visible = areaPromptText.length > 0 && perimeterPromptText.length > 0;

        // Center the prompts in the position to the right of the title.
        updatePromptPositions();
      } );

    // Pass options through to parent class.
    this.mutate( options );
  }

  return inherit( Rectangle, SolutionBanner, {
    reset: function() {
      this.properties.reset();
    }
  } );
} );