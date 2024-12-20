import db from '../utils/db.js';

export default{
    findTagByPostID(PostID){
        return db('post_tags')
        .select('tag.*') 
        .join('tag', 'post_tags.TagID', 'tag.TagID') 
        .where('post_tags.PostID', PostID);
      
    },

    findPostByTagID(tagId, limit, offset){
        return db('post_tags')
        .select('posts.*', 'categories.CName as CName', 'subcategories.SCName as SCName')
        .join('posts', 'post_tags.PostID', 'posts.PostID')
        .join('categories', 'posts.CID', '=', 'categories.CID')
        .join('subcategories', 'posts.SCID', '=', 'subcategories.SCID')
        .where('post_tags.TagID', tagId)
        .orderBy('Premium', 'desc').limit(limit).offset(offset);
    },

    countByTagId(TagID) {
        return db('post_tags').where('TagID', TagID).count('* as total').first();
    },

    countAllTag() {
        return db('tag').count('* as total').first();
    },

    findTagBytagID(TagID){
        return db('tag').where('TagID', TagID).first();
    },


    
}