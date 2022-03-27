const mongoose=require('mongoose');

const url="mongodb://localhost:27017/inotebook?readPreference=primary&appname=MongoDB%20Compass&ssl=false";


const mongooseConnection=()=>{

    mongoose.connect(url,()=>{
        console.log("Database has been connected succesfully")
    })
}


module.exports=mongooseConnection;