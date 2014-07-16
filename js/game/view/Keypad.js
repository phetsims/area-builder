// Copyright 2002-2014, University of Colorado Boulder

/**
 * A scenery node that looks like a key pad and allows the user to enter digits.  The entered digits are not displayed
 * by this node, and it is intended to be used in conjunction with a separate display of some sort.
 *
 * @author John Blanco
 * @author Andrey Zelenkov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SUN/HStrut' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @param options {Object}
   * @constructor
   */
  function Keypad( options ) {

    options = _.extend( {
      buttonFont: new PhetFont( { size: 20 } ),
      minButtonWidth: 35,
      minButtonHeight: 35,
      xSpacing: 10,
      ySpacing: 10,
      keyColor: 'white',
      maxDigits: 8 // Maximum number of digits that the user may enter
    }, options );

    var self = this;

    // @public String of digits entered by the user
    this.digitString = new Property( '' );

    // Function for creating a key
    function createNumberKey( number ) {
      return new RectangularPushButton( _.extend( {
        content: new Text( number.toString(), { font: options.buttonFont } ),
        baseColor: options.keyColor,
        minWidth: options.minButtonWidth,
        minHeight: options.minButtonHeight,
        xMargin: 5,
        yMargin: 5,
        listener: function() {
          if ( self.digitString.value.length < options.maxDigits ) {
            self.digitString.value += number.toString();
          }
        }
      }, options ) );
    }

    // backspace button
    var backspaceButton = new RectangularPushButton( {
      content: new Text( 'X' ),
      minWidth: options.minButtonWidth,
      minHeight: options.minButtonHeight,
      listener: function() {
        if ( self.digitString.value.length > 0 ) {
          // Remove the last digit from the string.
          self.digitString.value = self.digitString.value.slice( 0, -1 );
        }
      }
    } );

    // disable backspace button if user has not entered anything
    this.digitString.link( function( inputString ) {
      backspaceButton.enabled = inputString.length > 0;
    } );

    // Add the buttons.
    VBox.call( this, {spacing: options.ySpacing, children: [
      new HBox( {spacing: options.xSpacing, children: [
        createNumberKey( 7 ),
        createNumberKey( 8 ),
        createNumberKey( 9 )
      ] } ),
      new HBox( {spacing: options.xSpacing, children: [
        createNumberKey( 4 ),
        createNumberKey( 5 ),
        createNumberKey( 6 )
      ] } ),
      new HBox( {spacing: options.xSpacing, children: [
        createNumberKey( 1 ),
        createNumberKey( 2 ),
        createNumberKey( 3 )
      ] } ),
      new HBox( {spacing: options.xSpacing, children: [
        createNumberKey( 0 ),
        new HStrut( options.minButtonWidth ),
        backspaceButton
      ] } )
    ] } );

    // Pass options through to parent class
    this.mutate( options );
  }

  return inherit( VBox, Keypad );
} );
