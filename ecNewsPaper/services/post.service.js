import db from '../utils/db.js';
const now = new Date(); 

export default{
    //search   
    top3PostsLastWeek(){
        return db('posts')
        .select('posts.*', 'categories.CName as CName', 'subcategories.SCName as SCName')
        .join('categories', 'posts.CID', '=', 'categories.CID')
        .join('subcategories', 'posts.SCID', '=', 'subcategories.SCID')
        .where('StatusPost', "Đã xuất bản")
        .where('TimePublic', '<=', now)
        .orderBy('view', 'desc')
        .orderBy('Premium', 'desc')
        .orderBy('TimePublic', 'desc').limit(3);
    },

    top10MostView(limit, offsetMV){
        return db('posts')
        .join('categories', 'posts.CID', '=', 'categories.CID')
        .join('subcategories', 'posts.SCID', '=', 'subcategories.SCID')
        .select('posts.*', 'categories.CName as CName', 'subcategories.SCName as SCName')
        .where('StatusPost', "Đã xuất bản")
        .where('TimePublic', '<=', now)
        .orderBy('Premium', 'desc')
        .orderBy('view', 'desc').limit(limit).offset(offsetMV);
    },

    top10NewestPost(limit, offsetNP){
        return db('posts')
        .join('categories', 'posts.CID', '=', 'categories.CID')
        .join('subcategories', 'posts.SCID', '=', 'subcategories.SCID')
        .select('posts.*', 'categories.CName as CName', 'subcategories.SCName as SCName')
        .where('TimePublic', '<=', now)
        .where('StatusPost', "Đã xuất bản")
        .orderBy('Premium', 'desc')
        .orderBy('TimePublic', 'desc').limit(limit).offset(offsetNP);
    },

    top10CategoriesByView(limit, offsetTC) {
        return db('posts')
          .select('posts.CID', db.raw('SUM(view) as total_views'))
          .where('TimePublic', '<=', now)
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
        .where('TimePublic', '<=', now)
        .where('posts.CID',CID).where('StatusPost', "Đã xuất bản")
        .orderBy('Premium', 'desc')
        .orderBy('TimePublic', 'desc').first();

    },

    findPostsBySCID(SCID, limit, offset)
    {
        return db('posts')
        .join('categories', 'posts.CID', '=', 'categories.CID')
        .join('subcategories', 'posts.SCID', '=', 'subcategories.SCID')
        .select('posts.*', 'categories.CName as CName', 'subcategories.SCName as SCName')
        .where('TimePublic', '<=', now)
        .where('posts.SCID',SCID).where('StatusPost', "Đã xuất bản")
        .orderBy('Premium', 'desc')
        .orderBy('TimePublic', 'desc').limit(limit).offset(offset);
    },

    findPostsByPostID(PostID) {
        return db('posts')
        .join('categories', 'posts.CID', '=', 'categories.CID')
        .join('subcategories', 'posts.SCID', '=', 'subcategories.SCID')
        .select('posts.*', 'categories.CName as CName', 'subcategories.SCName as SCName')
        .where('TimePublic', '<=', now)
        .where('PostID', PostID).where('StatusPost', "Đã xuất bản").first();
    },

    findPostsByCID(CID, limit, offset){
        return db('posts')
        .join('categories', 'posts.CID', '=', 'categories.CID')
        .join('subcategories', 'posts.SCID', '=', 'subcategories.SCID')
        .select('posts.*', 'categories.CName as CName', 'subcategories.SCName as SCName')
        .where('TimePublic', '<=', now)
        .where('posts.CID',CID).where('StatusPost', "Đã xuất bản")
        .orderBy('Premium', 'desc')
        .orderBy('TimePublic', 'desc').limit(limit).offset(offset);
    },

    searchPosts(keyword, limit, offset) {
        return db('posts')
        .join('categories', 'posts.CID', '=', 'categories.CID')
        .join('subcategories', 'posts.SCID', '=', 'subcategories.SCID')
        .select('posts.*', 'categories.CName as CName', 'subcategories.SCName as SCName')
        .where('TimePublic', '<=', now)
        .whereRaw("MATCH(PostTitle, SumContent, Content) AGAINST (? IN NATURAL LANGUAGE MODE)", [keyword])
        .orderBy('Premium', 'desc').limit(limit).offset(offset);
    },

    //count
    countBySubCatId(SCID) {
        return db('posts').where('SCID', SCID).where('TimePublic', '<=', now).count('* as total').first();
    },

    countByCatId(CID) {
        return db('posts').where('CID', CID).where('TimePublic', '<=', now).count('* as total').first();
    },
    

    countBySearch(keyword){
        return db('posts')
          .where('TimePublic', '<=', now)
          .whereRaw("MATCH(PostTitle, SumContent, Content) AGAINST (? IN NATURAL LANGUAGE MODE)", [keyword]).count('* as total').first();
    },

    //update
    IncreaseView(PostID) {
        return db('posts').where('PostID', PostID).increment('view', 1);
    } ,
    findAllPosts() {
        return db('posts').select('*');
    },

    addPost(post) {
        return db('posts').insert(post);
    },

    deletePost(PostID) {
        return db('posts').where('PostID', PostID).del();
    },

    updatePost(post) {
        return db('posts')
            .where('PostID', post.PostID)
            .update({
                PostTitle: post.PostTitle,
                CID: post.CID,
                SCID: post.SCID,
                UID: post.UID,
                TimePost: post.TimePost,
                SumContent: post.SumContent,
                Content: post.Content,
                source: post.source,
                linksource: post.linksource,
                view: post.view,
                Duyet: post.Duyet,
                StatusPost: post.StatusPost,
                Reason: post.Reason,
                TimePublic: post.TimePublic,
                Premium: post.Premium,
                xoa: post.xoa
            });
    },

    findPostsByUserID(userID) {
        const query = `SELECT * FROM posts WHERE UID = ?`;
        const [rows] = db.execute(query, [userID]);
        return rows;
    }
    
}