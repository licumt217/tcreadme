/**
 * 角色和资源关系
 */
var mongoose = require('../db.js'),
    Schema = mongoose.Schema;

var RoleResourceRelationSchema = new Schema({
    
    roleId: {type: String, required:true},                    //
    resourceId: {type: String, required:true}                    //
});

module.exports = mongoose.model('RoleResourceRelation', RoleResourceRelationSchema);