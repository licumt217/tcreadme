/**
 * 用户信息
 */
var mongoose = require('../db.js'),
    Schema = mongoose.Schema;
const dateutils=require('../../assets/dateutils')


var ResourceSchema = new Schema({
    name: {type: String, unique: true,required:true},                    //
    url: {type: String, unique:true,required: true},                       //
    state: {type: Number, required:true,default:0} ,     //状态，默认0，启用；1：禁用；
    code:{type: String,required:true,unique:true},
    parentCode:{type: String,required:true,default:"0000"}
});

module.exports = mongoose.model('Resource', ResourceSchema);