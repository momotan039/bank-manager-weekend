const express=require('express')
const router=express.Router()
const { ObjectId } = require('mongodb');

router.get('/', async(req,res)=>{
    const users=await req.database.collection('users').find().toArray()
    res.send(users)
})

router.delete('/delete/:id', (req,res)=>{
const id=req.params.id
req.database.collection('users').deleteOne({_id:new ObjectId(id)}).then(()=>{
    res.send('user removed Sucessfully')
 }).catch(err=>{
    res.status(400).send({
        msg:err+''
    })
 })
})

router.post('/add',async(req,res)=>{
    const user=await req.database.collection('users').findOne({
        passportId:req.body.passportId
    })
    if(user)
    {
        res.send({
            msg:'This User Already Exits!!'
        })
        return
    }
     req.database.collection('users').insertOne(req.body).then(() => {
        res.send('user added Sucessfully')
     }).catch((err) => {
        res.status(400).send({
            msg:err+''
        })
     });
})

module.exports=router
