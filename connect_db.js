const mongoose = require('mongoose')
 function connect (){
    const uri = 'mongodb+srv://Shahid:Games587@cluster0.mekpz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    try{
         mongoose.connect(uri,{ useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true })
        const connection = mongoose.connection;
        connection.once('open', () => {
        console.log("MongoDB database connection established successfully");
        })
    }catch(e){
        console.log(e)
    }
}

module.exports = connect