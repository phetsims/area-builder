// Copyright 2014-2017, University of Colorado Boulder

/**
 * Primary model class for the 'Explore' screen of the Area Builder simulation.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const areaBuilder = require( 'AREA_BUILDER/areaBuilder' );
  const AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  const Bucket = require( 'PHETCOMMON/model/Bucket' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MovableShape = require( 'AREA_BUILDER/common/model/MovableShape' );
  const ObservableArray = require( 'AXON/ObservableArray' );
  const Property = require( 'AXON/Property' );
  const Shape = require( 'KITE/Shape' );
  const ShapePlacementBoard = require( 'AREA_BUILDER/common/model/ShapePlacementBoard' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  var UNIT_SQUARE_LENGTH = AreaBuilderSharedConstants.UNIT_SQUARE_LENGTH;
  var UNIT_SQUARE_SHAPE = Shape.rect( 0, 0, UNIT_SQUARE_LENGTH, UNIT_SQUARE_LENGTH );
  var SMALL_BOARD_SIZE = new Dimension2( UNIT_SQUARE_LENGTH * 9, UNIT_SQUARE_LENGTH * 8 );
  var LARGE_BOARD_SIZE = new Dimension2( UNIT_SQUARE_LENGTH * 19, UNIT_SQUARE_LENGTH * 8 );
  var PLAY_AREA_WIDTH = AreaBuilderSharedConstants.LAYOUT_BOUNDS.width;
  var SPACE_BETWEEN_PLACEMENT_BOARDS = UNIT_SQUARE_LENGTH;
  var BOARD_Y_POS = 70; // Empirically determined from looking at the layout
  var BUCKET_SIZE = new Dimension2( 90, 45 );
  var BOARD_TO_BUCKET_Y_SPACING = 45;

  /**
   * @constructor
   */
  function AreaBuilderExploreModel() {

    this.showShapeBoardGridsProperty = new Property( true ); // @public
    this.showDimensionsProperty = new Property( true ); // @public
    this.boardDisplayModeProperty = new Property( 'single' ); // @public, value values are 'single' and 'dual'

    this.movableShapes = new ObservableArray(); // @public
    this.unitSquareLength = UNIT_SQUARE_LENGTH; // @public, @final

    // Create the shape placement boards. Each boardDisplayMode has its own set of boards and buckets so that state can
    // be preserved when switching modes.
    this.leftShapePlacementBoard = new ShapePlacementBoard(
      SMALL_BOARD_SIZE,
      UNIT_SQUARE_LENGTH,
      new Vector2( PLAY_AREA_WIDTH / 2 - SPACE_BETWEEN_PLACEMENT_BOARDS / 2 - SMALL_BOARD_SIZE.width, BOARD_Y_POS ),
      AreaBuilderSharedConstants.GREENISH_COLOR,
      this.showShapeBoardGridsProperty,
      this.showDimensionsProperty
    ); // @public
    this.rightShapePlacementBoard = new ShapePlacementBoard(
      SMALL_BOARD_SIZE,
      UNIT_SQUARE_LENGTH,
      new Vector2( PLAY_AREA_WIDTH / 2 + SPACE_BETWEEN_PLACEMENT_BOARDS / 2, BOARD_Y_POS ),
      AreaBuilderSharedConstants.PURPLISH_COLOR,
      this.showShapeBoardGridsProperty,
      this.showDimensionsProperty
    ); // @public
    this.singleShapePlacementBoard = new ShapePlacementBoard(
      LARGE_BOARD_SIZE,
      UNIT_SQUARE_LENGTH,
      new Vector2( PLAY_AREA_WIDTH / 2 - LARGE_BOARD_SIZE.width / 2, BOARD_Y_POS ),
      AreaBuilderSharedConstants.ORANGISH_COLOR,
      this.showShapeBoardGridsProperty,
      this.showDimensionsProperty
    ); // @public

    // @private, for convenience.
    this.shapePlacementBoards = [ this.leftShapePlacementBoard, this.rightShapePlacementBoard, this.singleShapePlacementBoard ];

    // Create the buckets that will hold the shapes.
    var bucketYPos = this.leftShapePlacementBoard.bounds.minY + SMALL_BOARD_SIZE.height + BOARD_TO_BUCKET_Y_SPACING;
    this.leftBucket = new Bucket( {
      position: new Vector2( this.leftShapePlacementBoard.bounds.minX + SMALL_BOARD_SIZE.width * 0.7, bucketYPos ),
      baseColor: '#000080',
      size: BUCKET_SIZE,
      invertY: true
    } );
    this.rightBucket = new Bucket( {
      position: new Vector2( this.rightShapePlacementBoard.bounds.minX + SMALL_BOARD_SIZE.width * 0.3, bucketYPos ),
      baseColor: '#000080',
      size: BUCKET_SIZE,
      invertY: true
    } );
    this.singleModeBucket = new Bucket( {
      position: new Vector2( this.singleShapePlacementBoard.bounds.minX + LARGE_BOARD_SIZE.width / 2, bucketYPos ),
      baseColor: '#000080',
      size: BUCKET_SIZE,
      invertY: true
    } );
  }

  areaBuilder.register( 'AreaBuilderExploreModel', AreaBuilderExploreModel );

  return inherit( Object, AreaBuilderExploreModel, {

    step: function( dt ) {
      this.movableShapes.forEach( function( movableShape ) { movableShape.step( dt ); } );
    },

    placeShape: function( movableShape ) {
      var shapePlaced = false;
      for ( var i = 0; i < this.shapePlacementBoards.length && !shapePlaced; i++ ) {
        shapePlaced = this.shapePlacementBoards[ i ].placeShape( movableShape );
      }
      if ( !shapePlaced ) {
        movableShape.returnToOrigin( true );
      }
    },

    /**
     * Function for adding new movable shapes to this model when the user creates them, generally by clicking on some
     * some sort of creator node.
     * @public
     * @param movableShape
     */
    addUserCreatedMovableShape: function( movableShape ) {
      var self = this;
      this.movableShapes.push( movableShape );
      movableShape.userControlledProperty.link( function( userControlled ) {
        if ( !userControlled ) {
          self.placeShape( movableShape );
        }
      } );

      // The shape will be removed from the model if and when it returns to its origination point.  This is how a shape
      // can be 'put back' into the bucket.
      movableShape.returnedToOriginEmitter.addListener( function() {
        if ( !movableShape.userControlledProperty.get() ) {
          // The shape has been returned to the bucket.
          self.movableShapes.remove( movableShape );
        }
      } );

      // Another point at which the shape is removed is if it fades away.
      movableShape.fadeProportionProperty.link( function fadeHandler( fadeProportion ) {
        if ( fadeProportion === 1 ) {
          self.movableShapes.remove( movableShape );
          movableShape.fadeProportionProperty.unlink( fadeHandler );
        }
      } );
    },

    /**
     * fill the boards with unit squares, useful for debugging, not used in general operation of the sim
     */
    fillBoards: function() {
      var self = this;
      this.shapePlacementBoards.forEach( function( board ) {
        var numRows = board.bounds.height / UNIT_SQUARE_LENGTH;
        var numColumns = board.bounds.width / UNIT_SQUARE_LENGTH;
        var movableShape;
        var shapeOrigin;
        if ( board === self.leftShapePlacementBoard ){
          shapeOrigin = self.leftBucket.position;
        }
        else if ( board === self.rightShapePlacementBoard ){
          shapeOrigin = self.rightBucket.position;
        }
        else{
          shapeOrigin = self.singleModeBucket.position;
        }
        _.times( numColumns, function( columnIndex ) {
          _.times( numRows, function( rowIndex ) {
            movableShape = new MovableShape( UNIT_SQUARE_SHAPE, board.colorHandled, shapeOrigin );
            movableShape.positionProperty.set( new Vector2(
              board.bounds.minX + columnIndex * UNIT_SQUARE_LENGTH,
              board.bounds.minY + rowIndex * UNIT_SQUARE_LENGTH
            ) );
            self.addUserCreatedMovableShape( movableShape );
          } );
        } );
      } );
    },

    // Resets all model elements
    reset: function() {
      this.showShapeBoardGridsProperty.reset();
      this.showDimensionsProperty.reset();
      this.boardDisplayModeProperty.reset();
      this.shapePlacementBoards.forEach( function( board ) { board.releaseAllShapes( 'jumpHome' ); } );
      this.movableShapes.clear();
    }
  } );
} );
