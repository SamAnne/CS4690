import mongoose from 'mongoose';

// Log schema
const logSchema = new mongoose.Schema({
    Id:       { type: String },
    courseId: { type: String, required: true },
    uvuId:    { type: String, required: true },
    date:     { type: String, required: true },
    text:     { type: String, required: true }
});

// Course schema
const courseSchema = new mongoose.Schema({
    Id:      { type: String, required: true },
    display: { type: String, required: true }
});

const LogModel     = mongoose.model('log', logSchema);
const CourseModel  = mongoose.model('course', courseSchema);

export { LogModel, CourseModel };