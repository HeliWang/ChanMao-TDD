module.exports = function(grunt){

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-html2js');
	grunt.loadNpmTasks('grunt-cordovacli');

	var userConfig = require('./build.config.js');

	var taskConfig = {
		pkg: grunt.file.readJSON('package.json'),

		clean: [
			'<%= build_dir %>'
		],

		copy: {
		      appjs: {
		        src: [ '<%= app_files.js %>' ],
		        dest: '<%= build_dir %>/',
		        cwd: '.',
		        expand: true
		      },
		      vendorjs: {
		        files: [
		          {
		            src: [ '<%= vendor_files.js %>' ],
		            dest: '<%= build_dir %>/',
		            cwd: '.',
		            expand: true
		          }
		        ]
		      }
		    },



		index:{
			build:{
				dir: '<%= build_dir %>',
				src:[
					'<%= vendor_files.js %>',
					'<%= build_dir %>/src/**/*.js',
					'<%= html2js.app.dest %>'
				]
			}
		},

		html2js:{
			app: {
				options: {
				    base: 'src/app'
			    },
				src: [ '<%= app_files.atpl %>' ],
				dest: '<%= build_dir %>/templates-app.js'
			}
		},

		watch:{
			jssrc:{
				files:[
					'<%= app_files.js %>'
				],
				tasks: ['copy', 'index']
			},
			
			//watch index.html
			html: {
				files: [ '<%= app_files.html %>'],
				tasks: [ 'index:build']
			},
			
			atpl:{
				files: [' <%= app_files.atpl %>'],
				tasks: [ 'html2js'],
			},

			// vendor:{
			// 	files: [' <%= vendor_files.js %>'],
			// 	tasks: ['copy', 'index']
			// },
			
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: [],
				options: {
					livereload: false
				}
			}
		},

		nodemon: {
	      dev: {
	      	script:'server/server.js',//for 0.1.2
	        options: {
	         //for 0.1.2 file: 'server/server.js',
	          watch: ['server']
	          //for 0.1.2 watchedFolders
	        }
	      }
	    },

	    concurrent: {
	      dev: {
	        tasks: ['nodemon:dev', 'watch'],

	        options: {
	          logConcurrentOutput: true
	        }
	      }
	    }
	};


	grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));
	
	grunt.registerTask('default', ['build', 'concurrent']);
	grunt.registerTask('build', [
			 'clean', 'copy', 'html2js', 'index'
		]);
	grunt.registerTask('create',['cordovacli:create']);
	grunt.registerTask('add_platforms',['cordovacli:add_platforms']);


	function filterForJS(files){
		return files.filter(function (file){
			return file.match(/\.js$/);
		});
	}

	grunt.registerMultiTask('index', 'Process index.html template', function(){

		var dirRE = new RegExp('^(' + grunt.config('build_dir') + ')\/', 'g');
		var jsFiles = filterForJS(this.filesSrc).map(function (file){
			return file.replace(dirRE, '');
		})

		//grunt.log.writeln(this.filesSrc);
		//grunt.log.writeln(jsFiles);

		grunt.file.copy('src/index.html', this.data.dir + '/index.html', {
			process: function (contents, path) {
				return grunt.template.process(contents, {
					data: {
						scripts: jsFiles
					}
				});
			}
		});
	});
}