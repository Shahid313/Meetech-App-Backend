const router = require('express').Router();
var nodemailer = require('nodemailer');
require('dotenv').config();

let Users = require('../../models/Users')

const bcrypt = require('bcrypt');        
const saltRounds = 10;

function send_mail(email,code){
  
 
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });



  var mailOptions = {
    from: 'xyz.com',
    to: email,
    subject: 'Meetech Verification Code',
    text: 'Your Verification Code is : ' + code
  };


  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
     
      console.log(error);
    } else {
      
      console.log('Email sent: ' + info.response);
    }
  });
}


router.post('/signup',(req,res)=>{
  let hash_password;
  let fullName = req.body.fullName
  let email = req.body.email
  let dateOfBirth = req.body.dateOfBirth
  let password = req.body.password
  console.log(req.body)
  bcrypt.hash(password,saltRounds,(err,hash)=>{
    hash_password = hash
  })
  try{
    
     Users.findOne({email:email})
    .then(result=>{
      if(result != null){

        return res.send({
          "msg":"User Already Exist"
        })


      }else{
       
        const user = new Users({
          "fullName":fullName,
          "email":email,
          "dateOfBirth":dateOfBirth,
          "password":hash_password
        });

         user.save();
        console.log("signed Up")
        return res.send({
          "msg":"User Registered Successfully"
        })

      }

    })
    
  }
  catch(err){
    return res.status(422).send(err.message)
  }
  


})


router.post('/signin',(req,res)=>{
  const {email,password} = req.body
   Users.findOne({email:email})
   .then(user=>{
    if(user != null){
      bcrypt.compare(password, user.password, function(error, response) {
        console.log(response)
       if(response == true){
         res.send({
           "user":user,
           "msg":"logged in Succesfully"
         })
       }else{
         res.send({
           "msg":"Incorrect email or password"
         })
       }
    });
    }else{
     res.send({
       "msg":"Incorrect email or password"
     })
   }


   })
  })


  router.post('/login_with_google',(req,res)=>{
    let email = req.body.email
    Users.findOne({email:email})
    .then(user=>{
      if(user != null){
        return res.send({
          "user":user,
           "msg":"logged in Succesfully"
        })
      }else{
        return res.send({
          
           "msg":"Incorrect Email"
        })
      }
    })
  })

  router.get("/forgot_password",(req,res)=>{
    var random_digits = Math.floor(1000 + Math.random() * 9000);
    const email = req.query.email
    Users.findOne({email:email})
    .then(user_res=>{
      if(user_res != null){
        send_mail(user_res.email,random_digits)

        res.send({
          "msg":"Verification Code Sent",
          "user_id":user_res._id,
          "otp":random_digits
      })
      }else{
        res.send({
          "msg":"user does not exist"
        })
      }
        
    })
})

router.post("/create_new_password", async (req, res) => {
  const user_id = req.body.user_id
  let password = req.body.password

  bcrypt.hash(password, saltRounds, async (err, hash) => {
    let filter = { _id: user_id };
    let updateDoc = {
      $set: {
       
       password:hash,
      
      
      },
    };

    await Users.updateMany(filter,updateDoc)
    Users.findById(user_id)
    .then(result=>{
     
       res.send({
         "msg":"Password Updated"
       })
    })

  })
  
})
module.exports = router;
