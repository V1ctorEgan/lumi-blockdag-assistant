import React from 'react'
import App from '../App'
import Animationstack from '../components/Landingcomponent/Animationstack'
import Dashboard from '../pages/Dashboard'
import { HowItWorks } from '../components/Landingcomponent/HowitWorks'
import Features from '../components/Landingcomponent/Features'
import ScrollingText from '../components/Landingcomponent/ScrollingText'
import Contact from '../components/Landingcomponent/Contact'
import Summary from '../components/Landingcomponent/summary'
export default function Landingpage() {
  return (
    <div className=''>
        <App/>
        <ScrollingText text={'LUMI-CHat is backed by blockchain technology , ensuring secure and transparent interactions. powered by AI , LUMI-Chat provides real-time insights and personalized recommendations for your blockchain journey '}/>
        <Animationstack/>
        <HowItWorks/>
        <Summary/>
        <Contact/>
        {/* <Features/> */}
        {/* <Dashboard/> */}
      
    </div>
  )
}
