const mongoose=require('mongoose')


const bookSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    dateOfPublish:{
        type:Date,
        default:Date.now()
    },
    price:{
        type:Number,
    },
    ISBN:{
        type:String,
        required:true
    },
    Status:{
        type:String,
        enum:['Want to Read','Reading','Completed'],
        default:'Want to Read'
    }
})

module.exports=mongoose.model('Book',bookSchema)