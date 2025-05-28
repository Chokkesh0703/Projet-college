import React from 'react';
import Header from './Header';
import InFooter from './InFooter';

const HowtoUse = () => {
  return (
    <div className="">
      <Header />
      <div className="container mx-auto p-6 bg-white shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">How to Use Our Website</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Admin Login</h2>
          <p className="text-gray-700 leading-relaxed mb-4">The Admin Login feature is designed for designated administrators to manage the content and user accounts on the platform. Once logged in, admins can:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Post and delete pictures and videos to keep the platform updated with the latest content.</li>
            <li>Manage user accounts to ensure a safe and engaging environment.</li>
            <li>Oversee community guidelines to maintain a respectful and supportive community.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">Admins can access the Admin Dashboard from the top navigation bar after logging in.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Student Login</h2>
          <p className="text-gray-700 leading-relaxed mb-4">The Student Login interface allows alumni members to fully engage with the community. After logging in, members can:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Like and comment on posts to share their thoughts and connect with others.</li>
            <li>Join chat rooms to discuss various topics and share experiences.</li>
            <li>Update their profile to showcase their achievements and interests.</li>
            <li>Chat personally with faculty members to seek guidance and mentorship.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">Members can access these features from the main dashboard after logging in.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Faculty Login</h2>
          <p className="text-gray-700 leading-relaxed mb-4">The Faculty Login section empowers educators and faculty members to engage with students and manage their contributions. Faculty members can:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Share updates, announcements, and academic content.</li>
            <li>Oversee student discussions and provide valuable insights.</li>
            <li>Chat personally with students to offer mentorship and support.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">Faculty members can access their tools and features via the Faculty Dashboard after logging in.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">General Navigation</h2>
          <p className="text-gray-700 leading-relaxed mb-4">Navigating our website is simple and intuitive. Here are some key areas to explore:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li><strong>Home:</strong> The main landing page with the latest news and updates.</li>
            <li><strong>Events:</strong> Stay informed about upcoming networking events, webinars, and reunions.</li>
            <li><strong>Directory:</strong> Find and connect with fellow alumni and faculty through our comprehensive directory.</li>
            <li><strong>Resources:</strong> Access valuable resources including job opportunities, mentorship programs, and more.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">For any assistance, feel free to reach out to our support team through the contact page.</p>
        </section>
      </div>
      <InFooter/>
    </div>
  )
}

export default HowtoUse;


