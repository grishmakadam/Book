const express=require('express')
const router=express.Router()
const User=require("../models/user")
const jwt=require('jsonwebtoken')
const requireAuth=require("../middleware/requireAuth")
const bcrypt=require('bcrypt')
const createToken=async(email)=>{
    return await jwt.sign({email},process.env.SECRET,{expiresIn:'1H'})
}


router.post('/signup',async(req,res)=>{    
   
    const {name,email,password}=req.body
    try{

    const user=await User.signup(name,email,password)
    
    const token=await createToken(email)
    res.json({name,email,token})
    }catch(e){
        res.status(400).json({error:e.message})
    }

})

router.post('/login',async(req,res)=>{
    const {email,password}=req.body

    try{
        const user=await User.login(email,password)
        const name=user.name
        const image=user.image
        const token=await createToken(email)
        res.json({name,email,token,image})
    }catch(e){
        res.status(400).json({error:e.message})
    }
})

router.patch('/profilepic',requireAuth,async(req,res)=>{
    req.user.image=req.body.image
    console.log(req.user.image)
    try{
    let resp=await req.user.save()
    const image=req.user.image
    res.json({image:image})
    }catch(e){
        res.status(500).json({error:e.message})
    }
    
})


router.get('/profilepic',requireAuth,async(req,res)=>{
try{
    const image=req.user.image
    res.json({image:image})
    
}catch(e){
    res.status(500).json({error:e.message})
}
})

router.post('/changepassword',requireAuth,async(req,res)=>{
    try{
        console.log(req.body)
        const {oldPassword,newPassword}=req.body
        
        const match=await bcrypt.compare(oldPassword,req.user.password)

        if(!match){
           return res.status(400).json({error:"Old Password is incorrect"})
        }
        console.log("second")
        const salt=await bcrypt.genSalt()
        
        const hash=await bcrypt.hash(newPassword,salt)
        req.user.password=hash
       
        let resp=await req.user.save()
       return res.json({message:"Password changed successfully!!!"})
    }catch(e){
        console.log("h:",e.message)
        res.status(500).json({error:e.message})
    }
})


module.exports=router