import db from '../utils/db.js';

export default{
    //Categories
    findAllCategories() {
       return db('categories');
    },

    findCategoriesByCID(CID){
        return db('categories').where('CID', CID).first();

    },

    //sub Categories
    findSubCategoriesBySCID(SCID) {
        return db('subcategories').where('SCID', SCID).first();
    },

    findSubCategoriesByCID(CID){
        return db('subcategories').where('CID', CID);
    },
    
}