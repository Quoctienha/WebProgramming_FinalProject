import db from '../utils/db.js';

export default{
    

    addCategories(category) {
        return db('categories').insert(category);
    },

    deleteCategories(CatID) {
        return db('categories').where('CID', CatID).del();
    },

    updateCategories(category) {
        return db('categories')
            .where('CID', category.CID)
            .update('CName', category.CName);
    },

    findAllTag(limit, offset) {
        return db('tag').select('*').orderBy('TagID', 'asc').limit(limit)
        .offset(offset);;
    },

    addTag(tag) {
        return db('tag').insert(tag);
    },

    deleteTag(TagID) {
        return db('tag').where('TagID', TagID).del();
    },

    updateTag(tag) {
        return db('tag')
            .where('TagID', tag.TagID)
            .update('TName', tag.TName);
    },

    addSubcategory(subcategory) {
        return db('subcategories').insert(subcategory);
    },

    deleteSubcategory(SCID) {
        return db('subcategories').where('SCID', SCID).del();
    },

    updateSubcategory(subcategory) {
        return db('subcategories')
            .where('SCID', subcategory.SCID)
            .update('SCName', subcategory.SCName);
    }
}