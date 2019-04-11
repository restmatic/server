/**
 * @file ProjectMiddleware
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project server
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {map, fromPairs, get, isFunction} from 'lodash/fp'

import {CreatePlugin} from "@pomegranate/plugin-tools";

const tsGenerator = `// Generated by the Pomegranate cli on {{creationDate}}

// name: {{name}}

export const Middleware = (PluginLogger) => {
  return (req, res, next) => {
    PluginLogger.log('Saying hello from a middleware file')
    next()
  }
}
`

export const Middleware = CreatePlugin('merge')
  .directories([{path: '.', prop: 'main'}])
  .configuration({
    name: 'Middleware',
    injectableParam: 'Middleware',
    injectableScope: 'namespace',
    depends: ['@restmatic/BundledMiddleware']
  })
  .hooks({
    load: async (Injector, PluginLogger, PluginVariables, PluginFiles, Middleware) => {
      PluginLogger.log('Creating Project Middleware.', 1)
      let files = await PluginFiles('main').fileList({ext: '.js'})

      let build = map((file) => {
        let required = require(file.path)
        let fileName = file.getBaseName()

        PluginLogger.log(fileName)

        let mw = get('Middleware', required)
        if (!mw) {
          throw new Error(`Middleware file ${fileName} does not contain an export on the Middleware property.`)
        }
        if (!isFunction(mw)) {
          throw new Error(`Middleware file ${fileName} does not export an injectable function on the Middleware property.`)
        }
        return [file.getBaseName(), Injector.inject(mw)]
      }, files)

      return fromPairs(build)
    }
  })
  .commands(function (PomConfig, PluginFiles, Handlebars) {
    return (yargs) => {
      return yargs
        .usage('usage: $0')
        .command({
          command: 'generate <name>',
          aliases: 'g',
          describe: `Generates Middleware file <name>`,
          builder: (yargs) => {
            yargs
              .positional('name', {
                describe: 'The the filename to be created at path.',
                default: 'index',
                type: 'string'
              })
              .option('l', {
                alias: 'language',
                describe: 'Generate TypeScript or Javascript',
                default: 'ts',
                choices: ['ts'],
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
            let file = `${argv.name}.${argv.language}`
            let exists = await Pf.projectFileExists(file)
            let compile = Handlebars.compile(tsGenerator)
            let compiled = compile({creationDate: new Date().toDateString(), name: argv.name})

            if (exists && !argv.force) {
              throw new Error(`${file} \n exists \n Rerun with --force to overwrite.`)
            }
            await Pf.outputProjectFile(file, compiled)
            console.log(`Created @restmatic/ProjectMiddleware Middleware file ${file}`)

          }
        })
        .help()
    }
  })