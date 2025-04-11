import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Contact = () => {
  return (
    <div className="">
        <Header />
      <div className="h-screen flex justify-center items-center"> 
        <div className="container mx-auto p-6 bg-white shadow-lg">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Contact Us</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We&apos;d love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to reach out to us. Our team is here to help and support you.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Developers</h2>
            <div className="flex flex-col md:flex-row md:justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-semibold text-gray-800">Chokkesh</h3>
                <p className="text-gray-700 leading-relaxed">Chokkesh is currently pursuing his final year of BCA. He is passionate about web development and creating meaningful digital experiences.</p>
                <p className="text-gray-700 leading-relaxed mt-2">Portfolio: <a href="https://protfolio-chokkesh0703s-projects.vercel.app/" className="text-blue-500">[Link to Chokkesh&apos;s Portfolio]</a></p>
              </div>
              <div className="">
                <h3 className="text-xl font-semibold text-gray-800">Saad Muyeez</h3>
                <p className="text-gray-700 leading-relaxed">Saad Muyeez is in his final year of BCA. He has a keen interest in software development and aims to build innovative solutions.</p>
                <p className="text-gray-700 leading-relaxed mt-2">Portfolio: <a href="https://saadmuyeezportfolio.netlify.app/" className="text-blue-500">[Link to Saad Muyeez&apos;s Portfolio]</a></p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Contact;
