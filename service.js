const Datastore = require('nedb-promises')
const axios = require('axios')
let db,instance
module.exports = {
    init:async()=>{
        db = Datastore.create({ filename: './website.db', autoload: true })
        instance = axios.create()
        instance.defaults.timeout = 800
    },
    add:async(req,res)=>{
        var valid=req.body.name&&req.body.name.trim().startsWith("https://")||req.body.name.trim().startsWith("http://")
        if(!valid){
            res.status(500).json({
                success:false,
                reason:"url invalid"
            })
            return
        }
        let document={
            name:req.body.name,
            dateCreated:Date.now(),
            lastChecked:Date.now(),
            lastHealth:'Good',
        }
        try{
            let isExists=await db.find({name:document.name})
            if(isExists.length>0)throw ({message:"Already on the list"})
            let newDoc=await db.insert(document)
            res.status(200).json({
                success:true,
                data:newDoc
            })
        }
        catch(err){
            res.status(500).json({
                success:false,
                reason:err.message
            })
        }
    },
    removeAll:async(req,res)=>{
        try{
            let remDoc=await db.remove({})
            res.status(200).json({
                success:true,
                data:remDoc
            })
        }
        catch(err){
            console.log(err)
            res.status(500).json({
                success:false,
                reason:err.message
            })
        }
    },
    getAll:async(req,res)=>{
        try{
            let allSites=await db.find({})
            res.status(200).json({
                success:true,
                data:allSites
            })
        }
        catch(err){
            res.status(500).json({
                success:false,
                reason:err.message
            })
        }
    },
    checkHealth:async(req,res)=>{
        let allSites=await db.find({})
        allSites.map(async site=>{
            try{
                let check=await instance.get(site.name)
                let success=check.status<400
                await db.update({ name:site.name}, { $set: { 
                    lastChecked:Date.now(),
                    lastHealth:'Good',
                    reason:"Ping Success"
                } 
                },{ upsert: true })
            }
            catch(e){
                await db.update({ name:site.name}, { $set: { 
                    lastChecked:Date.now(),
                    lastHealth:'Bad',
                    reason:e.message
                } 
                }, { upsert: true })
            }
        })
    },
}