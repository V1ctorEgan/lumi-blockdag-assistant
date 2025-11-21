import React from 'react'
import App from '../App'
import Animationstack from '../components/Landingcomponent/Animationstack'
import Dashboard from '../pages/Dashboard'
import { HowItWorks } from '../components/Landingcomponent/HowitWorks'
import Features from '../components/Landingcomponent/Features'
import ScrollingText from '../components/Landingcomponent/ScrollingText'
export default function Landingpage() {
  return (
    <div className=''>
        <App/>
        <ScrollingText text={'LUMI is powered by the blockdag that is backed by commercial fixed  why is the time of the time of the focus of the time of the security '}/>
        <Animationstack/>
        <HowItWorks/>
        <Features/>
        {/* <Dashboard/> */}
      
    </div>
  )
}
