// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main model class for the 'Explore' screen of the Area simulation.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var Property = require( 'AXON/Property' );
  var ShapePlacementBoard = require( 'AREA/common/model/ShapePlacementBoard' );
  var Vector2 = require( 'DOT/Vector2' );
  var Bucket = require( 'PHETCOMMON/model/Bucket' );
  var AreaSharedConstants = require( 'AREA/common/AreaSharedConstants' );
  var MovableRectangle = require( 'AREA/common/model/MovableRectangle' );

  // constants
  var UNIT_SQUARE_LENGTH = 40; // In screen coords, which are roughly pixels
  var SMALL_BOARD_SIZE = new Dimension2( UNIT_SQUARE_LENGTH * 8, UNIT_SQUARE_LENGTH * 8 );
  var LARGE_BOARD_SIZE = new Dimension2( UNIT_SQUARE_LENGTH * 16, UNIT_SQUARE_LENGTH * 8 );
  var PLAY_AREA_WIDTH = 768; // Based on default size in ScreenView.js
  var SPACE_BETWEEN_PLACEMENT_BOARDS = 40;
  var BOARD_Y_POS = 40;
  var BUCKET_SIZE = new Dimension2( 100, 50 );
  var BOARD_TO_BUCKET_Y_SPACING = 70;
  var NUM_SQUARES_OF_EACH_COLOR = 1;

  function AreaExplorationModel() {
    var thisModel = this;

    // TODO: If a bunch of properties are added, consider making this extend PropertySet
    this.showGrids = new Property( false ); // @public
    this.boardDisplayMode = new Property( 'single' ); // @public, value values are 'single' and 'dual'

    // List of the shapes contained in this model
    this.movableShapes = [];
    _.times( NUM_SQUARES_OF_EACH_COLOR, function() {
      thisModel.movableShapes.push( new MovableRectangle( new Dimension2( UNIT_SQUARE_LENGTH, UNIT_SQUARE_LENGTH ), AreaSharedConstants.GREENISH_COLOR, Vector2.ZERO ) );
      thisModel.movableShapes.push( new MovableRectangle( new Dimension2( UNIT_SQUARE_LENGTH, UNIT_SQUARE_LENGTH ), AreaSharedConstants.PURPLISH_COLOR, Vector2.ZERO ) );
      thisModel.movableShapes.push( new MovableRectangle( new Dimension2( UNIT_SQUARE_LENGTH, UNIT_SQUARE_LENGTH ), AreaSharedConstants.ORANGISH_COLOR, Vector2.ZERO ) );
    } );

    // Create the shape placement boards
    thisModel.leftShapePlacementBoard = new ShapePlacementBoard(
      SMALL_BOARD_SIZE,
      UNIT_SQUARE_LENGTH,
      new Vector2( PLAY_AREA_WIDTH / 2 - SPACE_BETWEEN_PLACEMENT_BOARDS / 2 - SMALL_BOARD_SIZE.width, BOARD_Y_POS ) ); // @public
    thisModel.rightShapePlacementBoard = new ShapePlacementBoard(
      SMALL_BOARD_SIZE,
      UNIT_SQUARE_LENGTH,
      new Vector2( PLAY_AREA_WIDTH / 2 + SPACE_BETWEEN_PLACEMENT_BOARDS / 2, BOARD_Y_POS ) ); // @public
    thisModel.centerShapePlacementBoard = new ShapePlacementBoard(
      LARGE_BOARD_SIZE,
      UNIT_SQUARE_LENGTH,
      new Vector2( PLAY_AREA_WIDTH / 2 - LARGE_BOARD_SIZE.width / 2, BOARD_Y_POS ) ); // @public

    // Create the buckets that will hold the shapes
    // TODO: The bucket positions are hokey here because the implementation
    // TODO: assumes an inverted Y direction.  The common code should be made
    // TODO: to work with this if the buckets are retained in the UI design.
    var bucketYPos = -( thisModel.leftShapePlacementBoard.position.y + SMALL_BOARD_SIZE.height + BOARD_TO_BUCKET_Y_SPACING );
    this.leftBucket = new Bucket( {
      position: new Vector2( thisModel.leftShapePlacementBoard.position.x + SMALL_BOARD_SIZE.width * 0.67, bucketYPos ),
      baseColor: '#000080',
      caption: '',
      size: BUCKET_SIZE
    } );
    this.rightBucket = new Bucket( {
      position: new Vector2( thisModel.rightShapePlacementBoard.position.x + SMALL_BOARD_SIZE.width * 0.33, bucketYPos ),
      baseColor: '#000080',
      caption: '',
      size: BUCKET_SIZE
    } );
    this.centerBucket = new Bucket( {
      position: new Vector2( thisModel.centerShapePlacementBoard.position.x + LARGE_BOARD_SIZE.width / 2, bucketYPos ),
      baseColor: '#000080',
      caption: '',
      size: BUCKET_SIZE
    } );

    // Control grid visibility
    this.showGrids.link( function( showGrids ) {
      thisModel.leftShapePlacementBoard.gridVisible = showGrids;
      thisModel.rightShapePlacementBoard.gridVisible = showGrids;
      thisModel.centerShapePlacementBoard.gridVisible = showGrids;
    } );
  }

  AreaExplorationModel.prototype = {

    // Resets all model elements
    reset: function() {
      // TODO
    }

  };

  return AreaExplorationModel;
} );
