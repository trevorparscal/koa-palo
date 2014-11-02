var route = require( 'koa-route' );

module.exports = function ( palo ) {
	return route.get( '/resources/:pkg/:type/:name', function *( pkg, type, name ) {
		this.type = '.js';
		this.body = yield ( yield palo ).generate(
			[ pkg ], { resource: [ type, name ].join( '/' ) }
		);
	} );
};
