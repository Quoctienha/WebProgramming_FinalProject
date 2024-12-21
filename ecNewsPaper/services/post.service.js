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

                StatusPost: post.StatusPost,
                Reason: post.Reason,
                TimePublic: post.TimePublic,
                Premium: post.Premium,

            });
    },

    async findPostsByUserID(userID) {
        const query = `SELECT * FROM posts WHERE UID = ?`;
        const [rows] = db.execute(query, [userID]);
        return rows;
    }
    ,
    findPostById(postID) {
        return db('posts')
            .leftJoin('categories', 'posts.CID', '=', 'categories.CID')
            .leftJoin('subcategories', 'posts.SCID', '=', 'subcategories.SCID')
            .select('posts.*', 'categories.CName as CName', 'subcategories.SCName as SCName')
            .where('posts.PostID', postID)
            .first();  // Ensures it returns only one post (first match)
    },

    // Add a new post using Knex
    addPost(newPost) {
        return db('posts').insert(newPost);
    },

    // Update an existing post using Knex
    updatePost(updatedPost) {
        return db('posts')
            .where('PostID', updatedPost.PostID)
            .update({
                PostTitle: updatedPost.PostTitle,
                CID: updatedPost.CID,
                SCID: updatedPost.SCID,
                UID: updatedPost.UID,
                TimePost: updatedPost.TimePost,
                SumContent: updatedPost.SumContent,
                Content: updatedPost.Content,
                source: updatedPost.source,
                linksource: updatedPost.linksource,
                view: updatedPost.view,

                StatusPost: updatedPost.StatusPost,
                Reason: updatedPost.Reason,
                TimePublic: updatedPost.TimePublic,
                Premium: updatedPost.Premium,

            });
    },

    // Delete a post by its ID using Knex
    deletePost(postID) {
        return db('posts').where('PostID', postID).del();
    },

    // Find all posts (optional method for admin view or other use) using Knex
    findAllPosts() {
        return db('posts')
            .leftJoin('categories', 'posts.CID', '=', 'categories.CID')
            .leftJoin('subcategories', 'posts.SCID', '=', 'subcategories.SCID')
            .select('posts.*', 'categories.CName as CName', 'subcategories.SCName as SCName')
            .orderBy('posts.TimePost', 'desc');
    },

    // Find posts by User UID using Knex
    findPostsByUserUID(UID) {
        return db('posts')
            .leftJoin('categories', 'posts.CID', '=', 'categories.CID')
            .leftJoin('subcategories', 'posts.SCID', '=', 'subcategories.SCID')
            .select('posts.*', 'categories.CName as CName', 'subcategories.SCName as SCName')
            .where('posts.UID', UID)
            .orderBy('posts.TimePost', 'desc');
    },

    // Find all categories for the add post form
    findAllCategories() {
        return db('categories').select('*');
    },

    // Find all subcategories for the add post form
    findAllSubcategories() {
        return db('subcategories').select('*');
    },
    async addTagsToPost(PostID, Tags) {
        // Assuming you have a `post_tags` table for the relationship
        const tagPromises = Tags.map(tagID => {
            return db('post_tags').insert({ PostID, TagID: tagID });
        });
        // Wait for all insert operations to complete
        await Promise.all(tagPromises);
    },
    findAllTags() {
        return db('tag').select('*');
    }
    
}