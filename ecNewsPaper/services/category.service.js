import db from '../utils/db.js';

export default{
    findAllCategories() {
       return db('categories');
    },

    
    findSubCategoriesByID(CID){
        return db('subcategories').where('CID', CID);
    },
    findPostsByCID(SCID)
    {
        return db('posts').where('SCID',SCID);
    },
    findPostsByPostID(PostID) {
        return db('posts').where('PostID', PostID);
    },
    
}