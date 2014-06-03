// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PushButton = require( 'SUN/buttons/RectangularPushButton' );

  // images
  var eraserImage = require( 'image!AREA_BUILDER/eraser.png' );

  // constants
  var ERASER_WIDTH = 20;  // width of eraser, used for scaling, the aspect ratio will determine height

  function EraserButton( options ) {
    var eraserImageNode = new Image( eraserImage );
    eraserImageNode.scale( ERASER_WIDTH / eraserImageNode.width );
    options = _.extend( { content: eraserImageNode, baseColor: '#F2E916' }, options );
    PushButton.call( this, options );
  }

  return inherit( PushButton, EraserButton );
} );