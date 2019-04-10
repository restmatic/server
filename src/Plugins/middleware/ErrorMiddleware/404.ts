/**
 * @file 404
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project server
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

export const fourOhfour = function(req, res, next){
  res.status(404)
  res.json({error: 'Not found'})
}