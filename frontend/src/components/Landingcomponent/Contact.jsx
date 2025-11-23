// export default function Contact() {
//   return (
//     <section className="py-12 px-4">
//         <span id="contact" ></span>
//       <div className="container mx-auto   bg-linear-to-br from-[#031024]/30 to-[#071029]/30 py-8 rounded-2xl glass border border-white/6">
//         <div className="flex flex-col  items-center w-full   gap-6">
//           <div className="text-center">
//             <h3 className="text-2xl font-semibold text-slate-400">Want to know more about LUMI?</h3>
//             <p className="text-slate-400 mt-2">Contact us </p>
//           </div>
//           <div className="text-slate-400 text-lg  w-full px-27">
//             <form action="" method="post">

//             <div className="flex flex-col my-1">
//             <label htmlFor="email">Email</label>
//             <input type="email" id="email" placeholder="johndoe@gamil.com" className="border border-white rounded-lg px-2 py-1" />

//             </div>
//             <label htmlFor="message">Message</label>
//             <textarea name="" id="message" placeholder="Message" className="border border-white w-full rounded-lg text-slate-400 px-4 py-2"></textarea>
//               <button type="submit" className="bg-blue-800 py-1 my-1 w-full rounded-lg">Submit</button>


//             </form>
           
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import React, { useState } from 'react'
// import Getintouchheader from './Getintouchheader'
import { div } from 'framer-motion/client'

const GetintouchMain = () => {
  const [Data, setData] = useState({
    name: "",
    email: "",
    message: ""
  })

  const handleChange = (e) => {
    setData({...Data, [e.target.name]: e.target.value})

  }

  const submit = (e) => {
    e.preventDefault() 
    
    console.log(Data)



  }
    

  let {name, email, message} = Data



  let socials = [
    {src:"/images/facebook.png",size:'size-7'},
    {src:"/images/instagram.png",size:'size-7'},
    {src:"/images/linkedin.png",size:'size-5.5'},
    {src:"/images/whatsapp.png",size:'size-6.5'},
  ]


  return (
    <div className=''>

        <div className='backdrop-blur-3xl/10 md:mx-8 mx-3 rounded-2xl text-white  border border-white/20  '>


        <div className='flex md:mx-20 mx-4  pb-3'>
            <span id='contact'></span>


        <div className='w-full px-3'>
            <div className='py-4 ' >
               <h1 className='text-3xl text-slate-400'>CONTACT US</h1>

                <div className='text-sm text-white/40 py-1'>
                Want to know more about LUMI ?

                </div>

            </div>

        
           <form action="" method="post" onSubmit={submit}>

            <div className='grid md:grid-cols-2 gap-6 text-white '>
                <div>
                <input type="text" placeholder='Name' name='name' value={name} onChange={handleChange} className='border border-white/20 px-4 md:py-2 py-1  opacity-100 rounded-lg w-full'/>

                </div>

                <div>
                <input type="text" placeholder='Email Address' name='email' value={email} onChange={handleChange} className='border border-white/20 px-4 md:py-2 py-1 backdrop-blur-3xl rounded-lg w-full'/>

                </div>

                <div className='md:col-span-2 w-full h-full'>
                <textarea name="message" placeholder='Message' value={message} onChange={handleChange}  className='px-4  w-full md:h-20 h-15 border-white/20 rounded-lg border'></textarea>

                </div>
                <div className='md:col-span-2'>
                <button type="submit" className='border text-sm bg-blue-800 hover:bg-blue-700 rounded-lg w-full py-1 text-black  md:py-2'>Send Message</button>
           
       
                    <div className='flex justify-center py-2 items-center'>
                      <hr className='md:w-30 w-20 text-white/20 '/>
                      <div className='px-2 text-white/20'>
                        or
                      </div>
                      <hr className='md:w-30 w-20 text-white/20'/>

                    </div>
                  
              
               
                 <div className='flex gap-2 items-center justify-center pt-2 '>
           
                {socials.map((e,index)=>

                <div key={index} className='hover:px-4 '>
                  <img src={e.src} alt="" className={e.size} />
                </div>
                )}

                 </div>
              

         
            

                </div>


            </div>
           </form>


        </div>





        </div>


          
        </div>


      
    </div>
  )
}

export default GetintouchMain

