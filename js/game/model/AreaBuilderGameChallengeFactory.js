// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  var Property = require( 'AXON/Property' );

  function generateRandomColor() {
    var r = Math.round( Math.random() * 255 );
    var g = Math.round( Math.random() * 255 );
    var b = Math.round( Math.random() * 255 );
    return 'rgb( ' + r + ', ' + g + ', ' + b + ')';
  }

  return  {
    // @private
    generateChallenge: function( level ) {
      return {
        correctAnswerProperty: new Property( false ),
        maxAttemptsAllowed: 2,
        color: generateRandomColor(),
        id: Math.round( Math.random() * 1000 ),
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