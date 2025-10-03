import express from "express";

// This will help us connect to the database
import Student from "../models/studentModel.js";


// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /students.
const router = express.Router();

/**
 * GET /students
 * List all students
 */
router.get("/", async (_req, res) => {
  try {
    // .lean() returns plain JS objects (lighter than Mongoose docs)
    const results = await Student.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json(results);
  } catch (err) {
    console.error("GET /students error:", err);
    return res.status(500).json({ error: "server_error" });
  }
});

/**
 * GET /students/:id
 * Get a single student by id
 */
router.get("/:id", async (req, res) => {
  try {
    const doc = await Student.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: "not_found" });
    return res.status(200).json(doc);
  } catch (err) {
    console.error(`GET /students/${req.params.id} error:`, err);
    // CastError happens when :id is not a valid ObjectId string
    return res.status(400).json({ error: "invalid_id" });
  }
});

/**
 * POST /students
 * Create a new student
 */
router.post("/", async (req, res) => {
  try {
    const { name, position, level } = req.body || {};
    const created = await Student.create({ name, position, level });
    // created is a Mongoose doc; toJSON will apply any schema transforms you defined
    return res.status(201).json(created);
  } catch (err) {
    console.error("POST /students error:", err);
    // Handle validation/unique errors nicely
    if (err?.name === "ValidationError") {
      return res.status(400).json({ error: "validation_error", details: err.message });
    }
    if (err?.code === 11000) {
      return res.status(409).json({ error: "duplicate_key", fields: err.keyValue });
    }
    return res.status(500).json({ error: "server_error" });
  }
});

/**
 * PATCH /students/:id
 * Update partial fields of a student
 */
router.patch("/:id", async (req, res) => {
  try {
    const { name, position, level } = req.body || {};
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: { ...(name !== undefined && { name }), ...(position !== undefined && { position }), ...(level !== undefined && { level }) } },
      { new: true, runValidators: true } // return the updated doc, enforce schema validators
    ).lean();

    if (!updated) return res.status(404).json({ error: "not_found" });
    return res.status(200).json(updated);
  } catch (err) {
    console.error(`PATCH /students/${req.params.id} error:`, err);
    if (err?.name === "CastError") return res.status(400).json({ error: "invalid_id" });
    if (err?.name === "ValidationError") {
      return res.status(400).json({ error: "validation_error", details: err.message });
    }
    if (err?.code === 11000) {
      return res.status(409).json({ error: "duplicate_key", fields: err.keyValue });
    }
    return res.status(500).json({ error: "server_error" });
  }
});

/**
 * DELETE /students/:id
 * Delete a student
 */
router.delete("/:id", async (req, res) => {
  try {
    const del = await Student.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ error: "not_found" });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(`DELETE /students/${req.params.id} error:`, err);
    if (err?.name === "CastError") return res.status(400).json({ error: "invalid_id" });
    return res.status(500).json({ error: "server_error" });
  }
});

export default router;

// THIS USES MONGODB AND NOT MONGOOSE
// // This section will help you get a list of all the studentss.
// router.get("/", async (req, res) => {
//   let collection = await db.collection("students");
//   let results = await collection.find({}).toArray();
//   res.send(results).status(200);
// });

// // This section will help you get a single students by id
// router.get("/:id", async (req, res) => {
//   let collection = await db.collection("students");
//   let query = { _id: new ObjectId(req.params.id) };
//   let result = await collection.findOne(query);

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });

// // This section will help you create a new students.
// router.post("/", async (req, res) => {
//   try {
//     let newDocument = {
//       name: req.body.name,
//       position: req.body.position,
//       level: req.body.level,
//     };
//     let collection = await db.collection("students");
//     let result = await collection.insertOne(newDocument);
//     res.send(result).status(204);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error adding students");
//   }
// });

// // This section will help you update a students by id.
// router.patch("/:id", async (req, res) => {
//   try {
//     const query = { _id: new ObjectId(req.params.id) };
//     const updates = {
//       $set: {
//         name: req.body.name,
//         position: req.body.position,
//         level: req.body.level,
//       },
//     };

//     let collection = await db.collection("students");
//     let result = await collection.updateOne(query, updates);
//     res.send(result).status(200);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error updating students");
//   }
// });

// // This section will help you delete a students
// router.delete("/:id", async (req, res) => {
//   try {
//     const query = { _id: new ObjectId(req.params.id) };

//     const collection = db.collection("students");
//     let result = await collection.deleteOne(query);

//     res.send(result).status(200);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error deleting students");
//   }
// });

// export default router;