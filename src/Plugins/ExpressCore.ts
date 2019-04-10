/**
 * @file ExpressCore
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project server
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {CreatePlugin} from "@pomegranate/plugin-tools";
import express from 'express'

const configRouter = (configOptions) => () => express.Router(configOptions)

export const ExpressCorePlugin = CreatePlugin('composite')
.configuration({
  name: 'Core',
})
.variables({
  routerOptions: {
    caseSensitive: true,
    mergeParams: false,
    strict: false
  }
})
.hooks({
  load: (PluginVariables, Injector) => {
    let App = express()
    return [
      {injectableScope: 'application',injectableParam: 'Express', load: App},
      {injectableScope: 'application',injectableParam: 'Router', load: configRouter(PluginVariables.routerOptions), type: 'factory'},
      {injectableScope: 'namespace',injectableParam: 'Middleware', load: {What: 'What'}, type: 'merge'},
      {injectableScope: 'application',injectableParam: 'ExpressConfig', load: {}, type: 'merge'}
    ]
  }
})