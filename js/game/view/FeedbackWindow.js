// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var areaEqualsString = require( 'string!AREA_BUILDER/areaEquals' );
  var perimeterEqualsString = require( 'string!AREA_BUILDER/perimeterEquals' );
  var yourGoalString = require( 'string!AREA_BUILDER/yourGoal' );
  var yourSolutionString = require( 'string!AREA_BUILDER/yourSolution' );

  // constants
  var FONT = new PhetFont( { size: 20, weight: 'bold' } );
  var PROMPT_TO_INFO_HORIZONTAL_SPACING = 20;
  var GOAL_TO_SOLUTION_VERTICAL_SPACING = 50;
  var OPACITY = 0.9;

  /**
   * @param {Number} goalArea Area goal for the problem presented to the user.
   * @param {Number} goalPerimeter Perimeter goal for the problem presented to the user, null if no perimeter
   * specified as part of the challenge.
   * @param {Number} solutionArea Area that was actually created and submitted by the user.
   * @param {Number} solutionPerimeter Perimeter that was actually created and submitted by the user, will not be shown
   * if goalPerimeter is null.
   * @param options
   * @constructor
   */
  function FeedbackWindow( goalArea, goalPerimeter, solutionArea, solutionPerimeter, options ) {
    Node.call( this );
    _.extend( { minWidth: 0, minHeight: 0 }, options );

    var yourGoalText = new Text( yourGoalString, { font: FONT } );
    var yourSolutionText = new Text( yourSolutionString, { font: FONT } );
    var goalInfoNode;
    var solutionInfoNode;
    if ( goalPerimeter ) {
      goalInfoNode = new VBox( {
        children: [
          new Text( StringUtils.format( areaEqualsString, goalArea ), { font: FONT } ),
          new Text( StringUtils.format( perimeterEqualsString, goalPerimeter ), { font: FONT } )
        ],
        align: 'left'
      } );
      solutionInfoNode = new VBox( {
        children: [
          new Text( StringUtils.format( areaEqualsString, solutionArea ), { font: FONT } ),
          new Text( StringUtils.format( perimeterEqualsString, solutionPerimeter ), { font: FONT } )
        ],
        align: 'left'
      } );
    }
    else {
      goalInfoNode = new Text( StringUtils.format( areaEqualsString, goalArea ), { font: FONT } );
      solutionInfoNode = new Text( StringUtils.format( areaEqualsString, solutionArea ), { font: FONT } );
    }

    // Layout
    var contentNode = new Node();
    var infoXOffset = Math.max( yourGoalText.width, yourSolutionText.width ) + PROMPT_TO_INFO_HORIZONTAL_SPACING;
    goalInfoNode.left = infoXOffset;
    solutionInfoNode.left = infoXOffset;
    solutionInfoNode.top = goalInfoNode.bottom + GOAL_TO_SOLUTION_VERTICAL_SPACING;
    yourGoalText.centerY = goalInfoNode.centerY;
    yourSolutionText.centerY = solutionInfoNode.centerY;
    contentNode.addChild( yourGoalText );
    contentNode.addChild( goalInfoNode );
    contentNode.addChild( yourSolutionText );
    contentNode.addChild( solutionInfoNode );

    var panelOptions = { cornerRadius: 0 };
    if ( options.minWidth > contentNode.width ) {
      panelOptions.xMargin = ( options.minWidth - contentNode.width ) / 2;
    }
    if ( options.minHeight > contentNode.height ) {
      panelOptions.yMargin = ( options.minHeight - contentNode.height ) / 2;
    }

    this.addChild( new Panel( contentNode, panelOptions ) );
    this.opacity = OPACITY;

    this.mutate( options );
  }

  return inherit( Node, FeedbackWindow );
} );