var route = require( 'koa-route' );

module.exports = function ( palo, url ) {
	return route.get( '/startup', function *() {
		var name, deps, args, version, pkg,
			epoch = Infinity,
			index = {},
			registrations = [],
			packages = ( yield palo ).getPackages(),
			startup = packages['palo-startup'];

		if ( !startup ) {
			throw new Error( 'Startup package not found; please install palo-startup' );
		}

		for ( name in packages ) {
			pkg = packages[name];
			deps = pkg.getDependencies();
			version = yield pkg.generateVersion();
			args = [ name, version ];
			if ( deps.length ) {
				args.push( deps );
			}
			epoch = Math.min( epoch, version );
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
		this.body = yield startup.generateResource( 'modules', '.', {
			js: { minify: true, global: true }, css: { staticRoot: url }
		} );

		this.body += 'Palo.startup(' + [
			JSON.stringify( registrations ),
			epoch,
			JSON.stringify( [ 'palo' ] )
		].join( ',' ) + ');';
	} );
};
