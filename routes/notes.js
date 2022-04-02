const express=require('express');
//creating an router for our routes
const router=express.Router();
const { body, validationResult } = require('express-validator');
//importing the notes model
const Note=require('../models/notes');


//importing the fetchuser middleware
const fetchuser=require('../middleware/fetchuser');

//Route 1:creating a route for fetching all the notes of a user loged in required
router.post('/addnote',fetchuser,[
    body('title').not().isEmpty().withMessage('Title is required'),
    body('description').not().isEmpty().withMessage('Description is required'),
],async(req,res)=>{

    try {
        //Inserting the note into the datbase with user id the

        const user=req.user;
        //detsructuring the req.body
        const {title,description,tag}=req.body;


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        note=await Note.create({
            title,
            description,
            tag,
            userId:user.id
        }).then(note=>{res.json(note)}).catch(err=>{
            return res.status(400).json({error:err.message})
        });
        

    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Something went wrong"});    
    }
    
});

//Route 2 create an route for getting the notes of single user logged in required
router.get('/getnotes',fetchuser,async(req,res)=>{
    try {
        const user=req.user;
        const notes=await Note.find({userId:user.id});
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Something went wrong"});    
    }
});

//creat an route for updating the note of a single user
router.put('/updatenote/:id',fetchuser,async(req,res)=>{    
    try {
        const user=req.user;
        const {title,description,tag}=req.body;
        let notes={};
        if(!title){res.status(400).json({error:"Title is required"});}
        if(!description){res.status(400).json({error:"Description is required"});}
        if(!tag){res.status(400).json({error:"Tag is required"});}
        notes={title,description,tag};

        //check whether the note exists or not
        const noteFounded=await Note.findById(req.params.id);
        if(!noteFounded){res.status(400).json({error:"Note not found"});}

        //check whether the note belongs to the user or not
        if(noteFounded.userId.toString()!==user.id){res.status(401).json({error:"Unauthorized"});}

        //update the note
        const note=await Note.findByIdAndUpdate(req.params.id,{$set:notes},{new:true});
        res.json({message:"Note updated successfully",note});
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Something went wrong"});    
    }
}   );  


//create an route for deleting the note of a single user
router.delete('/deletenote/:id',fetchuser,async(req,res)=>{

    try {
        const user=req.user;

        const note=await Note.findById(req.params.id);
        if(!note){res.status(400).json({error:"Note not found"});}

        //check whether the note belongs to the user or not
        if(note.userId.toString()!==user.id){res.status(401).json({error:"Unauthorized"});}
        
        await Note.findByIdAndDelete(req.params.id);
        res.json({message:"Note deleted successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Something went wrong"});    
    }
})
module.exports=router;

