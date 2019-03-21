/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project server
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {ApplicationPlugin} from "@pomegranate/plugin-tools";
import {ExpressServerPlugin} from "./Plugins/ExpressServer";

export const Plugin = ApplicationPlugin()
  .configuration({name: 'server', type: 'application'})
  .applicationPlugins([ExpressServerPlugin])