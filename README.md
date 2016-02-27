# Gulp-Drupal
Gulp base for a drupal theme, with Sass | A11y | browserSync | Autoprefixer

# Installation
Download this repo into the sites themes folder eg. /sites/all/themes/mytheme

From the command line, change directory into your theme folder, and run the following commands

## Install the dependencies
~~~
npm install
~~~
This will locally install all the required node modules.
*tip: add node_modules to your .gitignore file*
~~~
bower install
~~~
This will install zen-grids, normalize-scss, and breakpoint-sass into the bower_components folder.
*The supplied gulpfile will automatically pull from this folder if you choose to @include any of the dependencies*

# Gulpfile - using the tasks
In gulpfile.js find *var appConfig* and add the url for you local dev setup.
*eg. my local machine uses project_name.dev as the url*
The browserSync config will use this url to serve the site from.

### Commands
From the command line and your themes root:
~~~
gulp
~~~
This will run the sass task, reload browserSync and watch for changes. This is the default command.

## Accessibility Task
To run an audit:
~~~
gulp a11y
~~~
This will run an audit on the url identified in the *appConfig.a11y* variable.
If you would like to change the audit url, just find this task in the gulpfile *gulp.task('a11y', function() { .... * and change *appConfig.a11y* to "http://my_audit.url"
