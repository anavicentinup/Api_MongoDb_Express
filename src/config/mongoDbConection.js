import { connect } from "mongoose"
import { configDotenv } from 'dotenv';
configDotenv()  

//conecxion a la base de datos
const conectionDb = async () => {
    try {
     console.log("intentando conectar...")
        await connect(process.env.URI_MONGO_DB)
        console.log("esta conectado a mongoDB 👽")
    }
    catch (error) {
        console.log("😩 error al conectarse con mongo db", error.message)
    }
}

export { conectionDb }