"use strict";
/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project server
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_tools_1 = require("@pomegranate/plugin-tools");
const ExpressCore_1 = require("./Plugins/ExpressCore");
const ExpressServer_1 = require("./Plugins/ExpressServer");
const StaticFilesPlugin_1 = require("./Plugins/StaticFilesPlugin");
const BundledMiddleware_1 = require("./Plugins/BundledMiddleware");
const Middleware_1 = require("./Plugins/Middleware");
const ExpressConfiguration_1 = require("./Plugins/ExpressConfiguration");
const PreRouter_1 = require("./Plugins/PreRouter");
const Router_1 = require("./Plugins/Router");
const PostRouter_1 = require("./Plugins/PostRouter");
exports.Plugin = plugin_tools_1.CreatePlugin('application')
    .configuration({ name: 'server' })
    .applicationPlugins([
    ExpressCore_1.ExpressCorePlugin,
    ExpressConfiguration_1.ExpressConfiguration,
    BundledMiddleware_1.BundledMiddleware,
    Middleware_1.Middleware,
    StaticFilesPlugin_1.StaticFilesPlugin,
    PreRouter_1.PreRouter,
    Router_1.RouterPlugin,
    PostRouter_1.PostRouter,
    ExpressServer_1.ExpressServerPlugin,
]);
//# sourceMappingURL=index.js.map