// Copyright 2002-2014, University of Colorado Boulder

/**
 * A Scenery node that displays the prompt for the challenges in the Area Builder game.  It looks like a banner with
 * text fields that vary for each of the different challenges.
 *
 * If this is ever reused, it should be noted that there are some implicit assumptions about the order in which the
 * property values that act as the API are set.  This is probably fine for use in a single simulation under tight time
 * constraints, but may be problematic in other environments.
 *
 * TODO: Consider consolidation with SolutionBanner
 */
define( function( require ) {
  'use strict';

  // modules
  var ColorProportionsPrompt = require( 'AREA_BUILDER/game/view/ColorProportionsPrompt' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
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
  var TITLE_INDENT = 10;
  var ANIMATION_TIME = 600; // In milliseconds

  /**
   * @param {Number} width
   * @param {Number} height
   * @param {Object} options
   * @constructor
   */
  function ChallengePromptBanner( width, height, options ) {
    Rectangle.call( this, 0, 0, width, height, 0, 0, { fill: BACKGROUND_FILL_COLOR } );
    var self = this;

    // @public These properties are the main API for this class, and they control what is and isn't shown on the banner.
    this.properties = new PropertySet( {

      // Challenge type being presented to user, valid values are 'buildIt' and 'findArea'.  This controls which title
      // is being shown.
      mode: 'buildIt',

      // Area that the user should be building, if any.
      targetArea: null,

      // Perimeter that the user should be building, if any.
      targetPerimeter: null,

      // Proportion spec, null if no proportions shown, of the form used in the challenges if present.
      targetProportions: null,

      // This flag controls whether the prompts are visible (i.e. the target area, target perimeter, target
      // proportions).  It should be toggled each time the prompts are updated for correct fade-in behavior.
      showPrompts: false,

      // Spec for fractional area building problems.
      buildProportions: { numerator: 1, denominator: 1, color1: 'black', color2: 'white' }
    } );

    var title = new Text( '', { font: TITLE_FONT, fill: TEXT_FILL_COLOR, centerY: height / 2 } );
    this.addChild( title );
    title.left = 20;

    this.properties.modeProperty.link( function( mode ) {
      switch( mode ) {
        case 'buildIt':
          title.text = buildItString;
          title.centerX = width / 2;
          break;
        case 'findArea':
          title.text = findTheAreaString;
          title.centerX = width / 2;
          break;
        default:
          title.text = 'undefined';
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

        var buildPromptCenterX = ( title.width + width ) / 2;
        var areaPromptText = targetArea ? StringUtils.format( areaEqualsString, targetArea ) : '';

        // Update the text of the area only prompt.
        areaOnlyPrompt.text = areaPromptText;
        areaPromptText.centerX = buildPromptCenterX;

        // Update the area+perimeter prompt
        var perimeterPromptText = targetPerimeter ? StringUtils.format( perimeterEqualsString, targetPerimeter ) : '';
        areaAndPerimeterPrompt.text = areaPromptText + '\n' + perimeterPromptText;
        areaAndPerimeterPrompt.centerX = buildPromptCenterX;
        areaAndPerimeterPrompt.centerY = height / 2;
      } );

    var targetProportionsPrompt = new Node();
    this.addChild( targetProportionsPrompt );

    this.properties.targetProportionsProperty.link( function( targetProportions ) {
      targetProportionsPrompt.removeAllChildren();
      if ( targetProportions ) {
        var colorProportionsPrompt = new ColorProportionsPrompt( targetProportions.color1,
          targetProportions.color2, targetProportions.color1ProportionNumerator,
          targetProportions.color1ProportionDenominator );
        colorProportionsPrompt.scale( height / colorProportionsPrompt.bounds.height * 0.9 );
        colorProportionsPrompt.right = width - TITLE_INDENT;
        colorProportionsPrompt.centerY = height / 2;
        targetProportionsPrompt.addChild( colorProportionsPrompt );
      }
    } );

    // Control the visibility of the various prompts.  The active prompts fade in what this property becomes true,
    // and disappear instantly when this prompt goes false.
    this.properties.showPromptsProperty.link( function( showPrompts ) {
      areaOnlyPrompt.visible = ( self.properties.targetArea !== null && self.properties.targetPerimeter === null ) && showPrompts;
      areaAndPerimeterPrompt.visible = ( self.properties.targetArea !== null && self.properties.targetPerimeter !== null ) && showPrompts;
      targetProportionsPrompt.visible = self.properties.targetProportions != null;
      if ( showPrompts && ( areaOnlyPrompt.visible || areaAndPerimeterPrompt.visible || targetProportionsPrompt.visible ) ) {
        // Move the title over to make room for the build prompt.
        new TWEEN.Tween( title ).to( { left: TITLE_INDENT }, ANIMATION_TIME ).easing( TWEEN.Easing.Cubic.InOut ).start();

        // Position the area and area+perimeter prompts
        if ( targetProportionsPrompt.visible ) {
          areaOnlyPrompt.centerX = ( title.width + TITLE_INDENT + targetProportionsPrompt.left ) / 2;
        }
        else {
          areaOnlyPrompt.centerX = ( width + title.width + TITLE_INDENT ) / 2;
        }
        areaAndPerimeterPrompt.centerX = areaOnlyPrompt.centerX;


        // Fade in whatever prompts are currently set to be visible.
        if ( areaOnlyPrompt.visible || areaAndPerimeterPrompt.visible ) {
          var promptToFadeIn = areaOnlyPrompt.visible ? areaOnlyPrompt : areaAndPerimeterPrompt;
          promptToFadeIn.opacity = 0;
          new TWEEN.Tween( promptToFadeIn ).to( { opacity: 1 }, ANIMATION_TIME ).easing( TWEEN.Easing.Cubic.InOut ).start();
        }
        if ( targetProportionsPrompt.visible ) {
          targetProportionsPrompt.opacity = 0;
          new TWEEN.Tween( targetProportionsPrompt ).to( { opacity: 1 }, ANIMATION_TIME ).easing( TWEEN.Easing.Cubic.InOut ).start();
        }
      }
      else {
        // Center the title.
        title.centerX = width / 2;
      }
    } );

    // Pass options through to parent class.
    this.mutate( options );
  }

  return inherit( Rectangle, ChallengePromptBanner, {
    reset: function() {
      this.properties.reset();
    }
  } );
} );