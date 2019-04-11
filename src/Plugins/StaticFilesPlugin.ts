/**
 * @file StaticFilesPlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project server
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {CreatePlugin} from "@pomegranate/plugin-tools";
import serveStatic from 'serve-static'

export const StaticFilesPlugin = CreatePlugin('merge')
  .configuration({
    name: 'StaticFiles',
    injectableParam: 'Middleware',
    injectableScope: 'namespace',
    depends: ['@restmatic/Middleware']
  })
  .variables({
    serve: true
  })
  .directories([{prop: 'main', path: '.'}])
  .hooks({
    load: function(Injector, PluginVariables, PluginFiles) {
      return {serveStatic: serveStatic(PluginFiles('main').workingDirectory)}
    }
  })
