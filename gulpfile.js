let gulp = require('gulp');
let plumber = require('gulp-plumber');
let del = require('del');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let runseq = require('run-sequence');
let inject = require('gulp-inject');
let svg = require('gulp-svg-sprite');
let rename = require('gulp-rename');
let browsersync = require('browser-sync').create();

let sourcemaps = require('gulp-sourcemaps');
let rollup = require('rollup-stream');
let replace = require('rollup-plugin-replace');
let resolve = require('rollup-plugin-node-resolve');
let cjs = require('rollup-plugin-commonjs');
let minify = require('rollup-plugin-babel-minify');
let babel = require('rollup-plugin-babel');
let ts = require('rollup-plugin-typescript2');
let sizes = require('rollup-plugin-sizes');

let postcss = require('gulp-postcss');
let cssimport = require('postcss-import');
let cssnext = require('postcss-cssnext');
let simplevars = require('postcss-simple-vars');
let cssnano = require('cssnano');

let cache;
let prod = false;

gulp.task('browsersync', () => {
	browsersync.init({
		server: './dest/',
	});
});

gulp.task('svg', () => {
	return gulp.src('./src/svg/**/*.svg')
		.pipe(plumber())
		.pipe(rename(path => {
			path.basename = path.basename
				.replace(`${path.dirname}_`, '');
		}))
		.pipe(svg({
			mode: {
				symbol: {
					render: {
						css: false,
						scss: false,
					},
					dest: '',
					prefix: '.svg--%s',
					sprite: 'sprite.svg',
					example: {
						dest: 'index.html',
					},
				},
			},
		}))
		.pipe(gulp.dest('./dest/svg'))
		.pipe(browsersync.reload({
			stream: true,
		}));
});

gulp.task('css', () => {
	let plugins = [
		cssimport(),
		simplevars(),
		cssnext({
			warnForDuplicates: false,
		}),
	];

	if (prod === true) {
		plugins.push(cssnano());
	}

	return gulp.src('./src/css/**/*.css')
		.pipe(plumber())
		.pipe(postcss(plugins))
		.pipe(gulp.dest('./dest/css'))
		.pipe(browsersync.reload({
			stream: true,
		}));
});

gulp.task('js', () => {
	let presets = [
		['env',
		{
			modules: false,
			useBuiltins: true,
			debug: true,
		}],
	];

	let plugins = [
		ts(),
		replace({
			'process.env.NODE_ENV': JSON.stringify(prod === true ? 'production' : 'development'),
		}),
		babel({
			presets: presets,
			plugins: [
				"external-helpers",
				["transform-object-rest-spread",
				{
					useBuiltins: true,
				}],
			],
			exclude: 'node_modules/**',
		}),
		cjs(),
		resolve(),
	];

	if (prod === true) {
		plugins.push(minify({
			comments: false,
		}));
	}

	plugins.push(sizes({
		details: prod,
	}));

	return rollup({
			input: './src/js/main.ts',
			sourcemap: true,
			plugins: plugins,
			format: 'iife',
			name: 'astro_site',
		})
		.on('bundle', bundle => cache = bundle)
		.on('error', function(e) {
			console.error(e.stack);
			this.emit('end');
		})
		.pipe(plumber())
		.pipe(source('main.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({
			loadMaps: true,
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./dest/js'))
		.pipe(browsersync.reload({
			stream: true,
		}));
});

gulp.task('html', () => {
	let sources = gulp.src([
		'./dest/js/**/*.js',
		'./dest/css/**/*.css'
	], {read: false});

	return gulp.src('./src/**/*.html')
		.pipe(plumber())
		.pipe(inject(sources, {
			ignorePath: 'dest',
			addRootSlash: false,
		}))
		.pipe(gulp.dest('./dest'))
		.pipe(browsersync.reload({
			stream: true,
		}));
});

gulp.task('clean', () => {
	return del('./dest');
});

gulp.task('build', cb => {
	runseq('clean', ['css', 'js', 'svg'], 'html', cb);
});

gulp.task('watch', () => {
	runseq('build', 'browsersync');
	gulp.watch('./src/css/**/*.css', ['css']);
	gulp.watch('./src/js/**/*.ts', ['js']);
	gulp.watch('./src/**/*.html', ['html']);
	gulp.watch('./src/svg/**/*.svg', ['svg']);
});

gulp.task('prod', () => {
	prod = true;
	return runseq('build');
});
