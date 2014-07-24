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
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var areaEqualsString = require( 'string!AREA_BUILDER/areaEquals' );
  var perimeterEqualsString = require( 'string!AREA_BUILDER/perimeterEquals' );
  var yourSolutionString = require( 'string!AREA_BUILDER/yourSolution' );

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
  function YourSolutionWindow( width, height, options ) {
    Rectangle.call( this, 0, 0, width, height, 4, 4, { fill: 'white', stroke: 'black' } );

    // title
    var yourSolutionText = new Text( yourSolutionString, { font: TITLE_FONT } );
    yourSolutionText.scale( Math.min( ( width - 2 * X_MARGIN ) / yourSolutionText.width, 1 ) );
    yourSolutionText.top = 5;
    yourSolutionText.centerX = width / 2;
    this.addChild( yourSolutionText );

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

  return inherit( Rectangle, YourSolutionWindow, {
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