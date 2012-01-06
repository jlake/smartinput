(function () {
/**
 * Light
 *
 * @author    Victor Villaverde Laan <info@freelancephp.net>
 * @link      http://www.freelancephp.net/light-4kb-min-jquery-light/
 * @license   Dual licensed under the MIT and GPL licenses
 */

window.Light = function ( selector, parent ) {
	return new Light.core.init( selector, parent );
};

if ( ! window.$ )
	window.$ = window.Light;

Light.core = Light.prototype = {

	init: function ( selector, parent ) {
		var els;

		selector = selector || window;
		parent = parent || document;

		els = ( typeof selector == 'string' )
			? Light.selector( selector, parent )
			: els = selector;

		this.els = [];

		if ( typeof els.length != 'undefined' ) {
			for (var i = 0; i < els.length; i++)
				this.els.push(els[i]);
		} else {
			this.els.push( els );
		}

		return this;
	},

	get: function ( index ) {
		return ( typeof index == 'undefined' ) 
				? this.els
				: this.els[index];
	},

	count: function () {
		return this.els.length;
	},

	each: function ( fn ) {
		for ( var i = 0; i < this.els.length; i++ )
			fn.call( this, this.els[i] );

		return this;
	},

	attr: function ( name, value, type ) {
		if ( typeof value == 'undefined' ) {
			return el[name];
		}
		this.each(function( el ) {
			if ( typeof type == 'undefined' ) {
				el[name] = value;
			} else {
				el[type][name] = value;
			}
		});

		return this;
	},

	css: function ( styles ) {
		var that = this;
		this.each(function( el ) {
			for ( var name in styles )
				that.attr( name, styles[name], 'style' );
		});

		return this;
	},

	addClass: function ( className ) {
		this.each(function ( el ) {
			if(!el.className.match(new RegExp('\\b' + className + '\\b')))
				el.className += ' ' + className;
		});

		return this;
	},

	removeClass: function ( className ) {
		this.each(function ( el ) {
			el.className = (el.className + '').replace( new RegExp('\\b' + className + '\\b', 'g'), '' );
		});

		return this;
	},

	hasClass: function ( className ) {
		for ( var i = 0; i < this.els.length; i++ ) {
			if((new RegExp('\\b' + className + '\\b')).test(this.els[i].className + ''))
				return true;
		}
		return false;
	},

	hide: function () {
		this.each(function( el ) {
			el.style.display = 'none';
		});
		return this;
	},

	show: function () {
		this.each(function( el ) {
			el.style.display = 'block';
		});
		return this;
	},

	html: function (value) {
		if(value == undefined) {
			return this.els[0] ? this.els[0].innerHTML : '';
		}
		this.each(function( el ) {
			el.innerHTML = value;
		});

		return this;
	},

	text: function (value) {
		var name = (document.body.textContent != undefined) ? 'textContent' : 'innerText';
		if(value == undefined) {
			return this.els[0] ? this.els[0][name] : '';
		}
		this.each(function( el ) {
			el[name] = value;
		});

		return this;
	},

	val: function (value) {
		if(value == undefined) {
			return this.els[0] ? this.els[0].value : '';
		}
		this.each(function( el ) {
			el.value = value;
		});

		return this;
	},

	find: function (selector) {
		return new this.init( selector, this.get(0) );
	},

	on: function ( event, fn ) {
		var addEvent = function( el ) {
			if ( window.addEventListener ) {
				el.addEventListener( event, fn, false );
			} else if ( window.attachEvent ) {
				el.attachEvent( 'on'+ event, function() {
					fn.call( el, window.event );
				});
			}
		};

		this.each(function( el ) {
			addEvent( el );
		});

		return this;
	},

	ready: function ( fn ) {
		DOMReady.add( fn );

		return this;
	},

	remove: function () {
		this.each(function( el ) {
			el.parentNode.removeChild( el );
		});

		return this;
	}

};

Light.selector = function ( selector, context ) {
	var sels =  selector.split( ',' ),
		el, op, s;

	for ( var i = 0; i < sels.length; i++ ) {
		var sel = sels[i].replace(/\s/g, '');

		if ( typeof sel == 'string' ) {
			op = sel.substr( 0, 1 );
			s = sel.substr( 1 );
			if ( op == '#' ) {
				el = document.getElementById( s );
				el = ( isDescendant( el, context ) ) ? el : null;
			} else if ( op == '.' ) {
				el = getElementsByClassName(s, context);
			} else {
				el = context.getElementsByTagName(sel);
			}
		}
	}

	return el;
};

Light.core.init.prototype = Light.core;

var DOMReady = (function () {
	var fns = [],
		isReady = false,
		ready = function () {
			isReady = true;

			for ( var i = 0; i < fns.length; i++ )
				fns[i].call();
		};

	this.add = function ( fn ) {
		if ( fn.constructor == String ) {
			var strFunc = fn;
			fn = function () { eval( strFunc ); };
		}

		if ( isReady ) {
			fn.call();
		} else {
			fns[fns.length] = fn;
		}
	};

	if ( window.addEventListener )
		document.addEventListener( 'DOMContentLoaded', function(){ ready(); }, false );

	(function(){
		if ( ! document.uniqueID && document.expando ) return;

		var tempNode = document.createElement('document:ready');

		try {
			tempNode.doScroll('left');
			ready();
		} catch ( err ) {
			setTimeout(arguments.callee, 0);
		}
	})();

	return this;
})();

Light.ready = DOMReady.add;

function isDescendant( desc, anc ){
	return ( ( desc.parentNode == anc ) || ( desc.parentNode != document ) && isDescendant( desc.parentNode, anc ) );
};

function getElementsByClassName( className, parent ) {
	var a = [],
		re = new RegExp('\\b' + className + '\\b'),
		els = parent.getElementsByTagName( '*' );

	parent = parent || document.getElementsByTagName( 'body' )[0];

	for ( var i = 0; i < els.length; i++ )
		if ( re.test( els[i].className ) )
			a.push( els[i] );

	return a;
};

})();
