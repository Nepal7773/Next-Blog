import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};

async function dbConnect() {
    if (connection.isConnected) {
        console.log("DB connection already exists");
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "");
        console.log("Database logs") //
        // console.log(db) // 
        console.log(`Connected to MongoDB : ${db.connection.host}`) //
        connection.isConnected = db.connections[0].readyState;
        console.log(connection.isConnected) //
        console.log("Db connected Successfully")
    } catch (error) {
        console.log("Db connection Failed")
        console.log("Error :", error)
        process.exit(1);
    }
}

export default dbConnect;