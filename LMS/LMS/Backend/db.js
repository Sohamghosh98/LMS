import mongoose from 'mongoose';

const uri = "mongodb://localhost:27017/signup";

const connectToMongo = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Conection successful");
    } catch (error) {
        console.error("Error: " + error);
    }
}

export default connectToMongo;