import db from '../utils/db.js';

export default {
  add(entity) {
    return db('users').insert(entity);
  },

  findByUsername(UserName) {
    return db('users').where('UserName', UserName).first();
  },

  patch(id, entity){
    return db('users').where('UserID',id).update(entity);
  },
}