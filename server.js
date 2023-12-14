const express = require('express');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const bodyParser = require('body-parser');
const reminders=require('./model/reminders')
const  mongoose=require('mongoose')

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));   
mongoose.connect( 'mongodb+srv://ragulNolan:%23Ragul4444@cluster0.6qh9t.mongodb.net/mailReminder?retryWrites=true&w=majority',{useNewUrlParser: true,useUnifiedTopology: true})
    .then((res)=>{
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
          });
  
    console.log("success db connected")})
    .catch((err)=>{console.log(err)})

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shaliniauroville@gmail.com',
    pass: 'xnwi ymes kloc qsfq'
  }
});

app.post('/schedule-email', async(req, res) => {
  const { to, subject, text, date_time, time_zone_id } = req.body;
  console.log(to, subject, text, date_time, time_zone_id)

  if (!date_time || !date_time.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
    return res.status(400).send('Invalid date_time format or missing date_time');
  }

//   const [year, month, day, hour, minute] = date_time.split(/[-T:]/);
//   const cronSyntax = `${minute} ${hour} ${day} ${month} *`; // Use '*' for the day of the month

  console.log('Received Parameters:', { to, subject, text, date_time, time_zone_id });

  //storing to db 
  try{
    const data=await new reminders({
        to, subject, text, date_time, time_zone_id,isNotify:false
    })
    const result =await data.save()
    return res.send('Email scheduled successfully');

  }
  catch(error){
    console.log(error)
    return res.status(400).send('retry again');

  }

});


cron.schedule('* * * * *', async() => {
    
console.log('in cron job')
  // to get all records 
  const remindersData=await reminders.find({'isNotify':false})
  console.log(remindersData)

  for(let i =0;i<remindersData.length;i++)
  {
    //conveting into date format 
    let givenDate=new Date(remindersData[i].date_time).toLocaleString("en-US", {timeZone: 'Asia/Calcutta'})

    let currentTime=new Date().toLocaleString("en-US", {timeZone: 'Asia/Calcutta'})
    console.log(givenDate,currentTime)
    if(givenDate<=currentTime){

      const mailOptions = {
        from: 'shaliniauroville@gmail.com',
        to:remindersData[i].to,
        subject:remindersData[i].subject,
        text:remindersData[i].text
      };

      transporter.sendMail(mailOptions, async(error, info) => {
        if (error) {
          return console.error('Error sending email:', error);
        }
        // console.log(remindersData[i]. _id)
        const updateReminder=await reminders.findOneAndUpdate({_id:remindersData[i]. _id}, {isNotify:true})
        console.log('Email sent:', info.response);


      });
      }

      }
    
  });




