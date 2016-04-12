// Copyright 2014-2015, University of Colorado Boulder

/**
 * Banner that is used to present information to the user as they work through a challenge.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var ColorProportionsPrompt = require( 'AREA_BUILDER/game/view/ColorProportionsPrompt' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var areaEqualsString = require( 'string!AREA_BUILDER/areaEquals' );
  var perimeterEqualsString = require( 'string!AREA_BUILDER/perimeterEquals' );

  // constants
  var TEXT_FILL_COLOR = 'white';
  var TITLE_FONT = new PhetFont( { size: 24, weight: 'bold' } ); // Font used for the title
  var LARGER_FONT = new PhetFont( { size: 24 } ); // Font for single line text
  var SMALLER_FONT = new PhetFont( { size: 18 } ); // Font for two-line text
  var TITLE_INDENT = 15; // Empirically determined.
  var ANIMATION_TIME = 600; // In milliseconds

  /**
   * @param {Number} width
   * @param {Number} height
   * @param {String} backgroundColor
   * @param {Object} [options]
   * @constructor
   */
  function GameInfoBanner( width, height, backgroundColor, options ) {
    var self = this;
    Rectangle.call( this, 0, 0, width, height, 0, 0, { fill: backgroundColor } );

    // @public These properties are the main API for this class, and they control what is and isn't shown on the banner.
    this.titleTextProperty = new Property( '' );
    this.buildSpecProperty = new Property( null );
    this.areaToFindProperty = new Property( null );

    // Define the title.
    var title = new Text( this.titleTextProperty.value, {
      font: TITLE_FONT,
      fill: TEXT_FILL_COLOR,
      centerY: height / 2,
      maxWidth: width * 0.45 // must be less than half so it can slide over and provide room for other text
    } );
    this.addChild( title );

    // Update the title when the title text changes.
    this.titleTextProperty.link( function( titleText ) {
      title.text = titleText;
      if ( self.buildSpecProperty.value === null && self.areaToFindProperty.value === null ) {
        // There is no build spec are area to find, so center the title in the banner.
        title.centerX = width / 2;
      }
      else {
        // There is a build spec, so the title should be on the left to make room.
        title.left = TITLE_INDENT;
      }
    } );

    // Define the build prompt, which is shown in both the challenge prompt and the solution.
    var buildPrompt = new Node();
    this.addChild( buildPrompt );
    var areaPrompt = new Text( '', { font: SMALLER_FONT, fill: TEXT_FILL_COLOR, top: 0, maxWidth: width * 0.45 } );
    buildPrompt.addChild( areaPrompt );
    var perimeterPrompt = new Text( '', { font: SMALLER_FONT, fill: TEXT_FILL_COLOR, top: 0 } );
    buildPrompt.addChild( perimeterPrompt );
    var colorProportionPrompt = new ColorProportionsPrompt( 'black', 'white',
      new Fraction( 1, 1 ), {
        font: new PhetFont( { size: 11 } ),
        textFill: TEXT_FILL_COLOR,
        top: 0
      } );
    buildPrompt.addChild( colorProportionPrompt );

    // Function that moves the title from the center of the banner to the left side if it isn't already there.
    function moveTitleToSide() {
      if ( title.centerX === width / 2 ) {
        // Move the title over
        new TWEEN.Tween( title ).to( { left: TITLE_INDENT }, ANIMATION_TIME ).easing( TWEEN.Easing.Cubic.InOut ).start();

        // Fade in the build prompt if it is now set to be visible.
        if ( buildPrompt.visible ) {
          buildPrompt.opacity = 0;
          new TWEEN.Tween( buildPrompt ).to( { opacity: 1 }, ANIMATION_TIME ).easing( TWEEN.Easing.Cubic.InOut ).start();
        }
      }
    }

    // Function that positions the build prompt such that its visible bounds are centered in the space to the left of
    // the title.
    function positionTheBuildPrompt() {
      var centerX = ( TITLE_INDENT + title.width + width - TITLE_INDENT ) / 2;
      var centerY = height / 2;
      buildPrompt.left += centerX - buildPrompt.visibleBounds.centerX;
      buildPrompt.top += centerY - buildPrompt.visibleBounds.centerY;
    }

    // Update the prompt or solution text based on the build spec.
    this.buildSpecProperty.link( function( buildSpec ) {
      assert && assert( self.areaToFindProperty.value === null, 'Can\'t display area to find and build spec at the same time.' );
      assert && assert( buildSpec === null || buildSpec.area, 'Area must be specified in the build spec' );
      if ( buildSpec !== null ) {
        areaPrompt.text = StringUtils.format( areaEqualsString, buildSpec.area );
        areaPrompt.visible = true;
        if ( !buildSpec.perimeter && !buildSpec.proportions ) {
          areaPrompt.font = LARGER_FONT;
          perimeterPrompt.visible = false;
          colorProportionPrompt.visible = false;
        }
        else {
          areaPrompt.font = SMALLER_FONT;
          if ( buildSpec.perimeter ) {
            perimeterPrompt.text = StringUtils.format( perimeterEqualsString, buildSpec.perimeter );
            perimeterPrompt.visible = true;
          }
          else {
            perimeterPrompt.visible = false;
          }
          if ( buildSpec.proportions ) {
            areaPrompt.text += ',';
            colorProportionPrompt.color1 = buildSpec.proportions.color1;
            colorProportionPrompt.color2 = buildSpec.proportions.color2;
            colorProportionPrompt.color1Proportion = buildSpec.proportions.color1Proportion;
            colorProportionPrompt.visible = true;
          }
          else {
            colorProportionPrompt.visible = false;
          }
        }

        // Update the layout
        perimeterPrompt.top = areaPrompt.bottom + areaPrompt.height * 0.25; // Spacing empirically determined.
        colorProportionPrompt.left = areaPrompt.right + 10; // Spacing empirically determined
        colorProportionPrompt.centerY = areaPrompt.centerY;
        positionTheBuildPrompt();

        // Make sure the title is over on the left side.
        moveTitleToSide();
      }
      else {
        areaPrompt.visible = self.areaToFindProperty.value !== null;
        perimeterPrompt.visible = false;
        colorProportionPrompt.visible = false;
      }
    } );

    // Update the area indication (used in solution for 'find the area' challenges).
    this.areaToFindProperty.link( function( areaToFind ) {
      assert && assert( self.buildSpecProperty.value === null, 'Can\'t display area to find and build spec at the same time.' );
      if ( areaToFind !== null ) {
        areaPrompt.text = StringUtils.format( areaEqualsString, areaToFind );
        areaPrompt.font = LARGER_FONT;
        areaPrompt.visible = true;

        // The other prompts (perimeter and color proportions) are not shown in this situation.
        perimeterPrompt.visible = false;
        colorProportionPrompt.visible = false;

        // Place the build prompt where it needs to go.
        positionTheBuildPrompt();

        // Make sure the title is over on the left side.
        moveTitleToSide();
      }
      else {
        areaPrompt.visible = self.buildSpecProperty.value !== null;
      }
    } );

    // Pass options through to parent class.
    this.mutate( options );
  }

  return inherit( Rectangle, GameInfoBanner, {
    reset: function() {
      this.titleTextProperty.reset();
      this.buildSpecProperty.reset();
      this.areaToFindProperty.reset();
    }
  } );
} );