var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var folderMount = function folderMount(connect, point) {
    return connect.static(path.resolve(point));
};
var NOTIFYTITLE =  '<%= pkg.name %>           <%= grunt.template.today("yyyy mm dd") %>',
    SOURCE      = "source/",
    PLUGINS     = "plugins/",
    SASS        = "sass/",
    ASSETS      = SOURCE+"assets/",
    DESTINATION = 'public_html/'
    ROOT        = ''; //"blog/"

module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        notify: {
            jekyll: {
                options: {
                    title: NOTIFYTITLE,
                    message: 'Site was successfully compiled using jekyll'
                }
            },
            copy: {
                options: {
                    title: NOTIFYTITLE,
                    message: '{FILE} was updated'
                }
            },
            start: {
                options: {
                    title: NOTIFYTITLE,
                    message: 'Guard has been started successfully'
                }
            }
        },
        jekyll:{
            dest:{
                src: SOURCE,
                dest: DESTINATION+ROOT,
                config: '_config.yml'
            }
        },
        compass:{
            compile: {
                options: {
                    config: SASS+'config.rb',
                    basePath: SASS
                }
            }
        },
        livereload: {
            port: 35729 // Default livereload listening port.
        },
        connect: {
            livereload: {
                options: {
                    base: DESTINATION,
                    port: 80,
                    middleware: function(connect, options) {
                        return [lrSnippet, folderMount(connect, options.base)];
                    }
                }
            },
            server: {
                options: {
                    base: DESTINATION,
                    port: 80,
                    keepalive: true
                }
            }
        },
        regarde: {
            sass:{
                files: SASS+'**/*.s[ca]ss',
                tasks: ['compass:compile']
            },
            assets:{
                files: ASSETS+'**/*.*',
                // tasks: ['copy:assets','livereload','notify:copy'],
                events: true
            },
            jekyll:{
                files:[ SOURCE+'_includes/**/*.*',
                        SOURCE+'_layouts/**/*.*',
                        SOURCE+'_posts/**/*.*',
                        SOURCE+'*.*',
                        PLUGINS+'**/*.*',
                        '_config.yml'],
                tasks: ['jekyll','livereload'/*,'notify:jekyll'*/]
            }
        },
        copy:{
            assets:{
                files:[
                    {expand: true, cwd:'source/', dest: DESTINATION+ROOT}
                ],
                tasks:['livereload'/*,'notify:copy'*/]
            }
        }
    });
    grunt.event.on("regarde:file", function (undef,undef,file,undef,status) {
        if (file.indexOf(ASSETS) == 0) {
            file = file.slice(SOURCE.length,file.length);
            grunt.config.set(['copy','assets','files','0','src'],file);
            messagePath = ['notify','copy','options','message'];
            var message = grunt.config.get(messagePath).replace('{FILE}',file)
            grunt.config.set(messagePath,message);
            var addTasks =grunt.config.get(['copy','assets','tasks']);
            var tasks = ['copy:assets'];
            for (var i = addTasks.length - 1; i >= 0; i--) {
                tasks.push(addTasks[i]);
            };
            grunt.task.run(tasks);
        }
    })

    grunt.loadNpmTasks('grunt-regarde');
    grunt.loadNpmTasks('grunt-jekyll');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-livereload');
    grunt.loadNpmTasks('grunt-notify');

    grunt.registerTask('default', [
        'jekyll',
        'livereload-start',
        'connect:livereload',
        'notify:start',
        'regarde'
    ]);
    grunt.registerTask('nj', [
        'livereload-start',
        'connect:livereload',
        // 'notify:start',
        'regarde'
    ]);

    grunt.registerTask('server', [
        'connect:server'
    ]);
};
