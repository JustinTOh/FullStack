import mongoose from "mongoose";

export async function connectMongoose(uri) {
  if (mongoose.connection.readyState === 1) return; // already connected

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri, { autoIndex: true });
    console.log("Connected to MongoDB with Mongoose");
  } catch (err) {
    console.error("Mongo connection failed:", err.message);
    throw err; // rethrow so server.js knows startup failed
  }
}


// import { MongoClient, ServerApiVersion } from "mongodb";

// const uri = process.env.ATLAS_URI || "";
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// try {
//   // Connect the client to the server
//   await client.connect();
//   // Send a ping to confirm a successful connection
//   await client.db("admin").command({ ping: 1 });
//   console.log(
//    "Pinged your deployment. You successfully connected to MongoDB!"
//   );
// } catch(err) {
//   console.error(err);
// }

// let db = client.db("users");

// export default db;