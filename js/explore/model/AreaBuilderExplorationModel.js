// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main model class for the 'Explore' screen of the Area Builder simulation.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Bucket = require( 'PHETCOMMON/model/Bucket' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var MovableRectangle = require( 'AREA_BUILDER/common/model/MovableRectangle' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Property = require( 'AXON/Property' );
  var RectangleCreator = require( 'AREA_BUILDER/explore/model/RectangleCreator' );
  var ShapePlacementBoard = require( 'AREA_BUILDER/common/model/ShapePlacementBoard' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var UNIT_SQUARE_LENGTH = 40; // In screen coords, which are roughly pixels
  var UNIT_SQUARE_SIZE = new Dimension2( UNIT_SQUARE_LENGTH, UNIT_SQUARE_LENGTH );
  var SMALL_BOARD_SIZE = new Dimension2( UNIT_SQUARE_LENGTH * 8, UNIT_SQUARE_LENGTH * 8 );
  var LARGE_BOARD_SIZE = new Dimension2( UNIT_SQUARE_LENGTH * 16, UNIT_SQUARE_LENGTH * 8 );
  var PLAY_AREA_WIDTH = 768; // Based on default size in ScreenView.js
  var SPACE_BETWEEN_PLACEMENT_BOARDS = 40;
  var BOARD_Y_POS = 40;
  var BUCKET_SIZE = new Dimension2( 100, 50 );
  var BOARD_TO_BUCKET_Y_SPACING = 70;
  var INITIAL_NUM_SQUARES_OF_EACH_COLOR = 5;
  var INITIAL_OFFSET_POSITIONS = [
    // Offsets used for initial position of shape, relative to bucket hole center.  Empirically determined.
    new Vector2( -20 - UNIT_SQUARE_LENGTH / 2, 0 - UNIT_SQUARE_LENGTH / 2 ),
    new Vector2( -10 - UNIT_SQUARE_LENGTH / 2, -2 - UNIT_SQUARE_LENGTH / 2 ),
    new Vector2( 9 - UNIT_SQUARE_LENGTH / 2, 1 - UNIT_SQUARE_LENGTH / 2 ),
    new Vector2( 18 - UNIT_SQUARE_LENGTH / 2, 3 - UNIT_SQUARE_LENGTH / 2 ),
    new Vector2( 3 - UNIT_SQUARE_LENGTH / 2, 5 - UNIT_SQUARE_LENGTH / 2 )
  ];
  assert && assert( INITIAL_OFFSET_POSITIONS.length === INITIAL_NUM_SQUARES_OF_EACH_COLOR, 'Must have initial offsets for all shapes' );

  function AreaBuilderExplorationModel() {
    var thisModel = this;

    // TODO: If a bunch of properties are added, consider making this extend PropertySet
    this.showGrids = new Property( false ); // @public
    this.boardDisplayMode = new Property( 'single' ); // @public, value values are 'single' and 'dual'
    this.movableShapes = new ObservableArray();

    // Create the shape placement boards.
    thisModel.leftShapePlacementBoard = new ShapePlacementBoard(
      SMALL_BOARD_SIZE,
      UNIT_SQUARE_LENGTH,
      new Vector2( PLAY_AREA_WIDTH / 2 - SPACE_BETWEEN_PLACEMENT_BOARDS / 2 - SMALL_BOARD_SIZE.width, BOARD_Y_POS ),
      AreaBuilderSharedConstants.GREENISH_COLOR
    ); // @public
    thisModel.rightShapePlacementBoard = new ShapePlacementBoard(
      SMALL_BOARD_SIZE,
      UNIT_SQUARE_LENGTH,
      new Vector2( PLAY_AREA_WIDTH / 2 + SPACE_BETWEEN_PLACEMENT_BOARDS / 2, BOARD_Y_POS ),
      AreaBuilderSharedConstants.PURPLISH_COLOR
    ); // @public
    thisModel.centerShapePlacementBoard = new ShapePlacementBoard(
      LARGE_BOARD_SIZE,
      UNIT_SQUARE_LENGTH,
      new Vector2( PLAY_AREA_WIDTH / 2 - LARGE_BOARD_SIZE.width / 2, BOARD_Y_POS ),
      AreaBuilderSharedConstants.ORANGISH_COLOR
    ); // @public

    // Create the buckets that will hold the shapes.
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

    // Function for placing shapes when released by the user.
    var placementBoards = [ this.leftShapePlacementBoard, this.rightShapePlacementBoard, this.centerShapePlacementBoard ];

    function placeShape( shape ) {
      var shapePlaced = false;
      for ( var i = 0; i < placementBoards.length && !shapePlaced; i++ ) {
        shapePlaced = placementBoards[i].placeShape( shape );
      }
      // TODO: Handle removal of shapes placed outside the boards.
    }

    // Function for adding new movable elements to this model
    function addModelElement( newShape ) {
      thisModel.movableShapes.push( newShape );
      //TODO: Figure out how to unlink this function when the shape is removed from the model.
      newShape.userControlledProperty.link( function( userControlled ) {
        if ( !userControlled ) {
          placeShape( newShape );
        }
      } );
    }

    // Create the creator elements, which sit in the buckets and listen for
    // user clicks and subsequently add the movable elements to the model.
    this.rectangleCreators = [];
    var compensatedLeftBucketPos = new Vector2( thisModel.leftBucket.position.x, -thisModel.leftBucket.position.y );
    var compensatedRightBucketPos = new Vector2( thisModel.rightBucket.position.x, -thisModel.rightBucket.position.y );
    var compensatedCenterBucketPos = new Vector2( thisModel.centerBucket.position.x, -thisModel.centerBucket.position.y );
    _.times( INITIAL_NUM_SQUARES_OF_EACH_COLOR, function( index ) {
      thisModel.rectangleCreators.push( new RectangleCreator( UNIT_SQUARE_SIZE, compensatedLeftBucketPos.plus( INITIAL_OFFSET_POSITIONS[ index ] ),
        AreaBuilderSharedConstants.GREENISH_COLOR, addModelElement ) );
      thisModel.rectangleCreators.push( new RectangleCreator( UNIT_SQUARE_SIZE, compensatedRightBucketPos.plus( INITIAL_OFFSET_POSITIONS[ index ] ),
        AreaBuilderSharedConstants.PURPLISH_COLOR, addModelElement ) );
      thisModel.rectangleCreators.push( new RectangleCreator( UNIT_SQUARE_SIZE, compensatedCenterBucketPos.plus( INITIAL_OFFSET_POSITIONS[ index ] ),
        AreaBuilderSharedConstants.ORANGISH_COLOR, addModelElement ) );
    } );

    // Control the grid visibility in the placement boards
    this.showGrids.link( function( showGrids ) {
      thisModel.leftShapePlacementBoard.gridVisible = showGrids;
      thisModel.rightShapePlacementBoard.gridVisible = showGrids;
      thisModel.centerShapePlacementBoard.gridVisible = showGrids;
    } );
  }

  AreaBuilderExplorationModel.prototype = {

    // Resets all model elements
    reset: function() {
      // TODO
    }

  };

  return AreaBuilderExplorationModel;
} );