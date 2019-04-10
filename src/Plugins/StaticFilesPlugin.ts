/**
 * @file StaticFilesPlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project server
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {CreatePlugin} from "@pomegranate/plugin-tools";

export const StaticFilesPlugin = CreatePlugin('merge')
  .configuration({
    name: 'StaticFiles',
    injectableParam: 'Middleware',
    depends: ['@restmatic/ProjectMiddleware']
  })
  .variables({
    serve: true
  })
  .directories([{prop: 'main', path: '.'}])
  .hooks({
    load: function(Injector, PluginVariables) {
      return {ok: true}
    }
  })
