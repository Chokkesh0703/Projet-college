// import React from 'react'
// common
import Header from './Header';

// React  UI
import TextPressure from '../ui/TextPressure';
import ScrollFloat from '../ui/ScrollFloat';
import { useNavigate } from "react-router-dom";

const CommonRegistration = () => {
  const navigate = useNavigate();
  const handleStudent = () => {
    navigate('/register')
  }
  const handleAdmin = () => {
    navigate('/adminregister')
  }
  const handleFaculty = () => {
    navigate('/facultyregister')
  }
  return (
    <div>
      <Header />
      <div className='relative h-1/2 m-12'>
        <TextPressure
          text="Hello!"
          flex={true}
          alpha={false}
          stroke={false}
          width={true}
          weight={true}
          italic={true}
          textColor="black"
          strokeColor="#ff0000"
          minFontSize={36}
        />
      </div>
      <div className="flex justify-center align-middle gap-12">
          <button className='bg-[#ffc13b] p-6 text-2xl rounded-full font-bold' onClick={handleStudent}>Student Login</button>
          <button className='bg-[#ffc13b] p-6 text-2xl rounded-full font-bold' onClick={handleAdmin}>Admin Login</button>
          <button className='bg-[#ffc13b] p-6 text-2xl rounded-full font-bold' onClick={handleFaculty}>Faculty Login</button>
      </div>
      <div className="relative h-screen flex justify-center align-middle mt-12">
        <ScrollFloat
          animationDuration={1}
          ease='back.inOut(2)'
          scrollStart='center bottom+=50%'
          scrollEnd='bottom bottom-=40%'
          stagger={0.03}
        >
          Heres The Steps.
        </ScrollFloat>
      </div>
    </div>
  )
}

export default CommonRegistration


//
// 