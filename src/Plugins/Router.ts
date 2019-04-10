/**
 * @file Routes
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project server
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {Router} from "express";
import {mapValues, keys, each, split, last, get, isObject, initial, join} from 'lodash/fp'
import {CreatePlugin, PluginFiles} from "@pomegranate/plugin-tools";
import {flattenKeys} from "lodash-fun";

const joinMountPath = (path: string[])=>{
  let pathParts = initial(path)
  let pathStart = pathParts.length ? pathParts : []

  return `/${last(path) === 'index' ? join('/', pathStart) : join('/', path)}`

}

export const RouterPlugin = CreatePlugin('action')
  .configuration({
    name: 'Router',
    depends: ['@restmatic/PreRouter']
  })
  .directories([{prop: 'main', path: '.'}])
  .hooks({
    load: async (Injector, PluginLogger, PluginFiles: PluginFiles, Express) => {
      let RouteStructure = await PluginFiles('main').fileListNested({ext: '.js'})
      let flatRoutes = flattenKeys(RouteStructure)
      let RouteCount = 0

      each((route)=>{
        let splitPath = split('.', route)
        let routeFile = get(route, flatRoutes)
        let pendingRoute = require(routeFile)
        let Routes = get('Routes', pendingRoute)
        if(!Routes){
          PluginLogger.error(`Router file ${route} does not export a Routes property.`, 0)
          throw new Error(`Route generation failed.`)
        }

        let injectedRoutes: Router = Injector.inject(Routes)

        if(isObject(injectedRoutes) && injectedRoutes.name === 'router'){
          let mountPath = joinMountPath(splitPath)
          RouteCount += 1;
          PluginLogger.log(`Loaded routes for ${mountPath}`);
          Express.use(mountPath, injectedRoutes)
        } else {
          PluginLogger.error(`Express Router: Attempted to load invalid route module:
            Route modules must return a Router Object.`)
        }
      },keys(flatRoutes))

      PluginLogger.log(`Loaded ${RouteCount} route modules.`)
    }
  })