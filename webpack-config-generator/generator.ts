import * as ConfigItem from '../models/configItem';

const functionsBodies = {
  optimization:
      "const optimization = () => {\n" +
      "    const config = {\n" +
      "        splitChunks:{\n" +
      "            chunks: 'all'\n" +
      "        }\n" +
      "    }\n" +
      "    \n" +
      "    if(isProd){\n" +
      "        config.minimizer = [\n" +
      "            new OptimizeCssAssetPlugin(),\n" +
      "            new TerserWebpackPlugin()\n" +
      "        ]\n" +
      "    }\n" +
      "    return config;\n" +
      "}\n",
    filename:
        "const filename = ext => isDev ? `[name].${ext}`:`[name].[hash].${ext}`\n",
    isProduction:
      "const isProdFunk = (...arg) => arg[0]?arg.slice(1, arg.length).join(', '):'';",
    cssLoaders:
        "const cssLoaders = (extra) => {\n" +
        "    const loaders =[{\n" +
        "        loader: MiniCssExtractPlugin.loader,\n" +
        "        options: {\n" +
        "            publicPath: '/public/path/to/',\n" +
        "        }\n" +
        "    },'css-loader']\n" +
        "\n" +
        "    if(extra){\n" +
        "        loaders.push(extra)\n" +
        "    }\n" +
        "\n" +
        "    return loaders\n" +
        "}\n",
    babelOptions:
        "const babelOptions = preset =>{\n" +
        "    const options = {\n" +
        "        presets: ['@babel/preset-env'],\n" +
        "        plugins: [\n" +
        "            '@babel/plugin-proposal-class-properties'\n" +
        "        ]\n" +
        "        \n" +
        "    }\n" +
        "\n" +
        "    if(preset){\n" +
        "        options.presets.push(preset)\n" +
        "    }\n" +
        "    return options\n" +
        "}\n",
    jsLoaders: "const jsLoaders = () => {\n" +
        "    const loaders =[\n" +
        "        {\n" +
        "            loader: \"babel-loader\",\n" +
        "            options: babelOptions()\n" +
        "        }\n" +
        "    ]\n" +
        "\n" +
        "    if(isDev){\n" +
        "        loaders.push('eslint-loader')\n" +
        "    }\n" +
        "    return loaders\n" +
        "}\n",
};

const template = "const path = require('path')\n" +
    "__imports__\n" +
    "\n" +
    "const isDev = process.env.NODE_ENV === 'development'\n" +
    "const isProd = process.env.NODE_ENV === 'production'\n" +
    "\n" +
    "__functions__" +
    "\n" +
    "module.exports = {\n" +
    "    context:  path.resolve(__dirname,'__context__'),\n" +
    "    mode: 'development',\n" +
    "    entry:{\n" +
    "        main:  ['@babel/polyfill','./__entry_point__'],\n" + // Полифил Убрать, не убрать?
    "    }, \n" +
    "    output:{\n" +
    "        filename: filename('js'),\n" +
    "        path: path.resolve(__dirname, '__output_folder__')\n" +
    "    },\n" +
    "    resolve:{\n" +
    "        extensions:['.js', '.json'],\n" +
    "        alias:{\n" +
    "            '@': path.resolve(__dirname,'__context__')\n" +
    "        }\n" +
    "    },\n" +
    "    __source_map__"
    "    plugins: [\n" +
    "        __html_webpack_plugin__"+
    "        new CleanWebpackPlugin(),\n" +
    "        new MiniCssExtractPlugin({\n" +
    "            filename: filename('css'),\n" +
    "        }),\n" +
    "        isProdFunk(isProd, __bundle_analyzer__),.\n"
    "    ],\n" +
    "    optimization:__optimization__"
    "    __devServer__"

    "    module:{\n" +
    "        rules:[\n" +
    "   {\n" +
    "       test: /\.css$/,\n" +
    "       use: cssLoaders()\n" +
    "   },\n" +
    "   {\n" +
    "       test: /\.m?js$/,\n" +
    "       exclude: /node_modules/,\n" +
    "       use: jsLoaders()\n" +
    "   },\n" +
    "   __module_rules__]\n" +
    "    }\n" +
    "}";

