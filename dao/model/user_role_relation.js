/**
 * 用户和角色关系
 */
var mongoose = require('../db.js'),
    Schema = mongoose.Schema;

var UserRoleRelationSchema = new Schema({
    
    userId: {type: String, required:true},                    //
    roleId: {type: String, required:true}                    //
});

module.exports = mongoose.model('UserRoleRelation', UserRoleRelationSchema);