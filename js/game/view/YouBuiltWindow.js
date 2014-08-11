// Copyright 2002-2014, University of Colorado Boulder

/**
 * A Scenery node that is used to show the user what their attempted solution was for a challenge, generally used when
 * they got it wrong.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ColorProportionsPrompt = require( 'AREA_BUILDER/game/view/ColorProportionsPrompt' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var areaEqualsString = require( 'string!AREA_BUILDER/areaEquals' );
  var perimeterEqualsString = require( 'string!AREA_BUILDER/perimeterEquals' );
  var youBuiltString = require( 'string!AREA_BUILDER/youBuilt' );

  // constants
  var X_MARGIN = 5;
  var TITLE_FONT = new PhetFont( { size: 20, weight: 'bold' } );
  var VALUE_FONT = new PhetFont( { size: 18 } );
  var LINE_SPACING = 5;

  /**
   * @param width
   * @param options
   * @constructor
   */
  function YouBuiltWindow( width, options ) {

    options = _.extend( { fill: '#F2E916', stroke: 'black' }, options );

    // content root
    this.contentNode = new Node();

    // title
    var youBuiltText = new Text( youBuiltString, { font: TITLE_FONT } );
    youBuiltText.scale( Math.min( ( width - 2 * X_MARGIN ) / youBuiltText.width, 1 ) );
    youBuiltText.top = 5;
    this.contentNode.addChild( youBuiltText );

    // TODO: Scale everything below so that we're sure it will fit when translated.

    // area text
    this.areaTextNode = new Text( StringUtils.format( areaEqualsString, 99 ), {
      font: VALUE_FONT,
      top: youBuiltText.bottom + LINE_SPACING
    } );
    this.contentNode.addChild( this.areaTextNode );

    // perimeter text
    this.perimeterTextNode = new Text( StringUtils.format( perimeterEqualsString, 99 ), {
      font: VALUE_FONT,
      top: this.areaTextNode.bottom + LINE_SPACING
    } );
    this.contentNode.addChild( this.perimeterTextNode );

    // proportion info is initially set to null, added and removed when needed.
    this.proportionsInfoNode = null;

    // constructor - called here because content with no bounds doesn't work
    Panel.call( this, this.contentNode, options );
  }

  return inherit( Panel, YouBuiltWindow, {

    // @private
    removeProportionInfo: function() {
      if ( this.proportionsInfoNode !== null ) {
        this.contentNode.removeChild( this.proportionsInfoNode );
        this.proportionsInfoNode = null;
      }
    },

    // @public
    setAreaOnly: function( area ) {
      this.areaTextNode.text = StringUtils.format( areaEqualsString, area );
      this.perimeterTextNode.visible = false;
      this.removeProportionInfo();
    },

    // @public
    setAreaAndPerimeter: function( area, perimeter ) {
      this.areaTextNode.text = StringUtils.format( areaEqualsString, area );
      this.perimeterTextNode.text = StringUtils.format( perimeterEqualsString, perimeter );
      this.perimeterTextNode.top = this.areaTextNode.bottom + LINE_SPACING;
      this.perimeterTextNode.visible = true;
      this.removeProportionInfo();
    },

    // @public
    setAreaAndProportions: function( area, color1, color2, color1Proportion ) {
      this.setAreaOnly( area );
      this.proportionsInfoNode = new ColorProportionsPrompt( color1, color2, color1Proportion, {
        left: 0,
        top: this.areaTextNode.bottom + LINE_SPACING,
        multiLine: true
      } );
      this.contentNode.addChild( this.proportionsInfoNode );
    },

    // @public
    setAreaPerimeterAndProportions: function( area, perimeter, color1, color2, color1Proportion ) {

      // area
      this.setAreaOnly( area );

      // proportions, which sit just below area so that it is clear that they go together
      this.proportionsInfoNode = new ColorProportionsPrompt( color1, color2, color1Proportion, {
        top: this.areaTextNode.bottom + LINE_SPACING
      } );
      this.contentNode.addChild( this.proportionsInfoNode );

      // perimeter, at the bottom
      this.perimeterTextNode.text = StringUtils.format( perimeterEqualsString, perimeter );
      this.perimeterTextNode.top = this.proportionsInfoNode.bottom + LINE_SPACING;
      this.perimeterTextNode.visible = true;
    }
  } );
} );