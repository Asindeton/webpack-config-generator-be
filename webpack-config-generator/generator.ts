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
    plugins:
        "const plugins = (template) =>{\n" +
        "    const base = [\n" +
        "        new HtmlWebpackPlugin({\n" +
        "            template: template,\n" +
        "            minify: {\n" +
        "                collapseWhitespace: isProd\n" +
        "            }\n" +
        "        }),\n" +
        "        new CleanWebpackPlugin(),\n" +
        "        new MiniCssExtractPlugin({\n" +
        "            filename: filename('css'),\n" +
        "        })\n" +
        "    ]\n" +
        "\n" +
        "    if(isProd){\n" +
        "        base.push(new BundleAnalyzerPlugin())\n" +
        "    }\n" +
        "\n" +
        "    return base\n" +
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
    "    context:  path.resolve(__dirname,'src'),\n" +
    "    mode: 'development',\n" +
    "    entry:{\n" +
    "        main:  ['@babel/polyfill','./script.js'],\n" +
    "        analytics: './analytics.ts',\n" +
    "    }, \n" +
    "    output:{\n" +
    "        filename: filename('js'),\n" +
    "        path: path.resolve(__dirname, 'dist')\n" +
    "    },\n" +
    "    resolve:{\n" +
    "        extensions:['.js', '.json'],\n" +
    "        alias:{\n" +
    "            '@': path.resolve(__dirname,'src')\n" +
    "        }\n" +
    "    },\n" +
    "    devtool: isDev ? 'source-map': 'eval',\n" +
    "    plugins: plugins('./index.html'),\n" +
    "    optimization: optimization(),\n" +
    "    devServer:{\n" +
    "        __port__" +
    "        hot: isDev,\n" +
    "    },\n" +
    "    module:{\n" +
    "        rules:[__module_rules__]\n" +
    "    }\n" +
    "}";

const questions = [
    new ConfigItem.ConfigItem('less',
        true, 'less-loader',
        'const MiniCssExtractPlugin = require(\'mini-css-extract-plugin\')',
        '__module_rules__',
        'cssLoaders',
        '{\n' +
        '   test: /\\.less$/,\n' +
        '   use: cssLoaders(\'less-loader\')\n' +
        '},',
        null),
    new ConfigItem.ConfigItem('sass',
        true, 'node-sass sass-loader',
        'const MiniCssExtractPlugin = require(\'mini-css-extract-plugin\')',
        '__module_rules__',
        'cssLoaders',
        '{\n' +
        '   test: /\\.s[ac]ss$/,\n' +
        '   use: cssLoaders(\'sass-loader\') \n' +
        '},',
        null),
    new ConfigItem.ConfigItem('devServerPort',
        false, '',
        '',
        '__port__',
        '',
        'port: __port_number__,\n',
        (value, replaceWith = 4000) => {
            return value.replace('__port_number__', replaceWith);
        }),
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
