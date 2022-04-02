const mongoose=require('mongoose');
const { Schema } = mongoose;


const NotesSchema=new Schema({
    title:{
        type:String,
        required:true
    },description:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    tag:{
        type:String,
        default:"general"
    },date:{
        type:Date,
        default:Date.now
    }
})


module.exports=mongoose.model("notes",NotesSchema);