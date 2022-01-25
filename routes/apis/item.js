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
    
    if(complete_address != null){
        
        Item.find({$and: [ {item_name:{ $regex:item_name, $options:'i' }},{place_item_found:{ $regex:place_item_found, $options:'i' }},{complete_address:{ $regex:complete_address, $options:'i' }},{item_color:{ $regex:item_color, $options:'i' }} ]})
    .then(item=>{
        if(item != ''){
            res.json({
                "items":item,
                "msg":"ItemFound"
            })
        }else{
            res.json({
                "msg":"ItemNotFound"
            })
        }
        
    })
    }else{
        Item.find({$and: [ {item_name:{ $regex:item_name, $options:'i' }},{place_item_found:{ $regex:place_item_found, $options:'i' }},{item_color:{ $regex:item_color, $options:'i' }} ]})
    .then(item=>{
        if(item != ''){
            res.json({
                "items":item,
                "msg":"ItemFound"
            })
        }else{
            res.json({
                "msg":"ItemNotFound"
            })
        }
    })

}
})

router.get("/search_item_by_keywords",(req,res)=>{
    const keywords = req.query.keywords

    Item.find({keywords : {$regex: keywords,$options:'i'}})
    .then(item=>{
        if(item != ''){
            res.send({
                "items":item,
                 "msg":"ItemFound"
            })
        }else{
            res.send({
                "msg":"ItemNotFound"
            })
        }
        
    })
})


router.post('/add_item',(req,res)=>{
    console.log("Item Added")
    const {item_name,mobile_no,place_item_found,item_color,keywords,complete_address,added_by_id} = req.body

    const file = req.files.item_picture
    const filename=file.name
    console.log(filename)
    file.mv('public/uploads/'+filename,function(err){
        if(err){
            res.send(err)
        }
    })

    const item = new Item({
        "item_name":item_name,
        "item_color":item_color,
        "item_picture":filename,
        "place_item_found":place_item_found,
        "complete_address":complete_address,
        "keywords":keywords,
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