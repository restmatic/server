/**
 * @file RouteSecurity
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project server
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {CreatePlugin} from "@pomegranate/plugin-tools";

export const RouteSecurity = CreatePlugin('merge')
  .configuration({
    name: 'RouteSecurity',
    injectableParam: 'RouteSecurity',
    injectableScope: 'global',
    provides: ['@restmatic/Core']
  })
  .hooks({
    load: async (Injector, PluginLogger, PluginVariables, PluginFiles, Authentication) => {
      PluginLogger.log('Creating Core Security methods', 1)
      return {
      }
    }

  })