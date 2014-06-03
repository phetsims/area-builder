// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var SIZE = new Dimension2( 20, 16 ); // Proportions taken from screen shot of logo on main site
//  var SIZE = new Dimension2( 32, 24 ); // Proportions taken from screen shot of logo on main site

  function PaperAirplaneNode( options ) {
    Node.call( this );
    options = _.extend( { size: SIZE, fill: '#F2E916' }, options );

    // Define the shape.  This was done by trial and error and a little math.
    var bodyShape = new Shape();
    var width = options.size.width;
    var height = options.size.height;
    // main body
    bodyShape.moveTo( width, 0 ); // front tip
    bodyShape.lineTo( width * 0.8, height * 0.9 ); // right wing tip
    bodyShape.lineTo( width * 0.45, height * 0.725 );
    bodyShape.lineTo( width * 0.85, height * 0.2 );
    bodyShape.lineTo( width * 0.35, height * 0.675 );
    bodyShape.lineTo( 0, height * 0.5 ); // left wing tip
    bodyShape.close();
    // underneath part
    bodyShape.moveTo( width * 0.45, height * 0.8 );
    bodyShape.lineTo( width * 0.45, height );
    bodyShape.lineTo( width * 0.6, height * 0.875 );
    bodyShape.close();
    this.addChild( new Path( bodyShape, { fill: options.fill } ) );
    this.mutate( options );
  }

  return inherit( Node, PaperAirplaneNode, {
    //TODO prototypes
  } );
} );