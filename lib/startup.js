var route = require( 'koa-route' );

module.exports = function ( palo ) {
	return route.get( '/startup', function *() {
		var name, meta, args,
			epoch = Infinity,
			index = {},
			registrations = [],
			packages = ( yield palo ).getPackages(),
			startup = packages['palo-startup'];

		if ( !startup ) {
			throw new Error( 'Startup package not found; please install palo-startup' );
		}

		for ( name in packages ) {
			meta = packages[name].getMeta();
			args = [ name, meta.version ];
			if ( meta.dependencies.length ) {
				args.push( meta.dependencies );
			}
			epoch = Math.min( epoch, meta.version );
			index[name] = registrations.length;
			registrations.push( args );
		}

		registrations.forEach( function ( args ) {
			args[1] -= epoch;
			if ( args[2] ) {
				args[2] = args[2].map( function ( name ) {
					return index[name] !== undefined ? index[name] : name;
				} );
			}
		} );

		this.type = '.js';
		this.body = yield startup.generate( {
			resource: 'modules/.',
			js: { minify: true, global: true }
		} );
		this.body += 'Palo.startup(' +
			[ JSON.stringify( registrations ),
			epoch,
			JSON.stringify( [ 'palo' ] ) ].join( ',' ) +
		');';
	} );
};
