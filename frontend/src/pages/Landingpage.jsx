import React from 'react'
import App from '../App'
import Animationstack from '../components/Landingcomponent/Animationstack'
import Dashboard from '../pages/Dashboard'
import { HowItWorks } from '../components/Landingcomponent/HowitWorks'
import Features from '../components/Landingcomponent/Features'

export default function Landingpage() {
  return (
    <div className=''>
        <App/>
        <Animationstack/>
        <HowItWorks/>
        <Features/>
        {/* <Dashboard/> */}
      
    </div>
  )
}
