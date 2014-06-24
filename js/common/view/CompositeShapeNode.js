// Copyright 2002-2014, University of Colorado Boulder

/**
 * A shape that is composed of a number of unit shapes, but is drawn as more
 * of a contiguous shape with an emphasized perimeter and with dotted lines
 * representing the inner edges of the unit squares.
 */
define( function( require ) {
    'use strict';

    // modules
    var AreaBuilderSharedConstants = require( 'AREA_BUILDER/common/AreaBuilderSharedConstants' );
    var Color = require( 'SCENERY/util/Color' );
    var Grid = require( 'AREA_BUILDER/common/view/Grid' );
    var inherit = require( 'PHET_CORE/inherit' );
    var Node = require( 'SCENERY/nodes/Node' );
    var Path = require( 'SCENERY/nodes/Path' );
    var PhetFont = require( 'SCENERY_PHET/PhetFont' );
    var Shape = require( 'KITE/Shape' );
    var Text = require( 'SCENERY/nodes/Text' );
    var Vector2 = require( 'DOT/Vector2' );

    // Utility function for identifying a perimeter segment with no bends.
    function identifySegment( perimeterPoints, startIndex ) {

      // Parameter checking.
      if ( startIndex >= perimeterPoints.length ) {
        throw new Error( 'Illegal use of function for identifying perimeter segments.' );
      }

      // Set up initial portion of segment.
      var segmentStartPoint = perimeterPoints[ startIndex ];
      var endIndex = ( startIndex + 1 ) % perimeterPoints.length;
      var segmentEndPoint = perimeterPoints[ endIndex ];
      var previousAngle = Math.atan2( segmentEndPoint.y - segmentStartPoint.y, segmentEndPoint.x - segmentStartPoint.x );
      var segmentComplete = false;

      while ( !segmentComplete && endIndex !== 0 ) {
        var candidatePoint = perimeterPoints[ ( endIndex + 1 ) % perimeterPoints.length ];
        var angleToCandidatePoint = Math.atan2( candidatePoint.y - segmentEndPoint.y, candidatePoint.x - segmentEndPoint.x );
        if ( previousAngle === angleToCandidatePoint ) {
          // This point is an extension of the current segment.
          segmentEndPoint = candidatePoint;
          endIndex = ( endIndex + 1 ) % perimeterPoints.length;
        }
        else {
          // This point isn't part of this segment.
          segmentComplete = true;
        }
      }

      return {
        startIndex: startIndex,
        endIndex: endIndex
      };
    }

    /**
     * @param exteriorPerimetersProperty
     * @param interiorPerimetersProperty
     * @param unitSquareLength
     * @param color
     * @param showDimensionsProperty
     * @param options
     * @constructor
     */
    function CompositeShapeNode( exteriorPerimetersProperty, interiorPerimetersProperty, unitSquareLength, color, showDimensionsProperty, options ) {

      Node.call( this );

      var compositeShapeNode = new Path( null, { fill: color } );
      this.addChild( compositeShapeNode );
      var gridLayer = new Node();
      this.addChild( gridLayer );
      var perimeterNode = new Path( null, {
        stroke: Color.toColor( color ).colorUtilsDarker( AreaBuilderSharedConstants.PERIMETER_DARKEN_FACTOR ),
        lineWidth: 2
      } );
      this.addChild( perimeterNode );
      var dimensionsLayer = new Node();
      this.addChild( dimensionsLayer );

      // Control visibility of the dimension indicators.
      showDimensionsProperty.linkAttribute( dimensionsLayer, 'visible' );

      // Define function for updating the appearance of the composite shape.
      function update() {
        var i;
        var mainShape = new Shape();

        // Define the shape of the outer perimeter.
        exteriorPerimetersProperty.value.forEach( function( exteriorPerimeterPoints ) {
          mainShape.moveToPoint( exteriorPerimeterPoints[ 0 ] );
          for ( i = 1; i < exteriorPerimeterPoints.length; i++ ) {
            mainShape.lineToPoint( exteriorPerimeterPoints[ i ] );
          }
          mainShape.lineToPoint( exteriorPerimeterPoints[ 0 ] );
          mainShape.close();
        } );

        gridLayer.removeAllChildren();
        dimensionsLayer.removeAllChildren();

        // Add in the shape of any interior spaces and the grid.
        if ( !mainShape.bounds.isEmpty() ) {
          interiorPerimetersProperty.value.forEach( function( interiorPerimeterPoints ) {
            mainShape.moveToPoint( interiorPerimeterPoints[ 0 ] );
            for ( i = 1; i < interiorPerimeterPoints.length; i++ ) {
              mainShape.lineToPoint( interiorPerimeterPoints[ i ] );
            }
            mainShape.lineToPoint( interiorPerimeterPoints[ 0 ] );
            mainShape.close();
          } );

          compositeShapeNode.setShape( mainShape );
          perimeterNode.setShape( mainShape );

          // TODO: Consider optimization where grid is only redrawn if bounds of shape changes.
          if ( mainShape.bounds.width >= 2 * unitSquareLength || mainShape.bounds.height >= 2 * unitSquareLength ) {
            // Add the grid
            var gridNode = new Grid( mainShape.bounds.minX, mainShape.bounds.minY, mainShape.bounds.width, mainShape.bounds.height, unitSquareLength, {
                lineDash: [ 1, 4 ],
                stroke: 'black'
              }
            );
            gridNode.clipArea = mainShape;
            gridLayer.addChild( gridNode );
          }

          // Add the dimension labels for the exterior perimeter, but only if there is only 1 perimeter.
          if ( exteriorPerimetersProperty.value.length !== 1 ) {}
          else {

            var segment = { startIndex: 0, endIndex: 0 };
            var segmentLabelsInfo = [];
            var perimeterPoints = exteriorPerimetersProperty.value[ 0 ];
            do {
              segment = identifySegment( perimeterPoints, segment.endIndex );
              segmentLabelsInfo.push( {
                length: perimeterPoints[ segment.startIndex ].distance( perimeterPoints[ segment.endIndex ] ) / unitSquareLength,
                position: new Vector2( ( perimeterPoints[ segment.startIndex ].x + perimeterPoints[ segment.endIndex ].x ) / 2,
                    ( perimeterPoints[ segment.startIndex ].y + perimeterPoints[ segment.endIndex ].y ) / 2 ),
                edgeAngle: Math.atan2( perimeterPoints[ segment.endIndex ].y - perimeterPoints[ segment.startIndex ].y,
                    perimeterPoints[ segment.endIndex ].x - perimeterPoints[ segment.startIndex ].x
                )
              } );
            } while ( segment.endIndex !== 0 );

            segmentLabelsInfo.forEach( function( segmentLabelInfo, index ) {
              var dimensionLabel = new Text( segmentLabelInfo.length, { font: new PhetFont( 16 ) } );
              var labelPositionOffset = new Vector2();
              // TODO: At the time of this writing there is an issue with Shape.containsPoint() that can make
              // containment testing unreliable if there is an edge on the same line as the containment test.  As a
              // workaround, the containment test offset is tweaked a little below.  Once this issue is fixed, the
              // label offset itself can be used for the test.  See https://github.com/phetsims/kite/issues/3.
              var containmentTestOffset;
              if ( segmentLabelInfo.edgeAngle === 0 || segmentLabelInfo.edgeAngle === Math.PI ) {
                // Label is on horizontal edge, so use height to determine offset.
                labelPositionOffset.setXY( 0, dimensionLabel.height / 2 );
                containmentTestOffset = labelPositionOffset.plusXY( 1, 0 );
              }
              else { // TODO: Do we need to handle 45 degree edges?  If so, yikes!
                // Label is on a vertical edge
                labelPositionOffset.setXY( dimensionLabel.width * 0.8, 0 );
                containmentTestOffset = labelPositionOffset.plusXY( 0, 1 );
              }
              if ( mainShape.containsPoint( segmentLabelInfo.position.plus( containmentTestOffset ) ) ) {
                // Flip the offset vector to keep the label outside of the shape.
                labelPositionOffset.rotate( Math.PI );
              }
              dimensionLabel.center = segmentLabelInfo.position.plus( labelPositionOffset );
              dimensionsLayer.addChild( dimensionLabel );
            } );

          }
        }
        else {
          compositeShapeNode.setShape( null );
          perimeterNode.setShape( null );
        }
      }

      exteriorPerimetersProperty.link( function() {
        update();
      } );

      interiorPerimetersProperty.link( function( innerPerimeter ) {
        update();
      } );

      // Pass options through to parent class.
      this.mutate( options );
    }

    return inherit( Node, CompositeShapeNode );
  }
);