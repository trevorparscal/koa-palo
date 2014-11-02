var koa = require( 'koa' ),
	compose = require( 'koa-compose' ),
	app = module.exports = koa();

module.exports = function ( dir ) {
	var palo = require( './palo' )( dir );

	app.use( compose( [
		require( './packages' )( palo ),
		require( './resources' )( palo ),
		require( './startup' )( palo )
	] ) );

	return app;
};
