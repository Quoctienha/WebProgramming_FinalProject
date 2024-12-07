import db from '../utils/db.js';

export default{
    findAllCategories() {
       return db('categories');
    },

    
    findSubCategoriesByID(CID){
        return db('subcategories').where('CID', CID);
    }
    
}