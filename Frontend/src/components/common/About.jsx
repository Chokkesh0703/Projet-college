import React from 'react'
import Header from './Header'
import image from '../../assets/doodle.png'

const About = () => {
  return (
    <div className="">
      <Header />
      <div className="container mx-auto mt-40 p-6 bg-white shadow-lg flex flex-col md:flex-row">
        <img src={image} alt="Alumni Network" className="h-full w-auto md:w-1/3 md:h-auto mb-6 md:mb-0 md:mr-6"></img>
        <div className="flex-grow">
          <h1 className="text-3xl font-bold text-center md:text-left text-gray-800 mb-6">About Us</h1>
          <p className="text-gray-700 leading-relaxed mb-4">Welcome to our website, a thriving community dedicated to reconnecting old friends, fostering new relationships, and providing a platform for professional growth. Whether you&apos;re a recent graduate or an experienced professional, our network is designed to help you stay connected with your alma mater and fellow alumni.</p>
          <p className="text-gray-700 leading-relaxed mb-4">One of our key features is the <strong>Admin Login</strong>. This feature empowers designated administrators to post and delete pictures and videos, ensuring that our platform is always vibrant and up-to-date with the latest news and events. Administrators can also manage user accounts and oversee community guidelines, maintaining a safe and engaging environment for all members.</p>
          <p className="text-gray-700 leading-relaxed mb-4">For our alumni, we offer a <strong>Student Login</strong> interface that allows you to interact with the community in meaningful ways. Members can like and comment on posts, join chat rooms to discuss various topics, and share their experiences with others. Our platform is more than just a directory. it&apos;s a place where you can find job opportunities, attend networking events, and participate in discussions on a wide range of topics. Join us today and become a part of a vibrant network that celebrates the achievements and successes of our alumni!</p>
        </div>
      </div>
    </div>
  )
}

export default About
