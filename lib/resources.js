var route = require( 'koa-route' ),
	types = {
		'modules': '.js',
		'stylesheets': '.css'
	};

module.exports = function ( palo, url ) {
	return route.get( '/resources/:name/:type/:key', function *( name, type, key ) {
		var pkg = ( yield palo ).getPackage( name );

		if ( pkg && pkg.isResourceAvailable( type, key ) ) {
			this.type = types[type] || '.json';
			this.body = yield pkg.generateResource( type, key, { css: { staticRoot: url } } );
		} else {
			this.status = 404;
		}
	} );
};
