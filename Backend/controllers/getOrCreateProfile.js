import Profile from '../models/Profile.js';
import User from '../models/User.js';

// Get or Create Profile
export const getOrCreateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have auth middleware

        let profile = await Profile.findOne({ user: userId }).populate('user', 'name email role');

        if (!profile) {
            // Create new profile if doesn't exist
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            profile = new Profile({
                user: userId,
                username: user.name,
                email: user.email,
                role: user.role
            });

            await profile.save();
        }

        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Update Profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bio, skills, education, social } = req.body;

        let profile = await Profile.findOne({ user: userId });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Update fields
        if (bio) profile.bio = bio;
        if (skills) profile.skills = skills;
        if (education) profile.education = education;
        if (social) profile.social = social;

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};