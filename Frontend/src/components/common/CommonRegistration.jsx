// import React from 'react'
// common
import Header from './Header';

// React  UI
import TextPressure from '../ui/TextPressure';
import ScrollFloat from '../ui/ScrollFloat';

//instructions
import InstructionStudents from '../instructions/InstructionStudents'
import InstructionAdmin from '../instructions/InstructionAdmin'
import InstructionFaculty from '../instructions/InstructionFaculty'
import Footer from './Footer';

const CommonRegistration = () => {
  return (
    <div>
      <Header />
      {/* <div className='relative h-1/2 m-12'>
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
          minFontSize={24}
        />
      </div> */}
      <div className="relative flex justify-center align-middle mt-12 font-bold text-2xl h-[40vh]">
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
      <div className="">
        <div className="">
          <InstructionStudents />
        </div>
        <div className="">
          <InstructionFaculty />
        </div>
        <div className="">
          <InstructionAdmin />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CommonRegistration


//
// 