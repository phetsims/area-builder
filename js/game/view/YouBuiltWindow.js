// Copyright 2002-2014, University of Colorado Boulder

/**
 * A Scenery node that is used to show the user what their attempted solution was for a challenge, generally used when
 * they got it wrong.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
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

  /**
   * @param width
   * @param height
   * @param options
   * @constructor
   */
  function YouBuiltWindow( width, height, options ) {
    Rectangle.call( this, 0, 0, width, height, 4, 4, { fill: '#F2E916', stroke: 'black' } );

    // title
    var youBuiltText = new Text( youBuiltString, { font: TITLE_FONT } );
    youBuiltText.scale( Math.min( ( width - 2 * X_MARGIN ) / youBuiltText.width, 1 ) );
    youBuiltText.top = 5;
    youBuiltText.centerX = width / 2;
    this.addChild( youBuiltText );

    // text for area only
    this.areaOnlyTextNode = new Text( StringUtils.format( areaEqualsString, 99 ), {
      font: VALUE_FONT
    } );
    this.areaOnlyTextNode.scale( Math.min( ( width - 2 * X_MARGIN ) / this.areaOnlyTextNode.width, 1 ) );
    this.areaOnlyTextNode.left = X_MARGIN;
    this.areaOnlyTextNode.centerY = height * 0.6;
    this.areaOnlyTextNode.visible = false;
    this.addChild( this.areaOnlyTextNode );

    // text for area and perimeter
    this.areaAndPerimeterTextNode = new MultiLineText( StringUtils.format( areaEqualsString, 99 ) + '\n' + StringUtils.format( perimeterEqualsString, 999 ), {
      font: VALUE_FONT,
      align: 'left'
    } );
    this.areaAndPerimeterTextNode.scale( Math.min( ( width - 2 * X_MARGIN ) / this.areaAndPerimeterTextNode.width, 1 ) );
    this.areaAndPerimeterTextNode.left = X_MARGIN;
    this.areaAndPerimeterTextNode.centerY = height * 0.6;
    this.areaAndPerimeterTextNode.visible = false;
    this.addChild( this.areaAndPerimeterTextNode );

    this.mutate( options );
  }

  return inherit( Rectangle, YouBuiltWindow, {
    setAreaOnly: function( area ) {
      this.areaOnlyTextNode.text = StringUtils.format( areaEqualsString, area );
      this.areaOnlyTextNode.visible = true;
      this.areaAndPerimeterTextNode.visible = false;
    },

    setAreaAndPerimeter: function( area, perimeter ) {
      this.areaAndPerimeterTextNode.text = StringUtils.format( areaEqualsString, area ) + '\n' +
                                           StringUtils.format( perimeterEqualsString, perimeter );
      this.areaAndPerimeterTextNode.visible = true;
      this.areaOnlyTextNode.visible = false;
    }
  } );
} );