// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  var Property = require( 'AXON/Property' );

  function generateRandomColor() {
    var r = Math.round( Math.random() * 255 );
    var g = Math.round( Math.random() * 255 );
    var b = Math.round( Math.random() * 255 );
    return '#' + ( r * 256 * 256 + g * 256 + b ).toString( 16 );
  }

  return  {
    // @private
    generateChallenge: function( level ) {
      var color = generateRandomColor();
      return {
        correctAnswerProperty: new Property( false ),
        maxAttemptsAllowed: 2,
        color: color,
        id: color,
        showCorrectAnswer: function() {
          this.correctAnswerProperty.value = true;
        }
      }
    },

    // @public
    generateChallengeSet: function( level, numChallenges ) {
      var self = this;
      var challengeSet = [];
      _.times( numChallenges, function() {
        challengeSet.push( self.generateChallenge( level ) );
      } );
      return challengeSet;
    }
  }
} );