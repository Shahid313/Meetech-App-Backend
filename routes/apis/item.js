const fs = require('fs')
const router = require('express').Router()


let Item = require('../../models/Item')

router.get('/get_all_items',(req,res)=>{
    Item.find()
    .then(i=>{
        res.json({"items":i})
    })
    
})


router.get("/search_item",(req,res)=>{
    const {item_name,place_item_found,item_color,complete_address} = req.query
    var lowerCase_item_name = item_name.toLowerCase()
    var lowerCase_place_item_found = place_item_found.toLowerCase()
    var lowerCase_item_color = item_color.toLowerCase()
    if(complete_address != null){
        var lowerCase_complete_address = complete_address.toLowerCase()
        Item.findOne({$or: [ { item_name:lowerCase_item_name },{place_item_found:lowerCase_place_item_found},{complete_address:lowerCase_complete_address},{item_color:lowerCase_item_color} ]})
    .then(item=>{
        res.json({
            "items":item
        })
    })
    }else{
        Item.findOne({$or: [ { item_name:lowerCase_item_name },{place_item_found:lowerCase_place_item_found},{item_color:lowerCase_item_color} ]})
    .then(item=>{
        res.json({
            "items":item
        })
    })
    }
})

router.get("/search_item_by_keywords",(req,res)=>{
    const keywords = req.query.keywords

    var lowecase_keywords = keywords.toLowerCase()

    var keywords_regex = new RegExp(lowecase_keywords,'i')
   
    

    Item.findOne({keywords:keywords_regex})
    .then(item=>{
        res.json({
            "items":item
        })
    })
})


router.post('/add_item',(req,res)=>{
    console.log("Item Added")
    const {item_name,mobile_no,place_item_found,item_color,keywords,complete_address,added_by_id} = req.body
    var lowerCase_item_name = item_name.toLowerCase()
    var lowerCase_place_item_found = place_item_found.toLowerCase()
    var lowerCase_item_color = item_color.toLowerCase()
    var lowerCase_complete_address = complete_address.toLowerCase()
    var lowerCase_keywords = keywords.toLowerCase()
    const file = req.files.item_picture
    const filename=file.name
    console.log(filename)
    file.mv('public/uploads/'+filename,function(err){
        if(err){
            res.send(err)
        }
    })

    const item = new Item({
        "item_name":lowerCase_item_name,
        "item_color":lowerCase_item_color,
        "item_picture":filename,
        "place_item_found":lowerCase_place_item_found,
        "complete_address":lowerCase_complete_address,
        "keywords":lowerCase_keywords,
        "mobile_no":mobile_no,
        "user_id":added_by_id
    })
    item.save()
    return res.send({
        "msg":"Item Added Successfully"
    })


})


router.get('/view_item',(req,res)=>{
    const item_id = req.body.item_id
    Item.findById(item_id)
    .then(item=>{
        res.json({
            "item":item
        })
    })
})

router.get('/view_items_by_user_id',(req,res)=>{
    const _id = req.query.id
    Item.find({"user_id":_id})
    .then(item=>{
        res.json({
            "item":item
        })
    })
})

router.get('/view_item_details_by_item_id',(req,res)=>{
    const item_id = req.query.item_id
    Item.find({"_id":item_id})
    .then(item=>{
        res.json({
            "item":item
        })
    })
})

router.get('/delete_item',(req,res)=>{
    const item_id = req.query.item_id
    Item.findByIdAndDelete(item_id, () => {
            return res.send({
                "msg":"Deleted"
            })
    })
    
})


router.post('/update_item',(req,res)=>{
    const {keywords,item_name,mobile_no,place_item_found,item_color,complete_address,item_id} = req.body
    if(req.files){
        Item.findById(item_id)
        .then(async(item)=>{
            fs.unlink('public/uploads/'+item.item_picture,function(result){
                console.log(result)
            })


            file = req.files.item_picture
            filename=file.name
            file.mv('public/uploads/'+filename,function(err){
              if(err){
                  res.send(err)
              }
            })

            let filter = { _id: item_id };
            let updateDoc = {
                $set: {
                    "item_name":item_name,
                    "keywords":keywords,
                    "place_item_found":place_item_found,
                    "mobile_no":mobile_no,
                    "item_color":item_color,
                    "complete_address":complete_address,
                    "item_picture":filename

                }

            }

            await Item.updateMany(filter,updateDoc)
            return res.send({
                "msg":"Item Updated Successfully"
            })
        })
    }else{
        Item.findById(item_id)
        .then(async(item)=>{
           

            let filter = { _id: item_id };
            let updateDoc = {
                $set: {
                    "item_name":item_name,
                    "keywords":keywords,
                    "place_item_found":place_item_found,
                    "mobile_no":mobile_no,
                    "item_color":item_color,
                    "complete_address":complete_address,
                   

                }

            }

            await Item.updateMany(filter,updateDoc)
            return res.send({
                "msg":"Item Updated Successfully"
            })
        })
    }
})



module.exports = router