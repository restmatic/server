import {CreatePlugin} from "@pomegranate/plugin-tools";
import {curry} from 'lodash/fp'
import {each, filter, isFunction, map} from "lodash/fp";

/**
 * @file CaptureErrors
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project server
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

export const CaptureErrorPlugin = CreatePlugin('anything')
  .configuration({
    name: 'CaptureError',
    injectableParam: 'CaptureError',
    injectableScope: 'application',
    provides: ['@restmatic/Controllers']
  })
  .hooks({
    load: (Injector,PluginLogger, PluginVariables, PluginFiles, Middleware, ExpressConfig) => {
      const CaptureError = {
        capture: curry((next, statusCode, err) => {
          err.defaultStatusCode = statusCode || err.defaultStatusCode || 500
          return next(err)
        }),
        handle: (status, message) => {
          return (err, req, res, next) => {
            let errorStatus = status || req.errorStatusCode || err.defaultStatusCode || 500;
            let response = {
              statusCode: errorStatus,
              status: message || err.message || 'Sorry Something went wrong.',
              err: true,
              path: req.originalUrl || false,
              method: req.method
            };
            let logErr = {
              errorStatus,
              path: req.originalUrl || 'No req.originalUrl available',
              method: req.method || 'No req.method available',
              userUUID: req.user ? req.user.uuid : 'No req.user.uuid available',
              stack: err.stack || 'No stack available.',
              headers: req.headers
            }
            PluginLogger.error(logErr)

            if(err.errors && err.errors.length) {
              response.err = err.errors.map(function(v) {
                return {message: v.message, type: v.type}
              })
            }
            return res.status(errorStatus).json(response)
          }
        }
      }

      return CaptureError
    }
  })