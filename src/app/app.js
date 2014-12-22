angular.module('example-app',[
	'example-app.login',
	'ui.router',
	'templates-app',
	'example-app.modules'

	])

	.config(function  ($stateProvider, $urlRouterProvider ) {
		$stateProvider
			.state('root', {
				url: '/',
				template: '<div>This is the Application Root.</div>',
				controller:'testCtrl'
			});
		$urlRouterProvider.otherwise('/');
	})

	.controller('testCtrl',['debug', function  (debug) {
		console.log("hello world");
		debug('say it is so.');
	}])