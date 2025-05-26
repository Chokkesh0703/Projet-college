import express from "express";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js"; // You'll need to create this

const profilerouter = express.Router();

// Middleware to protect routes
profilerouter.use(authMiddleware);

// @route   GET /api/me/profile
// @desc    Get current user's profile
// @access  Private
profilerouter.get('/profile', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'email', 'role']);
        
        if (!profile) {
            return res.status(404).json({ msg: 'Profile not found' });
        }
        
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/me/profile
// @desc    Create or update user profile
// @access  Private
profilerouter.post('/profile', async (req, res) => {
    const {
        bio,
        skills,
        linkedin,
        github,
        twitter,
        education
    } = req.body;

    // Build profile object
    const profileFields = {
        user: req.user.id,
        bio,
        skills: Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim()),
        social: { linkedin, github, twitter },
        education
    };

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            // Update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }

        // Create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/me/profile/education
// @desc    Add profile education
// @access  Private
profilerouter.put('/profile/education', async (req, res) => {
    const {
        institution,
        degree,
        field,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        institution,
        degree,
        field,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ msg: 'Profile not found' });
        }

        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/me/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
profilerouter.delete('/profile/education/:edu_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ msg: 'Profile not found' });
        }

        // Get remove index
        const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);

        if (removeIndex === -1) {
            return res.status(404).json({ msg: 'Education not found' });
        }

        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/me/profile
// @desc    Delete profile and user
// @access  Private
profilerouter.delete('/profile', async (req, res) => {
    try {
        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // Remove user
        await User.findOneAndRemove({ _id: req.user.id });
        
        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default profilerouter;

