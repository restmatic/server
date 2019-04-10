/**
 * @file ProjectMiddleware
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project server
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {map, fromPairs, get, isFunction} from 'lodash/fp'

import {CreatePlugin} from "@pomegranate/plugin-tools";

export const ProjectMiddleware = CreatePlugin('merge')
  .directories([{path: '.', prop: 'root'}])
  .configuration({
    name: 'ProjectMiddleware',
    injectableParam: 'Middleware',
    injectableScope: 'namespace',
    depends: ['@restmatic/BundledMiddleware']
  })
  .hooks({
    load: async (Injector,PluginLogger, PluginVariables, PluginFiles, Middleware) => {
      PluginLogger.log('Creating Project Middleware.', 1)
      let files = await PluginFiles('root').fileList({ext: '.js'})

      let build = map((file) => {
        let required = require(file.path)
        let fileName = file.getBaseName()

        PluginLogger.log(fileName)

        let mw = get('Middleware', required)
        if(!mw){
          throw new Error(`Middleware file ${fileName} does not contain an export on the Middleware property.`)
        }
        if(!isFunction(mw)){
          throw new Error(`Middleware file ${fileName} does not export an injectable function on the Middleware property.`)
        }
        return [file.getBaseName(), Injector.inject(mw)]
      }, files)

      return fromPairs(build)
    }
  })