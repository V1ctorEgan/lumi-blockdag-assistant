import React from 'react';
import { Outlet } from 'react-router-dom';
import Particles from '../background/Particles';
import Header from '../components/Header';
import Footer from '../components/footer/Footer';
// import { Footer } from '../components/footer/Footer'

const Rootlayout = () => {
  return (
    <div className=" bg-black">

    
      <div className="fixed inset-0 pointer-events-none">
        <Particles
          particleColors={['#ffffff', '#7f5af0']}
          particleCount={100}
          particleSpread={10}
          speed={0.08}
          particleBaseSize={80}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />
      </div> 

      {/* 🌐 PAGE CONTENT ABOVE BACKGROUND */}
      <div className=''>
      <Header/>
      <div className="relative z-10">
        <Outlet />
      </div>
      <Footer/>

      {/* <Footer/> */}

      </div>

    </div>
  );
};

export default Rootlayout;
