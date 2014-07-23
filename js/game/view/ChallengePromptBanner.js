// Copyright 2002-2014, University of Colorado Boulder

/**
 * A Scenery node that displays the prompt for the challenges in the Area Builder game.  It looks like a banner with
 * text fields that vary for each of the different challenges.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var areaEqualsString = require( 'string!AREA_BUILDER/areaEquals' );
  var areaQuestionString = require( 'string!AREA_BUILDER/areaQuestion' );
  var buildItString = require( 'string!AREA_BUILDER/buildIt' );
  var findTheAreaString = require( 'string!AREA_BUILDER/findTheArea' );
  var perimeterEqualsString = require( 'string!AREA_BUILDER/perimeterEquals' );

  // constants
  var BACKGROUND_FILL_COLOR = '#2A3AFF';
  var TEXT_FILL_COLOR = 'white';
  var LARGE_FONT = new PhetFont( { size: 24, weight: 'bold' } ); // Font for single line text
  var SMALLER_FONT = new PhetFont( { size: 18 } ); // Font for two-line text

  /**
   * @param {Number} width
   * @param {Number} height
   * @param {Object} options
   * @constructor
   */
  function ChallengePromptBanner( width, height, options ) {
    Rectangle.call( this, 0, 0, width, height, 0, 0, { fill: BACKGROUND_FILL_COLOR } );

    // @public These properties are the main API for this class, and control what is and isn't shown on the banner.
    this.properties = new PropertySet( {
      mode: 'buildIt' // Challenge type being presented to user, valid values are 'buildIt' and 'findArea'.
    } );

    var title = new Text( '', { font: LARGE_FONT, fill: TEXT_FILL_COLOR, centerY: height / 2 } );
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

    // Pass options through to parent class.
    this.mutate( options );
  }

  return inherit( Rectangle, ChallengePromptBanner, {
    //TODO prototypes
  } );
} );