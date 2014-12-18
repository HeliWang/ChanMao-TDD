angular.module('example-app',[
	'example-app.login',
	'ui.router',
	'templates-app'
	])

	.config(function  ($stateProvider, $urlRouterProvider ) {
		$stateProvider
			.state('root', {
				url: '/',
				template: '<div>This is the Application Root.</div>'
			});
		$urlRouterProvider.otherwise('/');
	})