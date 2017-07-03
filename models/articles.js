/**
 * Created by dell on 2017/6/26.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var articlesSchema = new Schema({
    title: String,
    author: String,
    type: String,
    body: String,
    // comments: [{ body: String, date: Date }],
    created_at: { type: Date, default: Date.now }
    // hidden: Boolean,
    // meta: {
    //   votes: Number,
    //   favs: Number
    // }
}, {
  versionKey: false
});
// contain: [
//     {
//         title: String,
//         author: String,
//         content: String
//     }
// ]
module.exports = articlesSchema;
