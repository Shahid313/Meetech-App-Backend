const mongoose = require('mongoose');

const Schema = mongoose.Schema;




const userSchema = new Schema({
  fullName:{
    type: String,
   
},
email: {
    type: String,
    unique: true,
    
},
dateOfBirth:{
    type: Date,
    
},
password:{
    type: String,
 
}

}, {
  timestamps: true,
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;