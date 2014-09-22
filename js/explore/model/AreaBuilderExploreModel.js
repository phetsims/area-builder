// Copyright 2002-2014, University of Colorado Boulder

//REVIEW type name doesn't correspond to screen, rename AreaBuilderExploreModel
/**
 * Primary model class for the 'Explore' screen of the Area Builder simulation.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
  var Bucket = require( 'PHETCOMMON/model/Bucket' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ShapePlacementBoard = require( 'AREA_BUILDER/common/model/ShapePlacementBoard' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var UNIT_SQUARE_LENGTH = AreaBuilderSharedConstants.UNIT_SQUARE_LENGTH;
  var SMALL_BOARD_SIZE = new Dimension2( UNIT_SQUARE_LENGTH * 9, UNIT_SQUARE_LENGTH * 8 );
  var LARGE_BOARD_SIZE = new Dimension2( UNIT_SQUARE_LENGTH * 19, UNIT_SQUARE_LENGTH * 8 );
  var PLAY_AREA_WIDTH = AreaBuilderSharedConstants.LAYOUT_BOUNDS.width;
  var SPACE_BETWEEN_PLACEMENT_BOARDS = UNIT_SQUARE_LENGTH;
  var BOARD_Y_POS = 75; // Empirically determined from looking at the layout
  var BUCKET_SIZE = new Dimension2( 90, 45 );
  var BOARD_TO_BUCKET_Y_SPACING = 45;

  /**
   * @constructor
   */
  function AreaBuilderExploreModel() {
    var self = this;

    PropertySet.call( this, {
      //REVIEW the only seems to affect the board grids, not the grids in the constructed shapes, am I correct?
      showGrids: true, // @public
      showDimensions: false, // @public
      boardDisplayMode: 'single' // @public, value values are 'single' and 'dual'
    } );

    this.movableShapes = new ObservableArray(); // @public
    this.unitSquareLength = UNIT_SQUARE_LENGTH; // @public, @final

    //REVIEW indicate that each boardDisplayMode has its own set of boards and buckets, so that state can be preserved when switching modes

    //REVIEW document and rename to indicate which boardDisplayMode the boards go with
    // Create the shape placement boards.
    self.leftShapePlacementBoard = new ShapePlacementBoard(
      SMALL_BOARD_SIZE,
      UNIT_SQUARE_LENGTH,
      new Vector2( PLAY_AREA_WIDTH / 2 - SPACE_BETWEEN_PLACEMENT_BOARDS / 2 - SMALL_BOARD_SIZE.width, BOARD_Y_POS ),
      AreaBuilderSharedConstants.GREENISH_COLOR,
      this.showGridsProperty,
      this.showDimensionsProperty
    ); // @public
    self.rightShapePlacementBoard = new ShapePlacementBoard(
      SMALL_BOARD_SIZE,
      UNIT_SQUARE_LENGTH,
      new Vector2( PLAY_AREA_WIDTH / 2 + SPACE_BETWEEN_PLACEMENT_BOARDS / 2, BOARD_Y_POS ),
      AreaBuilderSharedConstants.PURPLISH_COLOR,
      this.showGridsProperty,
      this.showDimensionsProperty
    ); // @public
    self.centerShapePlacementBoard = new ShapePlacementBoard(
      LARGE_BOARD_SIZE,
      UNIT_SQUARE_LENGTH,
      new Vector2( PLAY_AREA_WIDTH / 2 - LARGE_BOARD_SIZE.width / 2, BOARD_Y_POS ),
      AreaBuilderSharedConstants.ORANGISH_COLOR,
      this.showGridsProperty,
      this.showDimensionsProperty
    ); // @public

    // @private, for convenience.
    self.shapePlacementBoards = [ self.leftShapePlacementBoard, self.rightShapePlacementBoard, self.centerShapePlacementBoard ];

    //REVIEW document and rename to indicate which boardDisplayMode the buckets go with
    // Create the buckets that will hold the shapes.
    var bucketYPos = self.leftShapePlacementBoard.bounds.minY + SMALL_BOARD_SIZE.height + BOARD_TO_BUCKET_Y_SPACING;
    this.leftBucket = new Bucket( {
      position: new Vector2( self.leftShapePlacementBoard.bounds.minX + SMALL_BOARD_SIZE.width * 0.67, bucketYPos ),
      baseColor: '#000080',
      caption: '',
      size: BUCKET_SIZE,
      invertY: true
    } );
    this.rightBucket = new Bucket( {
      position: new Vector2( self.rightShapePlacementBoard.bounds.minX + SMALL_BOARD_SIZE.width * 0.33, bucketYPos ),
      baseColor: '#000080',
      caption: '',
      size: BUCKET_SIZE,
      invertY: true
    } );
    this.centerBucket = new Bucket( {
      position: new Vector2( self.centerShapePlacementBoard.bounds.minX + LARGE_BOARD_SIZE.width / 2, bucketYPos ),
      baseColor: '#000080',
      caption: '',
      size: BUCKET_SIZE,
      invertY: true
    } );
  }

  return inherit( PropertySet, AreaBuilderExploreModel, {

    step: function( dt ) {
      this.movableShapes.forEach( function( movableShape ) { movableShape.step( dt ); } );
    },

    //REVIEW is shape a {MovableShape}? If so, why is this param named 'shape' and addUserCreatedMovableShape param is movableShape?
    placeShape: function( shape ) {
      var shapePlaced = false;
      for ( var i = 0; i < this.shapePlacementBoards.length && !shapePlaced; i++ ) {
        shapePlaced = this.shapePlacementBoards[i].placeShape( shape );
      }
      if ( !shapePlaced ) {
        shape.goHome( true );
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

      // TODO (see issue #27): This doesn't feel quite right and should be revisited later in the evolution of this
      // simulation.  It is relying on the shape to return to its origin and not be user controlled in order to remove
      // it from the model. It may make more sense to have an explicit 'freed' or 'dismissed' signal or something of
      // that nature.
      movableShape.on( 'returnedHome', function() {
        if ( !movableShape.userControlled ) {
          // The shape has been returned to the bucket.
          self.movableShapes.remove( movableShape );
        }
      } );
    },

    // Resets all model elements
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.shapePlacementBoards.forEach( function( board ) { board.releaseAllShapes(); } );
      this.movableShapes.clear();
    }
  } );
} );
