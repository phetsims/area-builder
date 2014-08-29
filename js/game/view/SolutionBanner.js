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
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var areaEqualsString = require( 'string!AREA_BUILDER/areaEquals' );
  var aSolutionString = require( 'string!AREA_BUILDER/aSolutionColon' );
  var perimeterEqualsString = require( 'string!AREA_BUILDER/perimeterEquals' );
  var solutionString = require( 'string!AREA_BUILDER/solutionColon' );

  // constants
  var BACKGROUND_FILL_COLOR = '#fbb03b';
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

    var title = new Text( '', { font: TITLE_FONT, fill: TEXT_FILL_COLOR, left: TITLE_INDENT } );
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
      title.centerY = height / 2;
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
        findTheAreaPrompt.centerX = ( title.width + width - TITLE_INDENT ) / 2;
      }
    } );

    var buildPrompt = new Node();
    this.addChild( buildPrompt );

    // Update the prompt that describes what the user should have built.
    this.properties.buildSpecProperty.link( function( buildSpec ) {
      buildPrompt.removeAllChildren();
      if ( buildSpec ) {
        assert && assert( buildSpec.area, 'All build specs are assumed to have an area value.' );
        var areaPrompt, perimeterPrompt, proportionsPrompt;

        areaPrompt = new Text( StringUtils.format( areaEqualsString, buildSpec.area ), {
          font: buildSpec.perimeter || buildSpec.proportions ? SMALLER_FONT : LARGE_FONT,
          fill: TEXT_FILL_COLOR
        } );
        buildPrompt.addChild( areaPrompt );

        if ( buildSpec.perimeter ) {
          perimeterPrompt = new Text( StringUtils.format( perimeterEqualsString, buildSpec.perimeter ), {
            font: SMALLER_FONT,
            fill: TEXT_FILL_COLOR
          } );
          buildPrompt.addChild( perimeterPrompt );
        }

        if ( buildSpec.proportions ) {
          proportionsPrompt = new ColorProportionsPrompt( buildSpec.proportions.color1, buildSpec.proportions.color2,
            buildSpec.proportions.color1Proportion, {
              font: new PhetFont( { size: 11 } ),
              textFill: TEXT_FILL_COLOR,
              left: areaPrompt.right + 7,
              centerY: areaPrompt.centerY
            }
          );
          buildPrompt.addChild( proportionsPrompt );

          // Add a comma to the area prompt, since this is put just after it.
          areaPrompt.text += ',';
        }

        // Layout
        if ( proportionsPrompt ) {
          proportionsPrompt.left = areaPrompt.right + 4;
        }
        if ( perimeterPrompt ) {
          perimeterPrompt.top = areaPrompt.bottom;
          if ( proportionsPrompt ) {
            perimeterPrompt.centerX = ( areaPrompt.left + proportionsPrompt.right ) / 2;
          }
        }

        // Center the build prompt horizontally between the title and the right edge of the banner.
        buildPrompt.centerX = ( title.width + width - TITLE_INDENT ) / 2;
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