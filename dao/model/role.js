/**
 * 角色信息
 */
var mongoose = require('../db.js'),
    Schema = mongoose.Schema;

var RoleSchema = new Schema({
    
    name: {type: String, unique: true,required:true},                    //
});

module.exports = mongoose.model('Role', RoleSchema);