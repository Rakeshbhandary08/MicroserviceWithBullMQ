const express=require('express');
const {Queue,Worker}=require('bullmq')

const app=express();
let port=5002
app.use(express.json());
let connection={host:'localhost',port:6379}

//Create a function that send the mail
const sendMail=async ({from,to,subject,body})=>{
   console.log(`Mail is send successfully to ${to}`)
}

const mailWorker=new Worker("mail-queue",async (job)=>{
     const {from,to,subject,body}=job.data;
     const sendMailToUser=await sendMail({from,to,subject,body})
},{connection})



app.listen(port,()=>{
    console.log(`server is running in on ${port}`)
})