module.exports = {

	build_dir: 'www',

	app_files: {
		//source, but NO specs
		js: ['src/**/*.js', '!src/**/*.spec.js'],

		//partial templates
		atpl: ['src/app/**/*.tpl.html'],
		

		//the index.html
		html: ['src/index.html']
	},

	vendor_files: {
		js:[
			'vendor/ionic/release/js/ionic.bundle.js',
			'vendor/ngCordova/dist/ng-cordova.js',
			'cordova.js'
		]
	}
}