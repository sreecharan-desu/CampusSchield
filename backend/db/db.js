import mongoose from 'mongoose';
import {v4 as uuidv4} from 'uuid';

export const connectDB = async () => {
    try {
        console.log("Connecting to database . . .");
        await mongoose.connect('mongodb+srv://srecharandesu:charan%402006@cluster0.a9berin.mongodb.net/CampusScheild');
        console.log("Connected to database successfully . . .");
    } catch (error) {
        console.error("Error connecting to the database:", error.message);
        process.exit(1); // Exit process with failure
    }
};

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    studentId: String,
    department: String,
});


const ReportsSchema = mongoose.Schema({
    userId: String,
    coordinates: {
        latitude: { type: Number, required: false },
        longitude: { type: Number, required: false },
        type : Object,
        required : false
    },   
    description : String,
    location : String,
    content : String,
    type : String  ,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const AdminSchema = mongoose.Schema({
    adminId: String,
    name: String,
    email: String,
    role: {
        type: String,
        enum: ['superadmin', 'admin'],
        default: 'admin',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const User = mongoose.model("User",UserSchema);
export const Reports = mongoose.model("Reports",ReportsSchema);
export const Admin = mongoose.model("Admin",AdminSchema);

