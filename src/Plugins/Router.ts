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

const tsGenerator = `// Generated by the Pomegranate cli on {{creationDate}}

// mountPath: {{mountPath}}

export const Routes = (Router, CaptureError) => {

  Router.get('/', (req, res, next) => {
    res.send('Hello from RestMatic!')
  })
  Router.post('/', (req, res, next) => {
    res.json({})
  })
  Router.put('/', (req, res, next) => {
    res.json({})
  })
  Router.delete('/', (req, res, next) => {
    res.json({})
  })
  
  return Router
}
`

const joinMountPath = (path: string[]) => {
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

      each((route) => {
        let splitPath = split('.', route)
        let routeFile = get(route, flatRoutes)
        let pendingRoute = require(routeFile)
        let Routes = get('Routes', pendingRoute)
        if (!Routes) {
          PluginLogger.error(`Router file ${route} does not export a Routes property.`, 0)
          throw new Error(`Route generation failed.`)
        }

        let injectedRoutes: Router = Injector.inject(Routes)

        if (isObject(injectedRoutes) && injectedRoutes.name === 'router') {
          let mountPath = joinMountPath(splitPath)
          RouteCount += 1;
          PluginLogger.log(`Loaded routes for ${mountPath}`);
          Express.use(mountPath, injectedRoutes)
        } else {
          PluginLogger.error(`Express Router: Attempted to load invalid route module:
            Route modules must return a Router Object.`)
        }
      }, keys(flatRoutes))

      PluginLogger.log(`Loaded ${RouteCount} route modules.`)
    }
  })
  .commands(function(PomConfig, PluginFiles, Handlebars){
    return (yargs) => {
      return yargs
        .usage('usage: $0')
        .command({
          command: 'generate <path> [filename]',
          aliases: 'g',
          describe: `Generates route file at <path>`,
          builder: (yargs) => {
            yargs
              .positional('path', {
                describe: 'The path the route file will be created.',
                default: '/',
                type: 'string'
              })
              .positional('filename', {
                describe: 'The the filename to be created at path.',
                default: 'index.ts',
                type: 'string'
              })
              .option('force', {
                alias: 'f',
                default: false,
                describe: 'overwrites the specified file if it exists.',
                type: 'boolean'
              })
          },
          handler: async (argv) => {
            let Pf = PluginFiles('main')
            let filePath = Pf.join(argv.path, argv.filename)
            let exists = await Pf.projectFileExists(filePath)
            let compile = Handlebars.compile(tsGenerator)
            let compiled = compile({creationDate: new Date().toDateString(), mountPath: argv.path})
            if(exists && !argv.force){
              throw new Error(`${filePath} \n exists \n Rerun with --force to overwrite.`)
            }
            await Pf.outputProjectFile(filePath, compiled)
            console.log(`Created @restmatic/Router route file at ${filePath}`)
            // console.log(argv, 'quack')
          }
        })
        .help()
    }
  })