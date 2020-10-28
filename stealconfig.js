steal.config({
	map: {
        '@loader/@loader' : '@loader',
		'jquery/jquery' : 'jquery',
		'faker/faker' : 'faker',
		'buzz/buzz' : 'buzz',
		'steal-qunit/steal-qunit' : 'steal-qunit',
		'i18next/i18next' : 'i18next',
		'moment/moment' : 'moment',
		'moment-duration-format/moment-duration-format' : 'moment-duration-format',
		'moment-timezone/moment-timezone' : 'moment-timezone',
		'cryptojs/cryptojs' : 'cryptojs',
		'can/util/util': 'can/util/jquery/jquery',
        'can-binarytree/can-binarytree': 'can-binarytree',
        'can-derive/can-derive': 'can-derive',
		'fileupload/fileupload' : 'fileupload',
		'jqueryuiwidget/jqueryuiwidget' : 'jqueryuiwidget',
		'jqueryvalidation/jqueryvalidation' : 'jqueryvalidation',
		'jqueryarraybuffer/jqueryarraybuffer' : 'jqueryarraybuffer',
		'jquerytextfill/jquerytextfill' : 'jquerytextfill',
		'statemachine/statemachine' : 'statemachine',
		'socketio/socketio': 'socketio',
		'caret/caret' : 'caret',
		'temasys/temasys': 'temasys',
		'temasysdebug/temasysdebug': 'temasysdebug',
		'dropins/dropins': 'dropins',
		'qunit/qunit': 'qunit',
		'funcunit/funcunit': 'funcunit',
		'recorder/recorder': 'recorder',
		'jquerytimepicker/jquerytimepicker': 'jquerytimepicker',
		'modernizr/modernizr': 'modernizr',
		'lodash/lodash': 'lodash',
		'js-cookie/js-cookie': 'js-cookie',
		'zeroclipboard/zeroclipboard': 'zeroclipboard',
		'localforage/localforage': 'localforage',
		'shor-avatar/shor-avatar': 'shor-avatar'
	},
	paths: {
		'jquery': 'node_modules/jquery/dist/jquery.js',
		'jquery/*': 'jquerypp/*.js',
		'qunit': 'node_modules/qunitjs/qunit/qunit.js',
		'moment' : 'vendor/moment/moment.js',
		'moment-duration-format' : 'node_modules/moment-duration-format/lib/moment-duration-format.js',
		'moment-timezone' : 'node_modules/moment-timezone/builds/moment-timezone-with-data.js',
		'i18next' : 'vendor/i18next/i18next.js',
		'steal-qunit' : 'steal-qunit.js',
		'buzz' : 'vendor/buzz/buzz.js',
		'faker' : 'vendor/faker/faker.js',
		'cryptojs' : 'vendor/cryptojs/cryptojs.js',
		'fileupload' : 'node_modules/blueimp-file-upload/js/jquery.fileupload.js',
		'jqueryuiwidget' : 'vendor/jqueryuiwidget/jqueryuiwidget.js',
		'jqueryvalidation': 'vendor/jqueryvalidation/dist/jquery.validate.js',
		'jqueryarraybuffer': 'vendor/jqueryarraybuffer/jquery-arraybuffer.js',
		'jquerytextfill': 'vendor/jquerytextfill/jquery.textfill.js',
		'statemachine': 'vendor/statemachine/statemachine.js',
		'socketio': 'vendor/socketio/socketio.js',
		'caret' : 'vendor/caret/jquery.caret.js',
		'temasys' : 'vendor/temasys/adapter.min.js',
		'temasysdebug' : 'vendor/temasys/adapter.js',
		'dropins' : 'vendor/dropins/dropins.js',
        'recorder' : 'vendor/recorder/recorder.js',
		'can/*' : 'node_modules/can/*.js',
 		'can-binarytree': 'node_modules/can-binarytree/can-binarytree.js',
        'rbtreelist/*': 'node_modules/can-binarytree/rbtreelist/*.js',
        'treebase/*': 'node_modules/can-binarytree/treebase/*.js',
        'can-derive': 'node_modules/can-derive/can-derive.js',
        'list/list': 'node_modules/can-derive/list/list.js',
		'funcunit': 'node_modules/funcunit/dist/funcunit.js',
		'jquerytimepicker': 'node_modules/timepicker/jquery.timepicker.min.js',
		'modernizr': 'vendor/modernizr/modernizr.custom.js',
		'lodash': 'node_modules/lodash/lodash.js',
		'js-cookie': 'node_modules/js-cookie/src/js.cookie.js',
		'zeroclipboard': 'vendor/zeroclipboard/dist/ZeroClipboard.js',
		'endo/notification': 'endo/notification.js',
        'sinon': 'node_modules/sinon/pkg/sinon.js',
        'sinon-qunit': 'node_modules/sinon-qunit/lib/sinon-qunit.js',
		'webcomponentsjs' : 'node_modules/webcomponentsjs/webcomponents-lite.min.js',
		'localforage' : 'node_modules/localforage/dist/localforage.js',
		'file-saver' : 'node_modules/file-saver/FileSaver.min.js',
		'shor-avatar': 'node_modules/shor-avatar/shor-avatar.html'
	},
	meta : {
		jquery: {
			format: 'global',
			exports: 'jQuery'
		},
		faker : {
			exports: 'Faker'
		},
		buzz : {
			exports: 'buzz'
		},
		i18next : {
			deps : ['jquery'],
			exports: 'i18n'
		},
		moment : {
			exports: 'moment'
		},
		'moment-duration-format' : {
			deps: ['moment'],
			exports : 'moment'
		},
		'moment-timezone' : {
			deps: ['moment'],
			exports : 'moment'
		},
		cryptojs : {
			exports: 'CryptoJS'
		},
		jqueryuiwidget : {
			deps : ['jquery']
		},
		jqueryarraybuffer: {
			deps: ['jquery']
		},		
		jquerytextfill: {
			deps: ['jquery']
		},		
		fileupload : {
			deps : ['jqueryuiwidget']
		},
		statemachine: {
			exports: 'StateMachine'
		},
		caret : {
			deps : ['jquery']
		},
		dropins : {
			exports: 'Dropbox'
		},
        recorder : {
            exports: 'Recorder'
        },
        zeroclipboard: {
        	exports: 'ZeroClipboard'
        },

        'common/components/media_player/media_control/media_control.mustache': {
            deps: [
                'common/attributes/tooltip_hover/tooltip_hover'
            ]
        },

		'common/components/helpers.js' : {
			deps : ['can', 'jquery']
		},
		'endo/setup.js' : {
			deps : ['can', 'jquery', 'endo/util/log.js']
		},
		jqueryui : {
			deps : ['jquery']
		},
		perfectscrollbar : {
			deps : ['jquery']
		},
		socketio : {
			format: 'global'
		},
		qunit : {
			deps : ['node_modules/qunitjs/qunit/qunit.css!'],
			format: 'global',
			exports: 'QUnit'
		},
		jquerytimepicker : {
			deps : ['node_modules/timepicker/jquery.timepicker.css!', 'jquery']
		},
		'steal-qunit' : {
			deps : ['jquery']
		},
		funcunit: {
			deps : ['jquery', 'qunit'],
			format: 'global'
		},
		modernizr : {
			exports: 'Modernizr'
		},
		lodash: {
			exports: '_'
		},
		'js-cookie': {
			exports: 'Cookies'
		},
        'can-binarytree': {
        },
        'can-derive': {
            deps: ['can-binarytree']
        }
	},
	ext: {
		ejs: 'can/view/ejs/system',
		mustache: 'can/view/mustache/system',
		stache: 'can/view/stache/system'
	}
});

System.buildConfig = {
	map: {
		'can/util/util': 'can/util/domless/domless'
	}
};