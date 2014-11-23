var route = require( 'koa-route' );

module.exports = function ( palo ) {
	return route.get( '/packages/:pkgs', function *( pkgs ) {
		var names = pkgs.split( ';' ),
			avail = ( yield palo ).getAvailablePackages( names );

		this.type = '.js';
		this.status = avail.length - names.length < 0 ? 206 : ( avail.length ? 200 : 404 );
		this.body = yield ( yield palo ).generatePackages( names );
	} );
};
