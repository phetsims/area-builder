// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var valuesString = require( 'string!AREA_BUILDER/values' );
  var areaString = require( 'string!AREA_BUILDER/area' );
  var perimeterString = require( 'string!AREA_BUILDER/perimeter' );

  // constants
  var DISPLAY_FONT = new PhetFont( 16 );

  function AreaAndPerimeterDisplay( areaProperty, areaTextColor, perimeterProperty, perimeterTextColor, options ) {
    Node.call( this );
    var contentNode = new Node();
    var areaCaption = new Text( areaString + ':', { font: DISPLAY_FONT } );
    var perimeterCaption = new Text( perimeterString + ':', { font: DISPLAY_FONT } );
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

    areaProperty.link( function( area ) {
      areaReadout.text = area;
      areaReadout.bottom = areaCaption.bottom;
      areaReadout.right = readoutsRightEdge;
    } );

    perimeterProperty.link( function( perimeter ) {
      perimeterReadout.text = perimeter;
      perimeterReadout.bottom = perimeterCaption.bottom;
      perimeterReadout.right = readoutsRightEdge;
    } );

    this.addChild( new AccordionBox( contentNode, {
      title: valuesString,
      titlePosition: 'left',
      font: DISPLAY_FONT,
      contentPosition: 'left',
      fill: 'white',
      showTitleWhenOpen: false,
      contentXMargin: 8,
      contentYMargin: 4
    } ) );

    this.mutate( options );
  }

  return inherit( Node, AreaAndPerimeterDisplay );
} );