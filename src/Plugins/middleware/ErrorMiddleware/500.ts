/**
 * @file 500
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project server
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

export const fivehundred = function(err, req, res, next){
  res.status(500)
  res.json({error: 'Something broke'})
}