const questions = [
    new ConfigItem.ConfigItem('context',
        false, '',
        '',
        '__context__',
        '',
        '__context_param__',
        (value, replaceWith = 'src') => {
            return value.replace('__context_param__', replaceWith);
        }),
    new ConfigItem.ConfigItem('entryPoints',
        false, '',
        '',
        '__entry_point__',
        '',
        '__entry_point_value__',
        (value, replaceWith = 'script.js') => {
            return value.replace('__entry_point_value__', replaceWith);
        }),
    new ConfigItem.ConfigItem('outputFolder',
        false, '',
        '',
        '__output_folder__',
        '',
        '__output_folder_value__',
        (value, replaceWith = 'dist') => {
            return value.replace('__output_folder_value__', replaceWith);
        }),
    new ConfigItem.ConfigItem('htmlWebpackPlugin',
        true, 'html-webpack-plugin',
        'const HtmlWebpackPlugin = require(\'html-webpack-plugin\')',
        '__html_webpack_plugin__',
        '',
        "        new HtmlWebpackPlugin({\n" +
        "            template: __htmlTemplate__,\n" +
        "            __minificationHTML__"+
        "        }),\n",
        null),
    new ConfigItem.ConfigItem('htmlTemplate',
        false, '',
        '',
        '__htmlTemplate__',
        '',
        '__htmlTemplate_value__',
        (value, replaceWith = 'index.html') => {
            return value.replace('__htmlTemplate_value__', replaceWith);
        }),   
    new ConfigItem.ConfigItem('less',
        true, 'less-loader',
        'const MiniCssExtractPlugin = require(\'mini-css-extract-plugin\')',
        '__module_rules__',
        'cssLoaders',
        '        {\n' +
        '           test: /\\.less$/,\n' +
        '           use: cssLoaders(\'less-loader\')\n' +
        '        },\n',
        null),
    new ConfigItem.ConfigItem('sass',
        true, 'node-sass sass-loader',
        'const MiniCssExtractPlugin = require(\'mini-css-extract-plugin\')',
        '__module_rules__',
        'cssLoaders',
        '{\n' +
        '           test: /\\.s[ac]ss$/,\n' +
        '           use: cssLoaders(\'sass-loader\') \n' +
        '        },\n',
        null),
    new ConfigItem.ConfigItem('imageExtension',
        true, 'file-loader',
        '',
        '__module_rules__',
        '',
        '        {\n' +
        '           test: __image_extension__,\n' +
        '           use:[\'file-loader\']\n' +
        '        },\n',
        (value, replaceWith = '/\.(png|jpg|svg|gif)$/') => {
            return value.replace('__image_extension__', replaceWith);
        }),
    new ConfigItem.ConfigItem('fontExtension',
        true, 'file-loader',
        '',
        '__module_rules__',
        '',
        '        {\n' +
        '           test: __font_extension__,\n' +
        '           use:[\'file-loader\']\n' +
        '        },\n',
        (value, replaceWith = '/\.(ttf|woff|woff2|eot)$/') => {
            return value.replace('__font_extension__', replaceWith);
        }),
    new ConfigItem.ConfigItem('audioExtension',
        true, 'file-loader',
        '',
        '__module_rules__',
        '',
        '        {\n' +
        '           test: __audio_extension__,\n' +
        '           use:[\'file-loader\']\n' +
        '        },\n',
        (value, replaceWith = '/\.mp3$/') => {
            return value.replace('__audio_extension__', replaceWith);
        }),
    new ConfigItem.ConfigItem('videoExtension',
        true, 'file-loader',
        '',
        '__module_rules__',
        '',
        '        {\n' +
        '           test: __video_extension__,\n' +
        '           use:[\'file-loader\']\n' +
        '        },\n',
        (value, replaceWith = '/\.mp4$/') => {
            return value.replace('__video_extension__', replaceWith);
        }),
    new ConfigItem.ConfigItem('typescript',
        true, '@babel/preset-typescript ',
        '',
        '__module_rules__',
        'babelOptions',
        '{\n'+
        '    test: /\.ts$/,\n'+
        '    exclude: /node_modules/,\n'+
        '    use: {\n'+
        '      loader: "babel-loader",\n'+
        '      options: babelOptions(\'@babel/preset-typescript\')\n'+
        '  }\n'+
        '},\n',
        null),
    new ConfigItem.ConfigItem('react',
        true, '@babel/preset-react ',
        '',
        '__module_rules__',
        'babelOptions',
        '{\n'+
        '    test: /\.ts$/,\n'+
        '    exclude: /node_modules/,\n'+
        '    use: {\n'+
        '      loader: "babel-loader",\n'+
        '      options: babelOptions(\'@babel/preset-react\')\n'+
        '  }\n'+
        '},\n',
        null),
    new ConfigItem.ConfigItem('devServer',
        true, 'webpack-dev-server @webpack-cli/init',
        '',
        '__devServer__',
        '',
        "    devServer:{\n" +
        "        port: __port__,\n" +
        "        __hotModuleReplacement__" +
        "    },\n",
        null),
    new ConfigItem.ConfigItem('devServerPort',
        false, '',
        '',
        '__port__',
        '',
        '__port_number__',
        (value, replaceWith = 4000) => {
            return value.replace('__port_number__', replaceWith);
        }),
    new ConfigItem.ConfigItem('hotModuleReplacement',
        false, '',
        '',
        '__hotModuleReplacement__',
        '',
        'hot: isDev,\n',
        null),
    new ConfigItem.ConfigItem('optimization',
        false, '',
        'optimization',
        '__optimization__',
        '',
        '__optimization_tools__',
        null),
    new ConfigItem.ConfigItem('libraries',
        false, '',
        '',
        '__optimization_tools__',
        '',
        "        splitChunks:{\n" +
        "            chunks: 'all'\n" +
        "        }\n",
        null),
    new ConfigItem.ConfigItem('minification',
        false, '',
        '',
        '__optimization_tools__',
        '',
        "        minimizer:[\n" +
        "           isProdFunc(isProd,  __minificationCSS__, __minificationJS__)\n" +
        "        ])\n",
        null),
    new ConfigItem.ConfigItem('minificationCSS',
        true, 'optimize-css-assets-webpack-plugin',
        'const OptimizeCssAssetPlugin = require(\'optimize-css-assets-webpack-plugin\')',
        '__minificationCSS__',
        '',
        "            new OptimizeCssAssetPlugin(),\n",
        null),
    new ConfigItem.ConfigItem('minificationJS',
        true, 'terser-webpack-plugin',
        'const TerserWebpackPlugin = require(\'terser-webpack-plugin\')',
        '__minificationJS__',
        '',
        "            new TerserWebpackPlugin(),\n",
        null),
    new ConfigItem.ConfigItem('minificationHTML',
        false, '',
        '',
        '__minificationHTML__',
        '',
        "            minify: {\n" +
        "                collapseWhitespace: isProd\n" +
        "            }\n",
        null),
    new ConfigItem.ConfigItem('sourceMap',
        false, '',
        '',
        '__source_map__',
        '',
        "    devtool: isDev ? 'source-map': 'eval',\n",
        null),
    new ConfigItem.ConfigItem('bundleAnalysis',
        false, '',
        'const {BundleAnalyzerPlugin} = require(\'webpack-bundle-analyzer\')',
        '__bundle_analyzer__',
        '',
        "   new BundleAnalyzerPlugin(),\n",
        null),
];

