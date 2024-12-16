import db from '../utils/db.js';

export default{
    findByUsername(username){
        return db('users').where('UserName', username).first();
    },

    add(entity){
        return db('users').insert(entity);
    },

    patch(id, entity){
        return db('users').where('UserID',id).update(entity);
    },

    // Tìm người dùng theo email
    findByEmail(email) {
        return db('users').where('Email', email).first();
    },

    updatePasswordByEmail(email, newPassword) {
       return db('users')
       .where('Email', email) // Tìm người dùng theo email
       .update({ Password_hash: newPassword }); // Cập nhật mật khẩu mới
    },

    updatePasswordbyID(userID, newPasswordHash) {
        return db('users')
        .where('UserID', userID)
        .update('Password_hash', newPasswordHash);
    }
}