import db from '../utils/db.js';

export default{
    findTagByPostID(PostID){
        return db('post_tags')
        .select('tag.*') // Chỉ lấy TagID và TName
        .join('tag', 'post_tags.TagID', 'tag.TagID') // Join với bảng tags
        .where('post_tags.PostID', PostID);
      
    },

    findPostByTagID(tagId, limit, offset){
        return db('post_tags')
        .select('posts.*',)
        .join('posts', 'post_tags.PostID', 'posts.PostID')
        .where('post_tags.TagID', tagId).limit(limit).offset(offset);
    },

    countByTagId(TagID) {
        return db('post_tags').where('TagID', TagID).count('* as total').first();
    },

    findTagBytagID(TagID){
        return db('tag').where('TagID', TagID).first();
    },


    
}