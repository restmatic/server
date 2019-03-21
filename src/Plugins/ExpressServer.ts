/**
 * @file ExpressServer
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project server
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {EffectPlugin} from "@pomegranate/plugin-tools";

export const ExpressServerPlugin = EffectPlugin()
.variables({
  port: 8080,
  address: 'localhost'
})
.configuration({
  name: 'ExpressServer',
  type: 'action'
})
.hooks({
  load: () => {

  },
  start: () => {

  },
  stop: () => {

  }
})