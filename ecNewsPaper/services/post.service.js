import db from '../utils/db.js';

export default{
    
    top3PostsLastWeek(){
        return db('posts').where('StatusPost', "Đã xuất bản").orderBy('view', 'desc').orderBy('TimePost', 'desc').limit(3);
    }

    
    
}