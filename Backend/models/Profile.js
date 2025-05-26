import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: { type: String },  // Will be populated from User model
    email: { type: String },     // Will be populated from User model
    role: { type: String },      // Will be populated from User model
    bio: { type: String, default: "" },
    skills: [{ type: String }],
    education: [
        {
            institution: String,
            degree: String,
            field: String,
            from: Date,
            to: Date,
            current: Boolean,
            description: String
        }
    ],
    social: {
        linkedin: { type: String, default: "" },
        github: { type: String, default: "" },
        twitter: { type: String, default: "" }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to populate user data before saving
ProfileSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const user = await mongoose.model('User').findById(this.user);
            if (user) {
                this.username = user.name;
                this.email = user.email;
                this.role = user.role;
            }
        } catch (err) {
            return next(err);
        }
    }
    next();
});

const Profile = mongoose.model("Profile", ProfileSchema);
export default Profile;
