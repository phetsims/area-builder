// Copyright 2002-2014, University of Colorado Boulder

/**
 * A Scenery node that represents a shape that is defined by lists of perimeter points.  The perimeter points are
 * supplied in terms of external and internal perimeters.  This node also allows specification of a unit length that is
 * used to depict a grid on the shape, and can also show dimensions of the shape.
 */
define( function( require ) {
    'use strict';

    // modules
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
     * @param {PerimeterShape} perimeterShapeProperty
     * @param {Number} unitSquareLength
     * @param {String || Color} fillColor
     * @param {String || Color} perimeterColor
     * @param {Boolean} showDimensionsProperty
     * @param {Boolean} showGridProperty
     * @param {object} options
     * @constructor
     */
    function PerimeterShapeNode( perimeterShapeProperty, unitSquareLength, fillColor, perimeterColor, showDimensionsProperty, showGridProperty, options ) {

      Node.call( this );

      var perimeterShapeNode = new Path( null, { fill: fillColor } );
      this.addChild( perimeterShapeNode );
      var gridLayer = new Node();
      this.addChild( gridLayer );
      var perimeterNode = new Path( null, {
        stroke: perimeterColor,
        lineWidth: 2
      } );
      this.addChild( perimeterNode );
      var dimensionsLayer = new Node();
      this.addChild( dimensionsLayer );

      // Define function for updating the appearance of the perimeter shape.
      function update() {
        var i;
        var mainShape = new Shape();

        // Define the shape of the outer perimeter.
        perimeterShapeProperty.value.exteriorPerimeters.forEach( function( exteriorPerimeters ) {
          mainShape.moveToPoint( exteriorPerimeters[ 0 ] );
          for ( i = 1; i < exteriorPerimeters.length; i++ ) {
            mainShape.lineToPoint( exteriorPerimeters[ i ] );
          }
          mainShape.lineToPoint( exteriorPerimeters[ 0 ] );
          mainShape.close();
        } );

        gridLayer.removeAllChildren();
        dimensionsLayer.removeAllChildren();

        // Add in the shape of any interior spaces.
        if ( !mainShape.bounds.isEmpty() ) {
          perimeterShapeNode.visible = true;
          perimeterNode.visible = true;
          perimeterShapeProperty.value.interiorPerimeters.forEach( function( interiorPerimeter ) {
            mainShape.moveToPoint( interiorPerimeter[ 0 ] );
            for ( i = 1; i < interiorPerimeter.length; i++ ) {
              mainShape.lineToPoint( interiorPerimeter[ i ] );
            }
            mainShape.lineToPoint( interiorPerimeter[ 0 ] );
            mainShape.close();
          } );

          perimeterShapeNode.setShape( mainShape );
          perimeterNode.setShape( mainShape );

          if ( mainShape.bounds.width >= 2 * unitSquareLength || mainShape.bounds.height >= 2 * unitSquareLength ) {
            var gridNode = new Grid( mainShape.bounds.minX, mainShape.bounds.minY, mainShape.bounds.width, mainShape.bounds.height, unitSquareLength, {
                lineDash: [ 1, 4 ],
                stroke: 'black'
              }
            );
            gridNode.clipArea = mainShape;
            gridLayer.addChild( gridNode );
          }

          // Add the dimension labels for the perimeters, but only if there is only 1 exterior perimeter (multiple
          // interior perimeters if fine).
          if ( perimeterShapeProperty.value.exteriorPerimeters.length === 1 ) {

            // Create a list of the perimeters to be labeled.
            var perimetersToLabel = [];
            perimetersToLabel.push( perimeterShapeProperty.value.exteriorPerimeters[ 0 ] );
            perimeterShapeProperty.value.interiorPerimeters.forEach( function( interiorPerimeter ) {
              perimetersToLabel.push( interiorPerimeter );
            } );

            // Identify the segments in each of the perimeters, exterior and interior, to be labeled.
            var segmentLabelsInfo = [];
            perimetersToLabel.forEach( function( perimeterToLabel ) {
              var segment = { startIndex: 0, endIndex: 0 };
              do {
                segment = identifySegment( perimeterToLabel, segment.endIndex );
                // Only label segments that have integer lengths.
                var segmentLabelInfo = {
                  length: perimeterToLabel[ segment.startIndex ].distance( perimeterToLabel[ segment.endIndex ] ) / unitSquareLength,
                  position: new Vector2( ( perimeterToLabel[ segment.startIndex ].x + perimeterToLabel[ segment.endIndex ].x ) / 2,
                      ( perimeterToLabel[ segment.startIndex ].y + perimeterToLabel[ segment.endIndex ].y ) / 2 ),
                  edgeAngle: Math.atan2( perimeterToLabel[ segment.endIndex ].y - perimeterToLabel[ segment.startIndex ].y,
                      perimeterToLabel[ segment.endIndex ].x - perimeterToLabel[ segment.startIndex ].x
                  )
                };

                // Only include the labels that are integer values.
                if ( Math.round( segmentLabelInfo.length ) === segmentLabelInfo.length ) {
                  segmentLabelsInfo.push( segmentLabelInfo );
                }
              } while ( segment.endIndex !== 0 );
            } );

            // Create the labels and place them on the matching segement, just outside of the shape.
            segmentLabelsInfo.forEach( function( segmentLabelInfo ) {
              var dimensionLabel = new Text( segmentLabelInfo.length, { font: new PhetFont( 14 ) } );
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
              else { // NOTE: Angled edges are not currently supported.
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
          perimeterShapeNode.visible = false;
          perimeterNode.visible = false;
        }
      }

      // Control visibility of the dimension indicators.
      showDimensionsProperty.linkAttribute( dimensionsLayer, 'visible' );

      // Control visibility of the grid.
      showGridProperty.linkAttribute( gridLayer, 'visible' );

      // Update the shape, grid, and dimensions if the perimeter shape itself changes.
      perimeterShapeProperty.link( function() {
        update();
      } );

      // Pass options through to parent class.
      this.mutate( options );
    }

    return inherit( Node, PerimeterShapeNode );
  }
);