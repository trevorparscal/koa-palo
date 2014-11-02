var route = require( 'koa-route' );

module.exports = function ( palo ) {
	return route.get( '/packages/:pkgs', function *( pkgs ) {
		this.type = '.js';
		this.body = yield ( yield palo ).generate( pkgs.split( ';' ) );
	} );
};
