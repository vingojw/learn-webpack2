//是否生产
var production = process.env.NODE_ENV == 'production';

var path = require('path');
var webpack = require('webpack');

//筛选目录文件
var glob = require('glob');

//webpack中生成HTML的插件
var HtmlWebpackPlugin = require('html-webpack-plugin');

//删除目录
var CleanPlugin = require("clean-webpack-plugin");     

//提取单独的css
var ExtractTextPlugin = require('extract-text-webpack-plugin');

//配置
var entryNameTime = production?require('moment')().format("YYYYMMDDhhmmss"):'';
var publicPath = production?'http://127.0.0.1:8080/test/':'/';


//拷贝资源可以使用   CopyWebpackPlugin 拷贝
var CopyWebpackPlugin = require('copy-webpack-plugin');

var extractCSS = new ExtractTextPlugin({
	filename:'style/'+entryNameTime + '_[name].css',
	allChunks:true  // 解决，编译完成后访问， Cannot read property call of undefined 地址： https://segmentfault.com/q/1010000007045505/a-1020000007049825
});
var entries = getEntries();//所有实体

var configs = {
	entry: entries,
	output: {
		filename: 'script/'+entryNameTime + '_[name].js',
		path: path.resolve(__dirname, 'dist'),
		publicPath:publicPath
	},
	module:{
		rules:[ // CSS 和 POSTCSS 加载器，使用嵌入 CSS.
			{
				test: /\.css$/,
				use: extractCSS.extract([ 'css-loader', 'postcss-loader' ])
			},
			{
				test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
				use: [{
					loader: 'url-loader',
					options: {
						limit: 5000,
						name: '[name]-[hash].[ext]'
					}
				}]
			},
			{
	            test: /\.html$/,
	            use: [
	            	{
	            		loader:'html-loader',
	            		options:{
	            			minimize:true,
	            			removeComments: false,
	            			collapseWhitespace: false
	            		}
	            	}
	            ]
        	},
        	{
        		test:/\.vue$/,
        		loader:'vue-loader'
        	}
		]
	},
	plugins: [
		new CopyWebpackPlugin(
			[
				{from:'./src/copy',to:'copy'}//在 npm run build 的时候，将copy文件复制到根目录下的copy
			]),
		new CleanPlugin(['dist']),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			vue: 'vue',
			Vue: 'vue',
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names: ['vendors'],
			chunks:Object.keys(entries),
			minChunks:3
		}),
		extractCSS
	].concat(getHTMLPlugins()),
	devServer: {
	  contentBase: path.join(__dirname, "dist"),
	  compress: true,
	  port: 9000
	}
};
configs.resolve = {
    extensions: ['.js', '.vue'],
    alias: {
        'vue$': 'vue/dist/vue.common.js',//https://zhuanlan.zhihu.com/p/25486761
    }
};

if(!production){
	configs.plugins.push(new webpack.HotModuleReplacementPlugin());//保存文件就会刷新页面
}


module.exports = configs;

/*获取所有实体*/
function getEntries(){
	var entries = {}
	glob.sync('./src/scripts/*.js').forEach(function (entry) {
		// entry                        ==> "./app/scripts/a.js"
		// path.dirname(entry)          ==> "./app/scripts"
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
	return entries;
}
/*获取所有实体  -end*/

/*配置html-webpack-plugin*/
	function getHTMLPlugins(){
		var htmlPlugins = []
		glob.sync('./src/*.ejs').forEach(function (entry) {
			var name = path.basename(entry, '.ejs');
			htmlPlugins.push(new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
				favicon: './src/css/images/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
				filename: './' + name + '.html',
				template: './src/' + name + '.ejs', //html模板路径
				inject: true, //js插入的位置，true/'head'/'body'/false
				chunks: ['vendors', name],//需要引入的chunk，不配置就会引入所有页面的资源
				minify: { //压缩HTML文件
					removeComments: true, //移除HTML中的注释
					collapseWhitespace: false, //删除空白符与换行符
				},
				minify: false //不压缩
			}))
		});
		return htmlPlugins;
	}
/*配置html-webpack-plugin  -end*/
