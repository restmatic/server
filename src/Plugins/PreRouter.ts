/**
 * @file PreRouter
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project server
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {each} from 'lodash/fp'

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
      let MountMiddleware = extractMiddleware(Middleware)
      each((mw:{fn: any, name: string}) => {
        PluginLogger.log(`Adding pre-route middleware: ${mw.name}.`)
        Express.use(mw.fn)
      },MountMiddleware(PluginVariables.middlewareOrder))
    }
  })