/**
 * @file ExtractMiddleware
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project server
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {compose, filter, isFunction, map} from "lodash/fp";

export const extractMiddleware = (Middleware) => {
  return compose(
    filter((mw: {fn: any, name: string}) => isFunction(mw.fn)),
    map((mw: string) => {
      return {fn: Middleware[mw], name: mw}
    })
  )
}