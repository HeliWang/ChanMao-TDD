module.exports = {

	build_dir: 'www',

	app_files: {
		//source, but NO specs
		js: ['src/app/**/*.js', '!src/app/**/*.spec.js'],

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
	},
	ionic:{
		fonts:[
			'vendor/ionic/release/fonts/ionicons.eot',
			'vendor/ionic/release/fonts/ionicons.svg',
			'vendor/ionic/release/fonts/ionicons.ttf',
			'vendor/ionic/release/fonts/ionicons.woff'
		]

	}
}