export default function generate(checkedQuestions: Object) {
    let webpackConfig = template;

    const reservedReplacedParams = ['__imports__\n', '__functions__'];
    const checkedItems = {};
    questions.forEach((value)=> {
        if (!reservedReplacedParams.includes(value.moduleNodePath)) {
            reservedReplacedParams.push(value.moduleNodePath);
        }

        if (!(value.id in checkedQuestions)) {
            return;
        }
        if (!checkedItems[value.moduleNodePath]) {
            checkedItems[value.moduleNodePath] = [];
        }
        checkedItems[value.moduleNodePath].push(value);
    });

    const imports = [];
    const functions = [];
    const npmRunCommands = ['npm install'];
    const npmRunDCommands = ['npm install -D'];

    for (const checkedItemsKey in checkedItems) {
        const arrayValue = checkedItems[checkedItemsKey];
        let exportModuleValue = '';
        arrayValue.forEach((value) => {
            if (!imports.includes(value.importModules) && value.importModules !== '') {
                imports.push(value.importModules);
            }
            if (value.requiredFunctions !== '' && !functions.includes(functionsBodies[value.requiredFunctions])) {
                functions.push(functionsBodies[value.requiredFunctions]);
            }
            if (value.npmRun.command !== '') {
                if (value.npmRun.isDev) {
                    npmRunDCommands.push(value.npmRun.command);
                } else {
                    npmRunCommands.push(value.npmRun.command);
                }
            }
            exportModuleValue += value.replaceFunction === null
                ? value.configText
                : value.replaceFunction(value.configText, checkedQuestions[value.id]);
        });
        webpackConfig = webpackConfig.replace(checkedItemsKey, exportModuleValue);
    }

    webpackConfig = webpackConfig.replace('__imports__', imports.join('\n'));
    webpackConfig = webpackConfig.replace('__functions__', functions.join('\n'));
    reservedReplacedParams.forEach((value) => webpackConfig = webpackConfig.replace(value, ''));

    return {
        webpackConfig,
        npmRunCommands: npmRunCommands.length === 1 ? '' : npmRunCommands.join(' '),
        npmRunDCommands: npmRunDCommands.length === 1 ? '' :npmRunDCommands.join(' ')
    };
};
