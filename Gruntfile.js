module.exports = function(grunt){

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-html2js');
	grunt.loadNpmTasks('grunt-cordovacli');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-browserify');



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
		      },
		      ionicFonts:{
		      	files: [
		      	  {
		      	    src: [ '<%= ionic.fonts %>' ],
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
					'<%= html2js.app.dest %>',
					'<%= build_dir %>/assets/**/*.css',
					'<%= build_dir %>/bundle.js',


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

			modules: {
			  files: ['src/modules/**/*.js'],
			  tasks: [ 'browserify:build']
			},

			sass: {
			  files: ['src/scss/**/*.scss'],
			  tasks: [ 'sass:build']
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
	    },
	    less: {
	      build: {
	        files: {
	          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': 'src/less/main.less'
	        }
	      }
	    },
	    sass: {
	      build: {
	        files: {
	          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': 'src/scss/main.scss'
	        }
	      }
	    },

	    browserify: {
	    	build: {
	    		src: [ 'src/modules/modules.js'],
	    		dest: '<%= build_dir %>/bundle.js',
	    		options: {
	    			debug: true
	    		}
	    	}
	    }		
	};


	grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));
	
	grunt.registerTask('default', ['build', 'concurrent']);
	grunt.registerTask('build', [
			 'clean', 'copy', 'html2js','browserify', 'sass', 'index'
		]);


  function filterForExtension(extension, files) {
    var regex = new RegExp('\\.' + extension + '$'),
      dirRE = new RegExp('^(' + grunt.config('build_dir') + ')\/', 'g');;
    return files.filter(function (file) {
      return file.match(regex);
    }).map(function (file) {
      return file.replace(dirRE, '');
    });
  }

  grunt.registerMultiTask('index', 'Process index.html template', function () {
    var jsFiles = filterForExtension('js', this.filesSrc),
      cssFiles = filterForExtension('css', this.filesSrc);

    grunt.file.copy('src/index.html', this.data.dir + '/index.html', {
      process: function (contents, path) {
        return grunt.template.process(contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles,
            version: grunt.config('pkg.version')
          }
        });
      }
    });
  });
}