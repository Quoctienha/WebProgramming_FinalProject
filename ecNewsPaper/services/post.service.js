import db from '../utils/db.js';

export default{

    //search   
    top3PostsLastWeek(){
        return db('posts')
<<<<<<< HEAD
        .select('posts.*', 'categories.CName as CName', 'subcategories.SCName as SCName')
        .join('categories', 'posts.CID', '=', 'categories.CID')
        .join('subcategories', 'posts.SCID', '=', 'subcategories.SCID')
=======
        .join('categories', 'posts.CID', '=', 'categories.CID')
        .join('subcategories', 'posts.SCID', '=', 'subcategories.SCID')
        .select('posts.*', 'categories.CName as CName', 'subcategories.SCName as SCName')
>>>>>>> d81256e34f2c58bbf84262f547b0e71354aacebf
        .where('StatusPost', "Đã xuất bản")
        .orderBy('view', 'desc')
        .orderBy('TimePublic', 'desc').limit(3);
    },

    top10MostView(limit, offsetMV){
        return db('posts')
        .join('categories', 'posts.CID', '=', 'categories.CID')
        .join('subcategories', 'posts.SCID', '=', 'subcategories.SCID')
        .select('posts.*', 'categories.CName as CName', 'subcategories.SCName as SCName')
        .where('StatusPost', "Đã xuất bản").orderBy('view', 'desc').limit(limit).offset(offsetMV);
    },

    top10NewestPost(limit, offsetNP){
        return db('posts')
        .join('categories', 'posts.CID', '=', 'categories.CID')
        .join('subcategories', 'posts.SCID', '=', 'subcategories.SCID')
        .select('posts.*', 'categories.CName as CName', 'subcategories.SCName as SCName')
        .where('StatusPost', "Đã xuất bản").orderBy('TimePublic', 'desc').limit(limit).offset(offsetNP);
    },

    top10CategoriesByView(limit, offsetTC) {
        return db('posts')
          .select('posts.CID', db.raw('SUM(view) as total_views'))
          .groupBy('posts.CID')
          .orderBy('total_views', 'desc')
          .limit(limit)
          .offset(offsetTC);
    },

    findNewestPostByCID(CID){
        return db('posts')
        .join('categories', 'posts.CID', '=', 'categories.CID')
        .join('subcategories', 'posts.SCID', '=', 'subcategories.SCID')
        .select('posts.*', 'categories.CName as CName', 'subcategories.SCName as SCName')
        .where('posts.CID',CID).where('StatusPost', "Đã xuất bản").orderBy('TimePublic', 'desc').first();

    },

    findPostsBySCID(SCID, limit, offset)
    {
        return db('posts')
        .join('categories', 'posts.CID', '=', 'categories.CID')
        .join('subcategories', 'posts.SCID', '=', 'subcategories.SCID')
        .select('posts.*', 'categories.CName as CName', 'subcategories.SCName as SCName')
        .where('posts.SCID',SCID).where('StatusPost', "Đã xuất bản").orderBy('TimePublic', 'desc').limit(limit).offset(offset);
    },

    findPostsByPostID(PostID) {
        return db('posts')
        .join('categories', 'posts.CID', '=', 'categories.CID')
        .join('subcategories', 'posts.SCID', '=', 'subcategories.SCID')
        .select('posts.*', 'categories.CName as CName', 'subcategories.SCName as SCName')
        .where('PostID', PostID).where('StatusPost', "Đã xuất bản").first();
    },

    findPostsByCID(CID, limit, offset){
        return db('posts')
        .join('categories', 'posts.CID', '=', 'categories.CID')
        .join('subcategories', 'posts.SCID', '=', 'subcategories.SCID')
        .select('posts.*', 'categories.CName as CName', 'subcategories.SCName as SCName')
        .where('posts.CID',CID).where('StatusPost', "Đã xuất bản").orderBy('TimePublic', 'desc').limit(limit).offset(offset);
    },

    countBySubCatId(SCID) {
        return db('posts').where('SCID', SCID).count('* as total').first();
    },

    countByCatId(CID) {
        return db('posts').where('CID', CID).count('* as total').first();
    },

    //update
    IncreaseView(PostID) {
        return db('posts').where('PostID', PostID).increment('view', 1);
    }   
    
}