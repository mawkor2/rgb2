/*

      . = .           
    "  -O- |     -- !
  [  )  , + |--<
   /  '   '_|
 / ] == ; }
  
RGB2 css color animation library
  using the maths to make art, how rude!
  fork me at https://github.com/mawkor2/rgb2
  GNU LESSER GENERAL PUBLIC LICENSE - http://www.gnu.org/licenses/lgpl-3.0.txt 

*/

( function( root, factory ){

	// CommonJS
	if ( typeof exports === 'object' ){
		module.exports = factory();

	// AMD
	} else if ( typeof define === 'function' && define.amd ){
		define( ['jquery', 'firmin'], factory );
	// Browser
	} else {
		root.RGB2 = factory();
	}
}(( typeof window === 'object' && window ) || this, function( _$, _Firmin ) {
  var $ = (_$) ? _$ : $
    ,Firmin = (_Firmin) ? _Firmin : Firmin
    ,psychedelicColor = function( rgb, amt, increasings ) {
      for ( var idx in rgb ) {
        var newVal = rgb[idx] + increasings[ idx ] * amt;
        if ( newVal <= 0 ) {
          newVal = -newVal;
          increasings[ idx ] *= -1;
        } else if ( newVal >= 255 ) {
          newVal = 510 - newVal;
          increasings[ idx ] *= -1;
        };
        rgb[ idx ] = newVal;
      };
    }
   ,incrementsPerPhase = 8;

  var RGB2 = {
    psychedelic: function( $elem, phases, speed, property ) {
      // hue rotations  
      var property = property || 'color'
       ,originalColor = $elem.css( property )
       ,myColor = null
       ,myRGB = null
       ,phaseDivisions = 4
       ,increments = phaseDivisions * phases // divide each animation into 45deg rotations
       ,msPerIncrement = Math.round( speed / phaseDivisions )
       ,totalIncrements = 0
       ,anim = null
       ,degreesPerIncrement = Math.round( 360 / phaseDivisions )
       ,calcNext = function() {
         myColor = myColor.rotate( - degreesPerIncrement )
       }
       ,runAnimation = function() {
            console.log('running');
            increments -= 1;
            if ( increments < 0 ) {
              console.log('done');
              $elem.unbind( 'transitionend webkitTransitionEnd oTransitionEnd' );
              var original = {};
              original[ property ] = originalColor;
              $elem.css( original )
              //anim.animate( original, msPerIncrement + 'ms' );
              return;
            } ;
            calcNext();
            var transform = {};
            transform[ property ] =  myColor.rgbString();
            $elem.css( transform );
            //anim.animate( transform, msPerIncrement + 'ms' );
        };
      myColor = Color( originalColor );
      myRGB = myColor.rgb();
      $elem.css( 'transition', 'all ' + msPerIncrement + 'ms linear 0ms' );
      $elem.bind('transitionend webkitTransitionEnd oTransitionEnd',  runAnimation );
      calcNext( );
      var transform = {};
      transform[ property ] =  myColor.rgbString();
      $elem.css( transform );
      //anim = Firmin.animate( $elem.get( 0),  transform, msPerIncrement + 'ms' ); 
    }
   ,flicker: function( $elem, howLong ) {
      // more accentuated color changes
    }
   ,glow: function( $elem, phases, speed, property ) {
      // glowing effect
      var property = property || 'color'
       ,originalColor = $elem.css( property )
       ,myColor = Color( originalColor )
       ,myRGB = myColor.rgb()
       ,phaseDivisions = 16
       ,increments = Math.round( phaseDivisions * phases ) // divide each animation into 45deg rotations
       ,msPerIncrement = Math.round( speed / phaseDivisions )
       ,anim = null
       ,increasing = true
       ,maxRatio = .1
       ,minRatio = -.1 
       ,ratio = 0
       ,ratioIncrement = .02
       ,changeRatio = function() {
          if ( ( increasing && ratio + ratioIncrement > maxRatio ) ||
                 ( !increasing && ratio + ratioIncrement < minRatio )
              ) {
            ratioIncrement = -ratioIncrement;
            increasing = !increasing;
          };
          ratio += ratioIncrement;
        }
       ,calcNext = function() {
         changeRatio();
         if ( ratio < 0) {
           console.log( 'lightening by' + ratioIncrement * 100 + '%' );
           myColor = myColor.darken( ratioIncrement );
         } else {
            console.log( 'darkening by' + ratioIncrement * 100 + '%'  );
            myColor = myColor.lighten( ratioIncrement );
         };
       }
       ,runAnimation = function() {
            increments -= 1;
            if ( increments <  0 ) {
              $elem.unbind( 'transitionend webkitTransitionEnd oTransitionEnd' );
              var original = {};
              original[ property ] = originalColor;
              anim.animate( original, msPerIncrement + 'ms' ); 
            } ;
            calcNext();
            var transform = {};
            transform[ property ] =  myColor.rgbString();
            $elem.css( transform )
            //anim.animate( transform, msPerIncrement + 'ms' ); 
        };
      $elem.bind('transitionend webkitTransitionEnd oTransitionEnd',  runAnimation );
      calcNext( );
      var transform = {};
      transform[ property ] =  myColor.rgbString();
      $elem.css( transform );
      //anim = Firmin.animate( $elem.get( 0 ), transform, msPerIncrement + 'ms' ); 
    }
  };
  
  window.RGB2 = RGB2;

}));
