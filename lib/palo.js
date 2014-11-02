var Palo = require( 'palo' ),
	cache = {};

module.exports = function ( dir ) {
	return function *() {
		if ( !cache[dir] ) {
			cache[dir] = yield Palo.static.newFromDir( dir );
		}
		return cache[dir];
	};
};
