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
        throw new Error( 'Illegal use of function for identifying perimeter segments.' )
      }

      // Set up initial portion of segment.
      var segmentStartPoint = perimeterPoints[ startIndex ];
      var endIndex = ( startIndex + 1 ) % perimeterPoints.length;
      var segmentEndPoint = perimeterPoints[ endIndex ];
      var previousAngle = Math.atan2( segmentEndPoint.y - segmentStartPoint.y, segmentEndPoint.x - segmentStartPoint.x );
      var segmentComplete = false;

      while ( !segmentComplete && endIndex !== 0 ) {
        console.log( '---------- identifySegment main loop -----------' );
        var candidatePoint = perimeterPoints[ ( endIndex + 1 ) % perimeterPoints.length ];
        var angleToCandidatePoint = Math.atan2( candidatePoint.y - segmentEndPoint.y, candidatePoint.x - segmentEndPoint.x );
        console.log( 'angleToCandidatePoint = ' + angleToCandidatePoint );
        console.log( 'angleToCandidatePoint = ' + angleToCandidatePoint / Math.PI + ' * PI' );
        if ( previousAngle === angleToCandidatePoint ) {
          // This point is an extension of the current segment.
          console.log( 'Extension of current segment' );
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
      }
    }

    /**
     * @param exteriorPerimetersProperty
     * @param interiorPerimetersProperty
     * @param unitSquareLength
     * @param color
     * @constructor
     */
    function CompositeShapeNode( exteriorPerimetersProperty, interiorPerimetersProperty, unitSquareLength, color ) {

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

      // Main function for updating the appearance of the composite shape.
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

          // Add the dimension labels for the exterior perimeter, but only if there is only 1 perimeter
          if ( exteriorPerimetersProperty.value.length === 1 ) {

            var segment = { startIndex: 0, endIndex: 0 };
            var segmentLabelsInfo = [];
            var perimeterPoints = exteriorPerimetersProperty.value[ 0 ];
            do {
              segment = identifySegment( perimeterPoints, segment.endIndex );
              console.log( 'segment.startIndex = ' + segment.startIndex );
              console.log( 'segment.endIndex = ' + segment.endIndex );
              segmentLabelsInfo.push( {
                length: perimeterPoints[ segment.startIndex ].distance( perimeterPoints[ segment.endIndex ] ) / unitSquareLength,
                position: new Vector2( ( perimeterPoints[ segment.startIndex ].x + perimeterPoints[ segment.endIndex ].x ) / 2,
                    ( perimeterPoints[ segment.startIndex ].y + perimeterPoints[ segment.endIndex ].y ) / 2 ),
                edgeAngle: Math.atan2( perimeterPoints[ segment.endIndex ].y + perimeterPoints[ segment.startIndex ].y,
                    perimeterPoints[ segment.endIndex ].x + perimeterPoints[ segment.startIndex ].x
                )
              } );
            } while ( segment.endIndex !== 0 );

            segmentLabelsInfo.forEach( function( segmentLabelInfo ) {
              dimensionsLayer.addChild( new Text( segmentLabelInfo.length, {
                font: new PhetFont( 16 ),
                centerX: segmentLabelInfo.position.x,
                centerY: segmentLabelInfo.position.y
              } ) )
            } );

            /*
             var exteriorPerimeter = exteriorPerimetersProperty.value[ 0 ];

             // Load up the initial two points of the first segment
             var segmentStart = exteriorPerimeter[ 0 ];
             var segmentEnd = exteriorPerimeter[ 1 ];
             var previousAngle = Math.atan2( segmentEnd.y - segmentStart.y, segmentEnd.x - segmentStart.x );
             var exteriorPerimeterLabels = [];

             // Loop through all remaining points identifying perimeter segments and adding labels.  Note that we have
             // to loop back to the original point to close off the last segment.
             for ( i = 2; i <= exteriorPerimeter.length; i++ ) {
             console.log( '---------------------' );
             console.log( 'i = ' + i );
             console.log( '(i % exteriorPerimeter.length) = ' + (i % exteriorPerimeter.length) );
             var currentPoint = exteriorPerimeter[ i % exteriorPerimeter.length ];
             var angleToCurrentPoint = Math.atan2( currentPoint.y - segmentEnd.y, currentPoint.x - segmentEnd.x );
             console.log( 'angleToCandidatePoint = ' + angleToCurrentPoint );
             console.log( 'angleToCandidatePoint = ' + angleToCurrentPoint / Math.PI + ' * PI' );
             if ( previousAngle === angleToCurrentPoint ) {
             // This point is an extension of the current segment.
             console.log( 'Extension of current segment' );
             segmentEnd = currentPoint;
             }
             else {
             // This point is the start of a new segment, so record the previous one.
             exteriorPerimeterLabels.push( {
             length: segmentEnd.distance( segmentStart ) / unitSquareLength,
             position: new Vector2( ( segmentStart.x + currentPoint.x ) / 2, ( segmentStart.y + currentPoint.y ) / 2 )
             }
             );
             console.log( 'Reached end of segment, length = ' + segmentEnd.distance( segmentStart ) / unitSquareLength );
             // Start a new segment.
             segmentStart = segmentEnd;
             segmentEnd = currentPoint;
             previousAngle = angleToCurrentPoint;
             }
             }
             */
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
    }

    return inherit( Node, CompositeShapeNode );
  }
)
;