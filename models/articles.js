/**
 * Created by dell on 2017/6/26.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var articlesSchema = new Schema({
    menu: String,
    type: String,
    contain: [
        {
            title: String,
            author: String,
            content: String
        }
    ]
});

module.exports = articlesSchema;
