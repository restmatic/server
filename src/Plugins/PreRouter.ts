/**
 * @file PreRouter
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project server
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {each, keys, chunk} from 'lodash/fp'

import {CreatePlugin} from "@pomegranate/plugin-tools";
import {extractMiddleware} from "./helpers/ExtractMiddleware";

export const PreRouter = CreatePlugin('action')
  .configuration({
    name: 'PreRouter',
    depends: ['@restmatic/StaticFiles']
  })
  .variables({
    middlewareOrder: ['compression', 'serveStatic', 'responseTime', 'logger']
  })
  .hooks({
    load: (PluginInjector, PluginLogger, PluginVariables, Middleware, Express) => {
      PluginLogger.log('Configuring Pre-route Middleware', 1)

      each((available) => {
        PluginLogger.log(`Available Middleware: ${available}`, 2)
      }, keys(Middleware))

      let MountMiddleware = extractMiddleware(Middleware)
      each((mw:{fn: any, name: string}) => {
        PluginLogger.log(`Using Middleware: ${mw.name}.`)
        Express.use(mw.fn)
      },MountMiddleware(PluginVariables.middlewareOrder))
    }
  })