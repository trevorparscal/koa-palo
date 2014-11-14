var route = require( 'koa-route' ),
	types = {
		'modules': '.js',
		'stylesheets': '.css'
	};

module.exports = function ( palo ) {
	return route.get( '/resources/:pkg/:type/:name', function *( pkg, type, name ) {
		this.type = types[type] || '.json';
		this.body = yield ( yield palo ).generate(
			[ pkg ], { resource: [ type, name ].join( '/' ) }
		);
	} );
};
