

import { motion } from 'framer-motion'
// import Technicalexpcard from './TechnicalExpertSection/Technicalexpertcard/Technicalexpcard'

export default function ScrollingText({text}) {
  return (
    <div className="overflow-hidden whitespace-nowrap md:w-full bg-transparent  w-[90vw] text-slate-400  ">
      <motion.div
        className=" inline-flex md:text-sm text-[9px] font-medium  px-4  "
        animate={{ x: ['0%', '-100%'] }}
       transition={{
          repeat: Infinity,
          duration: 15, 
          repeatType:"loop",

          ease: "linear"
      
          
        }}
      >
     
{text}
       
      
      </motion.div>
      

          <motion.div
        className=" inline-flex md:text-sm text-[9px] font-medium  px-4  "
        animate={{ x: ['0%', '-100%'] }}
       transition={{
          repeat: Infinity,
          duration: 15, 
          repeatType:"loop",

          ease: "linear"
       
          
        }}
      >

        <div className=''>

{text}
        </div>



       
      
      </motion.div>
    </div>
  )
}
