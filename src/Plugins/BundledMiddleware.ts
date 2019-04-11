/**
 * @file BundledMiddleware
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project server
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {CreatePlugin} from "@pomegranate/plugin-tools";
import {parse} from 'url'
import morgan from 'morgan'
import compression from 'compression'
import responseTime from 'response-time'
import {fivehundred} from "./middleware/ErrorMiddleware/500";
import {fourOhfour} from "./middleware/ErrorMiddleware/404";

//@ts-ignore
const logCommon = morgan.compile(morgan.common);
function findSkippedLogging(skipPaths){

  let skipfn = function(req, res){
    let pathname = parse(req.originalUrl).pathname
    return skipPaths.reduce(function(oldVal, newVal){
      if(newVal === pathname) return true
      return oldVal
    }, false)
  }

  return {
    skip: skipPaths && skipPaths.length >= 1 ? skipfn : false
  }
}
export const BundledMiddleware = CreatePlugin('merge')
  .configuration({
    name: 'BundledMiddleware',
    injectableParam: 'Middleware',
    injectableScope: 'namespace',
    depends: ['@restmatic/ExpressConfiguration']
  })
  .variables({
    skipLogging: [
      '/health'
    ]
  })
  .hooks({
    load: function(Injector, PluginVariables, PluginLogger) {

      return {
        404: fourOhfour,
        500: fivehundred,
        compression: compression(),
        responseTime: responseTime(),
        //@ts-ignore
        logger: morgan((t, req, res) => {
          var resObj = {
            'remote-addr': t['remote-addr'](req, res),
            'date': t['date'](req, res),
            'method': t['method'](req, res),
            'url': t['url'](req, res),
            'status': t['status'](req, res),
            'content-length': res['content-length'],
            'response-time': t['response-time'](req, res) + 'ms'
          };
          //@ts-ignore
          PluginLogger.log(logCommon(morgan, req, res))
        }, findSkippedLogging(PluginVariables.skipLogging))
      }
    }
  })