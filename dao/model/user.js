/**
 * 用户信息
 */
var mongoose = require('../db.js'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type: String, unique: true},                    //用户账号
    password: {type: String, unique: true},                       //密码
    age: {type: Number, default: 0}
});

module.exports = mongoose.model('User', UserSchema);