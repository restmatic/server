/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project server
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {CreatePlugin} from "@pomegranate/plugin-tools";
import {ExpressCorePlugin} from "./Plugins/ExpressCore";
import {ExpressServerPlugin} from "./Plugins/ExpressServer";
import {StaticFilesPlugin} from "./Plugins/StaticFilesPlugin";
import {BundledMiddleware} from "./Plugins/BundledMiddleware";
import {ProjectMiddleware} from "./Plugins/ProjectMiddleware";
import {ExpressConfiguration} from "./Plugins/ExpressConfiguration";
import {PreRouter} from "./Plugins/PreRouter";
import {RouterPlugin} from "./Plugins/Router";
import {PostRouter} from "./Plugins/PostRouter";

export const Plugin = CreatePlugin('application')
  .configuration({name: 'server'})
  .applicationPlugins([
    ExpressCorePlugin,
    ExpressConfiguration,
    BundledMiddleware,
    ProjectMiddleware,
    StaticFilesPlugin,
    PreRouter,
    RouterPlugin,
    PostRouter,
    ExpressServerPlugin,
  ])