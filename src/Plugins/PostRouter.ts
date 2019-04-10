
/**
 * @file PostRouter
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project server
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {each} from 'lodash/fp'
import {CreatePlugin} from "@pomegranate/plugin-tools";
import {extractMiddleware} from "./helpers/ExtractMiddleware";

export const PostRouter = CreatePlugin('action')
  .configuration({
    name: 'PostRouter',
    depends: ['@restmatic/Router']
  })
  .variables({
    middlewareOrder: ['404', '500']
  })
  .hooks({
    load: (PluginInjector, PluginLogger, PluginVariables, Middleware, Express) => {
      PluginLogger.log('Configuring post-route Middleware', 1)
      let MountMiddleware = extractMiddleware(Middleware)

      each((mw:{fn: any, name: string}) => {
        PluginLogger.log(`Adding post-route middleware: ${mw.name}.`)
        Express.use(mw.fn)
      },MountMiddleware(PluginVariables.middlewareOrder))
    }
  })