import db from '../utils/db.js';

export default{

    //search   
    top3PostsLastWeek(){
        return db('posts').where('StatusPost', "Đã xuất bản").orderBy('view', 'desc').orderBy('TimePublic', 'desc').limit(3);
    },

    top10MostView(){
        return db('posts').where('StatusPost', "Đã xuất bản").orderBy('view', 'desc').limit(10);
    },

    top10NewestPost(){
        return db('posts').where('StatusPost', "Đã xuất bản").orderBy('TimePublic', 'desc').limit(10);
    },

    top10CategoriesByView() {
        return db('posts')
          .select('posts.CID', db.raw('SUM(view) as total_views'))
          .groupBy('posts.CID')
          .orderBy('total_views', 'desc')
          .limit(10);
    },

    findNewestPostByCID(CID){
        return db('posts').where('CID',CID).where('StatusPost', "Đã xuất bản").orderBy('TimePublic', 'desc').first();

    },

    findPostsBySCID(SCID)
    {
        return db('posts').where('SCID',SCID).where('StatusPost', "Đã xuất bản");
    },

    findPostsByPostID(PostID) {
        return db('posts').where('PostID', PostID).where('StatusPost', "Đã xuất bản").first();
    },

    findPostsByCID(CID){
        return db('posts').where('CID',CID).where('StatusPost', "Đã xuất bản");
    },

    //update
    IncreaseView(PostID) {
        return db('posts').where('PostID', PostID).increment('view', 1);
    }   
    
}