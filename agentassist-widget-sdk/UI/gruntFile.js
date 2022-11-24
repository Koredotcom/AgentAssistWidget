module.exports = function (grunt) {
    
    var _type = grunt.option('type');
    console.log(_type)
    var cacheBustConst = '-' + new Date().getTime();
    var jsFiles=[];
    var cssFiles=[];
    var fontFiles = [];
    var iconFiles = [];
    
   
        //Below js and css set of files will be used to minify chatwindow sdk  
        jsFiles=[
            'libs/kore-no-conflict-start.js',
            'libs/jquery.js',
            'libs/jquery.tmpl.min.js',
            "libs/jquery-ui.min.js",
            'libs/moment.js',
            '../libs/ie11CustomProperties.js',
            '../libs/lodash.min.js',
            '../libs/d3.v4.min.js',
            '../libs/KoreGraphAdapter.js',
            '../libs/anonymousassertion.js',
            '../kore-bot-sdk-client.js',
            '../libs/perfect-scrollbar.js',
            'chatWindow.js',
            'libs/jquery.daterangepicker.js',
            'libs/jquery-clockpicker.js',
            '../libs/kore-pickers.js',
            '../libs/emoji.js',
            '../libs/recorder.js',
            '../libs/recorderWorker.js',
            '../libs/purejscarousel.js',
            './custom/customTemplate.js',
            'kore-config.js',
            'libs/kore-no-conflict-end.js',
            'libs/jquery-3.1.1.js',
            "./typeahead.js/jquery_.min.js",
            "./typeahead.js/bloodhound.min.js",
            "./typeahead.js/typeahead.bundle.min.js",
            "./typeahead.js/typeahead.jquery.min.js",
            'agentindex.js'
        ];
        cssFiles=[
            './css/reset.css',
            './fonts/inter.css',
            './css/styles.css',
            'fonts/AgentAssist-icons/style.css',
            'libs/jquery-ui.min.css',
            'libs/daterangepicker.css',
            'libs/jquery-clockpicker.css',
            '../libs/kore-pickers.css',
            'chatWindow.css',
            '../libs/emojione.sprites.css',
            '../libs/purejscarousel.css',
            '../libs/prefect-scrollbar.css',
            './custom/customTemplate.css'
        ];
        fontFiles = [
            'Inter-Bold.woff',
            'Inter-Bold.woff2',
            'Inter-Regular.woff',
            'Inter-Regular.woff2',
            'Inter-BoldItalic.woff',
            'Inter-BoldItalic.woff2',
            'Inter-italic.var.woff2',
            'Inter-Italic.woff',
            'Inter-Italic.woff2',
            'Inter-Light.woff',
            'Inter-Light.woff2',
            'Inter-Medium.woff',
            'Inter-Medium.woff2',
            'Inter-SemiBold.woff',
            'Inter-SemiBold.woff2',
            'Inter-SemiBoldItalic.woff',
            'Inter-SemiBoldItalic.woff2',
        ];
        iconFiles = [

        ];
    //}

    // Project configuration.
    grunt.initConfig({

        //uglify task definition
        uglify: {
            options:{
                maxLineLen:320000000000000
            },
            js: {
                src: jsFiles,
                dest: '../dist/kore-ai-agentassist-sdk' + '.min.js'
            }
        },
        concat:{
           options:{
               separator: ';'
           },
           js: {
               src:jsFiles,
               dest: '../dist/kore-ai-agentassist-sdk' + '.combined.js'
           }
        },
        cssmin: {
            options: {
              mergeIntoShorthands: false,
              roundingPrecision: -1
            },
            target: {
              files: {
                '../dist/kore-ai-agentassist-sdk.min.css':cssFiles 
              }
            }
          }, 

          concat_css: {
            options: {},
            target:{
                files: {
                    '../dist/compiled.css': cssFiles,
                }
            }
           
          },
          copy: {
            main: {
                files : [
                    {
                        expand: true,
                        src: './fonts/*',
                        dest: '../dist/fonts',
                        flatten: true,
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        src: './fonts/AgentAssist-icons/fonts/*',
                        dest: '../dist/fonts/AgentAssist-icons/fonts/',
                        flatten: true,
                        filter: 'isFile'
                    }
                ]
              
            }
          },

        //clean task definition
        clean: {
            dist: {
                options: {
                    force: true
                },
                src: ['dist']
            }
        },
    });


    // Load the plugin that provides the "clean" task.
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Load the plugin that provides the "concat" task.
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-concat-css');

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask('default', ['clean','concat','copy', 'cssmin', 'uglify']);

};