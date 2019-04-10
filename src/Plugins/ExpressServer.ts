/**
 * @file ExpressServer
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project server
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {CreatePlugin} from "@pomegranate/plugin-tools";

export const ExpressServerPlugin = CreatePlugin('action')
.variables({
  port: 8080,
  address: 'localhost'
})
.configuration({
  name: 'ExpressServer',
  depends: ['@restmatic/PostRouter']
})
.hooks({
  load: () => {

  },
  start: (Express, PluginVariables,PluginStore, PluginLogger) => {
    PluginStore.server = Express.listen(PluginVariables.port, () => {
      PluginLogger.log(`Started RestMatic server on port ${PluginVariables.port}`)
    })
  },
  stop: (PluginStore) => {
    PluginStore.server.close()
  }
})