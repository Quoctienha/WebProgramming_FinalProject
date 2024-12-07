import db from '../utils/db.js';

export default{
    
    top3PostsLastWeek(){
        return db('posts').orderBy('view', 'desc').orderBy('TimePost', 'desc').limit(3);
    }

    
    
}