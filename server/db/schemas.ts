import mongoose from 'mongoose';

// Log schema
const logSchema = new mongoose.Schema({
    Id:       { type: String },
    courseId: { type: String, required: true },
    uvuId:    { type: String, required: true },
    date:     { type: String, required: true },
    text:     { type: String, required: true },
    school:   { type: String, required: true }
});

// Course schema
const courseSchema = new mongoose.Schema({
    Id:      { type: String, required: true },
    display: { type: String, required: true },
    school:  { type: String, required: true }
});

// User schema
const userSchema = new mongoose.Schema({
    Id:             { type: String, required: true},
    Username:       { type: String, required: true},
    PasswordHash:   { type: String, required: true},
    GoogleId:       { type: String },
    Email:          { type: String, required: true },
    Role:           { type: String, required: true},
    School:         { type: String, required: true},
    Courses:        { type: [String], required: true},
    CoursesTA:      { type: [String], required: true}
});

const LogModel     = mongoose.model('log', logSchema);
const CourseModel  = mongoose.model('course', courseSchema);
const UserModel    = mongoose.model('user', userSchema);

export { LogModel, CourseModel, UserModel};