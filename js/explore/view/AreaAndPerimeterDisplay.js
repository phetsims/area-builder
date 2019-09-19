// Copyright 2014-2019, University of Colorado Boulder

/**
 * An accordion box that displays the area and perimeter of shape that may change dynamically.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const areaBuilder = require( 'AREA_BUILDER/areaBuilder' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const areaString = require( 'string!AREA_BUILDER/area' );
  const perimeterString = require( 'string!AREA_BUILDER/perimeter' );
  const valuesString = require( 'string!AREA_BUILDER/values' );

  // constants
  var DISPLAY_FONT = new PhetFont( 14 );
  var MAX_CONTENT_WIDTH = 200; // empirically determined, supports translation
  var MAX_TITLE_WIDTH = 190; // empirically determined, supports translation

  /**
   * @param {Property<Object>} areaAndPerimeterProperty - An object containing values for area and perimeter
   * @param {Color} areaTextColor
   * @param {Color} perimeterTextColor
   * @param {Object} [options]
   * @constructor
   */
  function AreaAndPerimeterDisplay( areaAndPerimeterProperty, areaTextColor, perimeterTextColor, options ) {

    options = _.extend( {
      maxWidth: Number.POSITIVE_INFINITY
    }, options );

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

    // in support of translation, scale the content node if it's too big
    if ( contentNode.width > MAX_CONTENT_WIDTH ){
      contentNode.scale( MAX_CONTENT_WIDTH / contentNode.width );
    }

    this.expandedProperty = new Property( true );
    AccordionBox.call( this, contentNode, {
      cornerRadius: 3,
      titleNode: new Text( valuesString, { font: DISPLAY_FONT, maxWidth: MAX_TITLE_WIDTH } ),
      titleAlignX: 'left',
      contentAlign: 'left',
      fill: 'white',
      showTitleWhenExpanded: false,
      contentXMargin: 8,
      contentYMargin: 4,
      expandedProperty: this.expandedProperty,
      expandCollapseButtonOptions: {
        touchAreaXDilation: 10,
        touchAreaYDilation: 10
      }
    } );

    this.mutate( options );
  }

  areaBuilder.register( 'AreaAndPerimeterDisplay', AreaAndPerimeterDisplay );

  return inherit( AccordionBox, AreaAndPerimeterDisplay, {
    reset: function() {
      this.expandedProperty.reset();
    }
  } );
} );