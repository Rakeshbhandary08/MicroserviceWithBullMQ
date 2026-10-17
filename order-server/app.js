const express=require('express');
require('dotenv').config();

const {Queue, QueueEvents}=require('bullmq')

const app=express();

app.use(express.json())
let port=process.env.PORT || 4800

let connection={ host: 'localhost', port: 6379 };

//Queue Setup
const verifyUser=new Queue('user-verification-queue',{connection})
const verificationQueueEvents=new QueueEvents('user-verification-queue',{connection})

const mailQueue=new Queue('mail-queue',{connection})

//Function that tell whether a particular jobs get failed or completed
const checkUserVerification=(jobId)=>{
   return new Promise((resolve,reject)=>{
      //when job gets completed
      verificationQueueEvents.on('completed',({jobId:completedJobId,returnvalue})=>{
         if(completedJobId === jobId){
            const {isValidUser,rest}=returnvalue;
            resolve({isValidUser,rest})
         }
      })

      //when jobs get failed
      verificationQueueEvents.on('failed',({jobId:failedJobId,failedReason})=>{
          if(failedJobId === jobId){
            reject(failedReason)
          }
      })
   })
}

app.post('/order',async (req,res)=>{

    try {
        const {orderId,productName,price,userId}=req.body;
        
        //Created a job
        const job=await verifyUser.add('Verify User',{userId})

        let {isValidUser,rest}=await checkUserVerification(job.id);

        //ISvaidUser can be completed or failed
        if(!isValidUser){
            return res.send({message:"User is not valid"})
        }

        //SAVE THE ORDER TO DATABASE

        //sending mail to the user
        const mailJob=await mailQueue.add('Send mail',{
            from:'rkbColors@gmail.com',
            to:rest.email,
            subject:"Thank you for you time",
            body:"successfully placed the order"
        })

        return res.send({message:"User is valid",mailJob:mailJob.id,rest})

    } catch (error) {
        console.log(err)
    }



    
})

app.listen(port,()=>console.log(`Order server started at port ${port}`))