const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemsSchema = new Schema({
    item_name:{
        type:String,
       
    },
    item_color:{
        type:String,
    },
    item_picture:{
        type:String
    },
    place_item_found:{
        type:String
    },
    complete_address:{
        type:String
    },
    keywords:{
        type:String
    },
    mobile_no:{
        type:String
    },
    user_id:{
        type:String
    }




}) 


const Items = mongoose.model('Items',ItemsSchema)
module.exports = Items