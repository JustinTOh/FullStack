import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true },
    position: { type: String, required: false, trim: true },
    level: { type: String, required: true, trime: true},
  },
  { timestamps: true }
);

// Optional: cleaner JSON payloads
StudentSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// mongoose makes it all lowercase and pluralizes the word for the collection
export default mongoose.model("Student", StudentSchema);
