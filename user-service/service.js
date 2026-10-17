const {Queue,Worker}=require('bullmq');

let connection={host:'localhost',port:6379}

let userDB = [
  { id: 1,  name: 'Aarav Sharma', email: 'aarav.sharma@example.com' },
  { id: 2,  name: 'Priya Verma',  email: 'priya.verma@example.com' },
  { id: 3,  name: 'Rohan Mehta',  email: 'rohan.mehta@example.com' },
  { id: 10, name: 'Sneha Patel',  email: 'sneha.patel@example.com' },
  { id: 17, name: 'Kabir Singh',  email: 'kabir.singh@example.com' },
];

//worker will do its job
const verificationWorker=new Worker('user-verification-queue',
    (job)=>{const userId=job.data.userId 
        console.log(`Job receive with userId as ${userId}`)

        //Authenticate the user from DB
        const isValidUser=userDB.some((item)=>item.id === userId);
        console.log(`User valid ${isValidUser}`)

        const {...rest}=userDB[0]

        return {isValidUser,rest} //{"isValidUser:""true"}
    }
 ,{connection})