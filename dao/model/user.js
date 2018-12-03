/**
 * 用户信息
 */
var mongoose = require('../db.js'),
    Schema = mongoose.Schema;
const dateutils=require('../../assets/dateutils')


var UserSchema = new Schema({
    username: {type: String, unique: true},                    //用户账号
    password: {type: String, required: true},                       //密码
    department: {type: String, required:true},
    registerDate: {type: Date, default:dateutils.plusHours(new Date(),8)}
});

module.exports = mongoose.model('User', UserSchema);