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
  var Node = require( 'SCENERY/nodes/Node' );
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
  var BACKGROUND_FILL_COLOR = '#0071BD';
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

      // Specification for what the user should build, only relevant for the 'buildIt' challenges, null otherwise.
      buildSpec: null,

      // This flag controls whether the prompts are visible (i.e. the target area, target perimeter, target
      // proportions).  It should be toggled each time the prompts are updated for correct fade-in behavior.
      showPrompts: false,

      // Spec for fractional area building problems.
      buildProportions: { numerator: 1, denominator: 1, color1: 'black', color2: 'white' }
    } );

    var title = new Text( '', { font: TITLE_FONT, fill: TEXT_FILL_COLOR, centerY: height / 2 } );
    this.addChild( title );

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

    var buildPrompt = new Node();
    this.addChild( buildPrompt );

    this.properties.buildSpecProperty.link( function( buildSpec ) {
      if ( buildSpec ) {
        assert && assert( buildSpec.area, 'All build specs are assumed to have an area value.' );
        var areaPrompt, perimeterPrompt, proportionsPrompt;

        // TODO: There is some code consolidation that can be done below.

        buildPrompt.removeAllChildren();
        if ( !buildSpec.perimeter && !buildSpec.proportions ) {
          // This is an area-only challenge.
          buildPrompt.addChild( new Text( StringUtils.format( areaEqualsString, buildSpec.area ), {
            font: LARGE_FONT,
            fill: TEXT_FILL_COLOR,
            align: 'left',
            centerY: height / 2
          } ) );
        }
        else if ( buildSpec.perimeter && !buildSpec.proportions ) {
          // This is a perimeter+area challenge
          areaPrompt = new Text( StringUtils.format( areaEqualsString, buildSpec.area ), {
            font: SMALLER_FONT,
            fill: TEXT_FILL_COLOR
          } );
          perimeterPrompt = new Text( StringUtils.format( perimeterEqualsString, buildSpec.perimeter ), {
            font: SMALLER_FONT,
            fill: TEXT_FILL_COLOR
          } );
          buildPrompt.addChild( areaPrompt );
          perimeterPrompt.top = areaPrompt.bottom;
          buildPrompt.addChild( perimeterPrompt );
        }
        else if ( !buildSpec.perimeter && buildSpec.proportions ) {
          // This is a area+proportions challenge
          areaPrompt = new Text( StringUtils.format( areaEqualsString, buildSpec.area ) + ',', {
            font: SMALLER_FONT,
            fill: TEXT_FILL_COLOR,
            centerY: height / 2
          } );
          proportionsPrompt = new ColorProportionsPrompt( buildSpec.proportions.color1, buildSpec.proportions.color2,
            buildSpec.proportions.color1Proportion, {
              font: SMALLER_FONT,
              textFill: TEXT_FILL_COLOR,
              left: areaPrompt.right + 4,
              centerY: areaPrompt.centerY
            }
          );
          buildPrompt.addChild( areaPrompt );
          buildPrompt.addChild( proportionsPrompt );
        }
        else if ( buildSpec.perimeter && buildSpec.proportions ) {
          // This is a perimeter+area challenge
          areaPrompt = new Text( StringUtils.format( areaEqualsString, buildSpec.perimeter ) + ',', {
            font: SMALLER_FONT,
            fill: TEXT_FILL_COLOR
          } );
          proportionsPrompt = new ColorProportionsPrompt( buildSpec.proportions.color1, buildSpec.proportions.color2,
            buildSpec.proportions.color1Proportion, {
              font: SMALLER_FONT,
              textFill: TEXT_FILL_COLOR,
              left: areaPrompt.right + 4,
              centerY: areaPrompt.centerY
            }
          );
          perimeterPrompt = new Text( StringUtils.format( perimeterEqualsString, buildSpec.perimeter ), {
            font: SMALLER_FONT,
            fill: TEXT_FILL_COLOR,
            centerX: proportionsPrompt.right / 2
          } );
          buildPrompt.addChild( areaPrompt );
          buildPrompt.addChild( proportionsPrompt );
          perimeterPrompt.top = areaPrompt.bottom;
          buildPrompt.addChild( perimeterPrompt );
        }

        // Center the build prompt horizontally between the title and the right edge of the banner.
        buildPrompt.centerX = ( title.width + width ) / 2;
        buildPrompt.centerY = height / 2;
      }
    } );

    // Control the visibility of the various prompts.  The active prompts fade in what this property becomes true,
    // and disappear instantly when this prompt goes false.
    this.properties.showPromptsProperty.link( function( showPrompts ) {
      buildPrompt.visible = self.properties.buildSpec !== null && showPrompts;
      if ( showPrompts && buildPrompt.visible ) {
        // Move the title over to make room for the build prompt.
        new TWEEN.Tween( title ).to( { left: TITLE_INDENT }, ANIMATION_TIME ).easing( TWEEN.Easing.Cubic.InOut ).start();

        // Fade in the build prompt if it is now set to be visible.
        if ( buildPrompt.visible ) {
          buildPrompt.opacity = 0;
          new TWEEN.Tween( buildPrompt ).to( { opacity: 1 }, ANIMATION_TIME ).easing( TWEEN.Easing.Cubic.InOut ).start();
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