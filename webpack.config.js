var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');//webpack中生成HTML的插件
var ExtractTextPlugin = require('extract-text-webpack-plugin');//提取单独的css
var path = require('path');
var glob = require('glob');
var shell = require('shelljs');
var moment = require('moment');
var entryNameTime = moment().format("YYYYMMDDhhmmss");
shell.rm('-rf','./dist');
//shell.cp('-R', 'stuff/', 'out/Release');
var publicPath = './';


/*获取所有实体*/
	var entries = {}
	glob.sync('./src/scripts/*.js').forEach(function (entry) {
		// entry                        ==> "./src/scripts/a.js"
		// path.dirname(entry)          ==> "./src/scripts"
		// path.extname(entry)          ==> ".js"
		// path.basename(entry, '.js'); ==> "a"
		entries[path.basename(entry, '.js')] = entry
		/*entries 看起来就是这样
			{
				a: './src/scripts/a.js',
				b: './src/scripts/b.js',
				index: './src/scripts/index.js'
			}
		*/
	});
/*获取所有实体  -end*/



// var extractCSS = new ExtractTextPlugin('style/'+entryNameTime + '_[name].css');
var config = {
	entry:entries ,
	output: {
		filename: entryNameTime + '_[name].js',
		path: path.resolve(__dirname, 'dist'),
		publicPath:publicPath
	},
	module:{
		// rules:[ // CSS 和 POSTCSS 加载器，使用嵌入 CSS.
		// 	{
		// 		test: /\.css$/,
		// 		use: extractCSS.extract([ 'css-loader', 'postcss-loader' ])
		// 	}
		// ]
	},
	plugins:[
		// extractCSS
	]
};

/*配置html-webpack-plugin*/
	var htmlPlugins = []
	glob.sync('./src/*.html').forEach(function (entry) {
		var name = path.basename(entry, '.html');
		htmlPlugins.push(new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
			favicon: './src/images/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
			filename: './' + name + '.html',
			template: './src/' + name + '.html', //html模板路径
			inject: true, //js插入的位置，true/'head'/'body'/false
			hash: true, //为静态资源生成hash值
			chunks: ['vendors', name],//需要引入的chunk，不配置就会引入所有页面的资源
			minify: { //压缩HTML文件
				removeComments: true, //移除HTML中的注释
				collapseWhitespace: false, //删除空白符与换行符
			},
			minify: false //不压缩
		}))
	});
/*配置html-webpack-plugin  -end*/
config.plugins.concat(htmlPlugins);

config.plugins.push(
new webpack.optimize.CommonsChunkPlugin({
	names: ['vendor'],
	chunks:Object.keys(entries),
	minChunks:3
}));


module.exports = config;
