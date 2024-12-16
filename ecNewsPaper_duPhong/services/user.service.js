import db from '../utils/db.js';

export default{
    findByUsername(username){
        return db('users').where('UserName', username).first();
    },

    add(entity){
        return db('users').insert(entity);
    }
}