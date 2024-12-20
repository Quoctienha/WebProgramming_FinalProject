import db from '../utils/db.js';

export default{
    //Categories
    findAllCategories() {
       return db('categories').orderBy('CID', 'asc');
    },

    findCategoriesWithLimitOffset(limit, offset) {
        return db('categories').orderBy('CID', 'asc').limit(limit).offset(offset);
    },

    findCategoriesByCID(CID){
        return db('categories').where('CID', CID).first();

    },
    countAllCategories() {
        return db('categories').count('* as total').first();
    },

    //sub Categories
    findSubCategoriesBySCID(SCID) {
        return db('subcategories').where('SCID', SCID).first();
    },

    findSubCategoriesByCID(CID){
        return db('subcategories').where('CID', CID).orderBy('SCID', 'asc');
    },
    
}