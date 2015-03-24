// Copyright 2002-2014, University of Colorado Boulder

/**
 * An accordion box that displays the area and perimeter of shape that may change dynamically.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var valuesString = require( 'string!AREA_BUILDER/values' );
  var areaString = require( 'string!AREA_BUILDER/area' );
  var perimeterString = require( 'string!AREA_BUILDER/perimeter' );

  // constants
  var DISPLAY_FONT = new PhetFont( 14 );

  /**
   * @param {Property<Object>} areaAndPerimeterProperty - An object containing values for area and perimeter
   * @param {Color} areaTextColor
   * @param {Color} perimeterTextColor
   * @param {Object} [options]
   * @constructor
   */
  function AreaAndPerimeterDisplay( areaAndPerimeterProperty, areaTextColor, perimeterTextColor, options ) {

    var contentNode = new Node();
    var areaCaption = new Text( areaString, { font: DISPLAY_FONT } );
    var perimeterCaption = new Text( perimeterString, { font: DISPLAY_FONT } );
    var tempTwoDigitString = new Text( '999', { font: DISPLAY_FONT } );
    var areaReadout = new Text( '', { font: DISPLAY_FONT, fill: areaTextColor } );
    var perimeterReadout = new Text( '', { font: DISPLAY_FONT, fill: perimeterTextColor } );

    contentNode.addChild( areaCaption );
    perimeterCaption.left = areaCaption.left;
    perimeterCaption.top = areaCaption.bottom + 5;
    contentNode.addChild( perimeterCaption );
    contentNode.addChild( areaReadout );
    contentNode.addChild( perimeterReadout );
    var readoutsRightEdge = Math.max( perimeterCaption.right, areaCaption.right ) + 8 + tempTwoDigitString.width;

    areaAndPerimeterProperty.link( function( areaAndPerimeter ) {
      areaReadout.text = areaAndPerimeter.area;
      areaReadout.bottom = areaCaption.bottom;
      areaReadout.right = readoutsRightEdge;
      perimeterReadout.text = areaAndPerimeter.perimeter;
      perimeterReadout.bottom = perimeterCaption.bottom;
      perimeterReadout.right = readoutsRightEdge;
    } );

    this.expanded = new Property( true );
    AccordionBox.call( this, contentNode, {
      titleNode: new Text( valuesString, { font: DISPLAY_FONT } ),
      titleAlignX: 'left',
      contentAlign: 'left',
      fill: 'white',
      showTitleWhenExpanded: false,
      contentXMargin: 8,
      contentYMargin: 4,
      expandedProperty: this.expanded
    } );

    this.mutate( options );
  }

  return inherit( AccordionBox, AreaAndPerimeterDisplay, {
    reset: function() {
      this.expanded.reset();
    }
  } );
} );