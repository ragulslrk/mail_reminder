const  mongoose=require('mongoose')
const reminder_schema=mongoose.Schema({
    to:{
        type:String,
        required:false
    },
    subject:{
        type:String,
        required:false
    },
    text:{
        type:String,
        required:false
    },
    date_time:{
        type:String,
        required:false

    },
    time_zone_id:{
        type:String,
        required:false

    },
    isNotify:{
        type:Boolean,
        dafault:false
    }
},{versionKey:false})


const  reminder_model=mongoose.model('reminders',reminder_schema)
module.exports=reminder_model