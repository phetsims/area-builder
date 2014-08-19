// Copyright 2002-2014, University of Colorado Boulder

/**
 * A Scenery node that is used to show the user what they constructed for a 'Build it' style of challenge.  It can be
 * dynamically updated if needed.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ColorProportionsPrompt = require( 'AREA_BUILDER/game/view/ColorProportionsPrompt' );
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
   * Constructor for the window that shows the user what they built.  It is constructed with no contents, and the
   * contents are added later when the build spec is set.
   *
   * @param maxWidth
   * @param options
   * @constructor
   */
  function YouBuiltWindow( maxWidth, options ) {

    options = _.extend( { fill: '#F2E916', stroke: 'black' }, options );

    // content root
    this.contentNode = new Node();

    // Keep a snapshot of the previous build spec so that we can only update the portions that need it.
    this.previousBuildSpec = null;

    // title
    var youBuiltText = new Text( youBuiltString, { font: TITLE_FONT } );
    youBuiltText.scale( Math.min( ( maxWidth - 2 * X_MARGIN ) / youBuiltText.width, 1 ) );
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
    proportionSpecsAreEqual: function( buildSpec1, buildSpec2 ) {

      // If one of the build specs is null and the other isn't, they aren't equal.
      if ( ( buildSpec1 === null && buildSpec2 !== null ) || ( buildSpec1 !== null && buildSpec2 === null ) ) {
        return false;
      }

      // If one has a proportions spec and the other doesn't, they aren't equal.
      if ( ( buildSpec1.proportions && !buildSpec2.proportions ) || ( !buildSpec1.proportions && buildSpec2.proportions ) ) {
        return false;
      }

      // If they both don't have a proportions spec, they are equal.
      if ( !buildSpec1.proportions && !buildSpec2.proportions ) {
        return true;
      }

      // At this point, both build specs appear to have proportions fields.  Verify that the fields are correct.
      assert && assert( buildSpec1.proportions.color1 && buildSpec1.proportions.color2 && buildSpec1.proportions.color1Proportion,
        'malformed proportions specification' );
      assert && assert( buildSpec2.proportions.color1 && buildSpec2.proportions.color2 && buildSpec2.proportions.color1Proportion,
        'malformed proportions specification' );

      // Return true if all elements of both proportions specs match, false otherwise.
      return ( buildSpec1.color1 === buildSpec2.color1 &&
               buildSpec1.color2 === buildSpec2.color2 &&
               buildSpec1.color1Proportion.equals( buildSpec2.color1Proportion ) );
    },

    // @public Sets the build spec that is currently being portrayed in the window.
    setBuildSpec: function( buildSpec ) {

      // Set the area value, which is always shown.
      this.areaTextNode.text = StringUtils.format( areaEqualsString, buildSpec.area );

      var rollingBottom = this.areaTextNode.bottom;

      // If proportions have changed, update them.  They sit beneath the area in the layout so that it is clear that
      // they go together.
      if ( !this.proportionSpecsAreEqual( buildSpec, this.previousBuildSpec ) ) {
        if ( this.proportionsInfoNode ) {
          this.contentNode.removeChild( this.proportionsInfoNode );
          this.proportionsInfoNode = null;
        }
        if ( buildSpec.proportions ) {
          this.proportionsInfoNode = new ColorProportionsPrompt( buildSpec.proportions.color1,
            buildSpec.proportions.color2, buildSpec.proportions.color1Proportion, {
              top: rollingBottom + LINE_SPACING,
              multiLine: true
            } );
          this.contentNode.addChild( this.proportionsInfoNode );
          rollingBottom = this.proportionsInfoNode.bottom;
        }
      }

      // If perimeter is specified, update it, otherwise hide it.
      if ( buildSpec.perimeter ) {
        this.perimeterTextNode.text = StringUtils.format( perimeterEqualsString, buildSpec.perimeter );
        this.perimeterTextNode.visible = true;
        this.perimeterTextNode.top = rollingBottom + LINE_SPACING;
      }
      else {
        this.perimeterTextNode.visible = false;
      }
    }
  } );
} );