import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileForm = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        bio: '',
        skills: '',
        linkedin: '',
        github: '',
        twitter: '',
        education: [{
            institution: '',
            degree: '',
            field: '',
            from: '',
            to: '',
            current: false,
            description: ''
        }]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = sessionStorage.getItem('userToken'); // Already using sessionStorage
                const res = await axios.get('http://localhost:8000/api/me/profile', {
                    headers: {
                        'x-auth-token': token,
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    }
                });

                if (res.data) {
                    // Format skills array to string for input
                    const formattedProfile = {
                        ...res.data,
                        skills: res.data.skills ? res.data.skills.join(', ') : ''
                    };
                    setProfile(formattedProfile);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEducationChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        const updatedEducation = [...profile.education];

        updatedEducation[index] = {
            ...updatedEducation[index],
            [name]: type === 'checkbox' ? checked : value
        };

        setProfile(prev => ({
            ...prev,
            education: updatedEducation
        }));
    };

    const addEducationField = () => {
        setProfile(prev => ({
            ...prev,
            education: [
                ...prev.education,
                {
                    institution: '',
                    degree: '',
                    field: '',
                    from: '',
                    to: '',
                    current: false,
                    description: ''
                }
            ]
        }));
    };

    const removeEducationField = (index) => {
        if (profile.education.length > 1) {
            const updatedEducation = [...profile.education];
            updatedEducation.splice(index, 1);
            setProfile(prev => ({
                ...prev,
                education: updatedEducation
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('userToken');
            // Convert skills string back to array
            const profileData = {
                ...profile,
                skills: profile.skills.split(',').map(skill => skill.trim())
            };

            await axios.post('http://localhost:8000/api/me/profile', profileData, {
                headers: {
                    'x-auth-token': token
                }
            });

            alert('Profile saved successfully!');
            navigate('/StudentHome'); // Or wherever you want to redirect
        } catch (err) {
            console.error('Error saving profile:', err);
            alert('Failed to save profile');
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading profile...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h1>

            <form onSubmit={handleSubmit}>
                {/* Bio Section */}
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="bio">
                        About You
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        placeholder="Tell us about yourself..."
                    />
                </div>

                {/* Skills Section */}
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="skills">
                        Skills (comma separated)
                    </label>
                    <input
                        type="text"
                        id="skills"
                        name="skills"
                        value={profile.skills}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="JavaScript, React, Node.js"
                    />
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-gray-700 mb-2" htmlFor="linkedin">
                            LinkedIn
                        </label>
                        <input
                            type="url"
                            id="linkedin"
                            name="linkedin"
                            value={profile.linkedin}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://linkedin.com/in/yourprofile"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2" htmlFor="github">
                            GitHub
                        </label>
                        <input
                            type="url"
                            id="github"
                            name="github"
                            value={profile.github}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://github.com/yourusername"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2" htmlFor="twitter">
                            Twitter
                        </label>
                        <input
                            type="url"
                            id="twitter"
                            name="twitter"
                            value={profile.twitter}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://twitter.com/yourhandle"
                        />
                    </div>
                </div>

                {/* Education Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Education</h2>

                    {profile.education.map((edu, index) => (
                        <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg relative">
                            {profile.education.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeEducationField(index)}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                >
                                    ×
                                </button>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">Institution</label>
                                    <input
                                        type="text"
                                        name="institution"
                                        value={edu.institution}
                                        onChange={(e) => handleEducationChange(index, e)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Degree</label>
                                    <input
                                        type="text"
                                        name="degree"
                                        value={edu.degree}
                                        onChange={(e) => handleEducationChange(index, e)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Field of Study</label>
                                <input
                                    type="text"
                                    name="field"
                                    value={edu.field}
                                    onChange={(e) => handleEducationChange(index, e)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">From</label>
                                    <input
                                        type="date"
                                        name="from"
                                        value={edu.from}
                                        onChange={(e) => handleEducationChange(index, e)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">To</label>
                                    <input
                                        type="date"
                                        name="to"
                                        value={edu.to}
                                        onChange={(e) => handleEducationChange(index, e)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={edu.current}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    id={`current-${index}`}
                                    name="current"
                                    checked={edu.current}
                                    onChange={(e) => handleEducationChange(index, e)}
                                    className="mr-2"
                                />
                                <label htmlFor={`current-${index}`} className="text-gray-700">
                                    I currently study here
                                </label>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={edu.description}
                                    onChange={(e) => handleEducationChange(index, e)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addEducationField}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        + Add Another Education
                    </button>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-yellow-400 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Save Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileForm;