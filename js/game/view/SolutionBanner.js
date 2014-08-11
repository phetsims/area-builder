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

      // Challenge type being presented to user, valid values are 'buildIt' and 'findArea'.
      mode: 'buildIt',

      // Specification of what the user should have built.
      buildSpec: null,

      // Area value for the 'findArea' style of challenge
      findAreaValue: null
    } );

    var title = new Text( '', { font: TITLE_FONT, fill: TEXT_FILL_COLOR, centerY: height / 2, left: TITLE_INDENT } );
    this.addChild( title );

    // Update the title based on the problem type.
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
    } );

    var findTheAreaPrompt = new Text( '', {
      font: LARGE_FONT,
      fill: TEXT_FILL_COLOR,
      centerY: height / 2
    } );
    this.addChild( findTheAreaPrompt );

    // Update the area value for the 'find the area' style of challenge
    this.properties.findAreaValueProperty.link( function( area ) {
      findTheAreaPrompt.visible = area !== null;
      if ( findTheAreaPrompt.visible ) {
        findTheAreaPrompt.text = StringUtils.format( areaEqualsString, area );
        findTheAreaPrompt.centerX = ( title.width + width - TITLE_INDENT ) / 2
      }
    } );

    var buildPrompt = new Node();
    this.addChild( buildPrompt );

    // Update the prompt that describes what the user should have built.
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

    // Pass options through to parent class.
    this.mutate( options );
  }

  return inherit( Rectangle, SolutionBanner, {
    reset: function() {
      this.properties.reset();
    }
  } );
} );