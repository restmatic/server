"use strict";
/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project server
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_tools_1 = require("@pomegranate/plugin-tools");
const ExpressServer_1 = require("./Plugins/ExpressServer");
exports.Plugin = plugin_tools_1.ApplicationPlugin()
    .configuration({ name: 'server', type: 'application' })
    .applicationPlugins([ExpressServer_1.ExpressServerPlugin]);
//# sourceMappingURL=index.js.map