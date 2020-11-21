const mongoose = require('mongoose');
const dbConection= async()=>{
    try{
      await  mongoose.connect(process.env.DB_CNn, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('DB en linea');

    }catch(error){
        console.log(error);
        throw new Error('Error ala hora de inicializar DB');
    }
}
module.exports={
    dbConection
}