/**
 * @file PreRouter
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project server
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {map, filter, isFunction, each} from 'lodash/fp'

import {CreatePlugin} from "@pomegranate/plugin-tools";

export const ExpressConfiguration = CreatePlugin('action')
  .directories([{path: '.', prop: 'root'}])
  .configuration({
    name: 'ExpressConfiguration',
    optional: ['@restmatic/Core']
  })
  .hooks({
    load: async (Injector,PluginLogger, PluginVariables, PluginFiles, Middleware, ExpressConfig) => {
      PluginLogger.log('Configuring Express Application', 1)
      let files = await PluginFiles('root').fileList({ext: '.js'})
      let ready = map((file) => {
        let required = require(file.path)
        PluginLogger.log(file.getBaseName())
        return required.ExpressSetting
      }, files)
      let toInject = filter((fn) => {
        return isFunction(fn)
      }, ready)

      each((settingFn) => {
        Injector.inject(settingFn)
      }, toInject)

    }
  })