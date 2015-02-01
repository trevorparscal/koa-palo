var koa = require( 'koa' ),
	compose = require( 'koa-compose' ),
	app = module.exports = koa();

module.exports = function ( dir, url ) {
	var palo = require( './palo' )( dir );

	app.use( compose( [
		require( './packages' )( palo, url ),
		require( './resources' )( palo, url ),
		require( './startup' )( palo, url )
	] ) );

	return app;
};
