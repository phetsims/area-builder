// Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the 'Game' screen of the Area Builder simulation.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {AreaBuilderGameModel} model
   * @constructor
   */
  function AreaBuilderGameView( model ) {

    var thisScreen = this;
    ScreenView.call( thisScreen );

    // Create the model-view transform.  The primary units used in the model
    // are meters, so significant zoom is used.  The multipliers for the 2nd
    // parameter can be used to adjust where the point (0, 0) in the model,
    // which is on the ground just below the center of the balance, is located
    // in the view.
    var mvt = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( thisScreen.layoutBounds.width * 0.375, thisScreen.layoutBounds.height * 0.79 ),
      105 );

    // TODO: temp - add a rectangle for visual reference.  This will eventually become the 'work area'.
    var tempWorkArea = new Rectangle( 0, 0, this.layoutBounds.width * 0.7, this.layoutBounds.height * 0.7, 0, 0, {
      fill: 'white',
      stroke: 'black',
      centerX: this.layoutBounds.width / 2,
      top: 50
    } );
    this.addChild( tempWorkArea );
    this.addChild( new Text( 'Game not yet implemented.', {
      font: new PhetFont( 40 ),
      fill: 'rgba( 220, 220, 220, 0.8 ',
      centerX: tempWorkArea.centerX,
      top: tempWorkArea.top + 100
    } ) );


  }

  return inherit( ScreenView, AreaBuilderGameView );
} );
