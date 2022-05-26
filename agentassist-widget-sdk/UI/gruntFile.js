module.exports = function (grunt) {
    
    var _type = grunt.option('type');
    console.log(_type)
    var cacheBustConst = '-' + new Date().getTime();
    var jsFiles=[];
    var cssFiles=[];

    
    if(_type==='widgets'){
        //Below js and css set of files will be used to minify widgets only sdk 
        jsFiles=[
            'libs/kore-no-conflict-start.js',
            'libs/jquery.js',
            'libs/jquery.tmpl.min.js',
            'libs/jquery-ui.min.js',
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
            'agentindex.js',
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
        ]

    }else if(_type==='widgets_chat'){
         //Below js and css set of files will be used to minify Widgets with chat window sdk 
        jsFiles=[
            'libs/kore-no-conflict-start.js',
            'libs/jquery.js',
            'libs/jquery.tmpl.min.js',
            'libs/jquery-ui.min.js',
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
            'agentindex.js',
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
        ]

    }else{
        //Below js and css set of files will be used to minify chatwindow sdk  
        jsFiles=[
            'libs/kore-no-conflict-start.js',
            'libs/jquery.js',
            'libs/jquery.tmpl.min.js',
            'libs/jquery-ui.min.js',
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
            'agentindex.js',
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
        ]
    }

    // Project configuration.
    grunt.initConfig({

        //uglify task definition
        uglify: {
            options:{
                maxLineLen:320000000000000
            },
            js: {
                src: jsFiles,
                dest: 'dist/kore-ai-sdk' + '.min.js'
            }
        },
        cssmin: {
            options: {
              mergeIntoShorthands: false,
              roundingPrecision: -1
            },
            target: {
              files: {
                'dist/kore-ai-sdk.min.css':cssFiles 
              }
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

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask('default', ['clean', 'uglify','cssmin']);

};