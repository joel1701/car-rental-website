import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
  const navigate = useNavigate();
  return (
    <motion.div
    initial={{opacity: 0, y: 50}}
    whileInView={{opacity: 1, y: 0}}
    transition={{duration: 0.6}} 
    className='flex flex-col md:flex-row md:items-start items-center
    justify-between px-8 min-md:pl-14 pt-10 bg-gradient-to-r from-[#0558FE] to-
    [#A9CFFF] max-w-6xl mx-3 md:mx-auto rounded-2xl overflow-hidden '>

        <div className='text-white'>
            <h2 className='text-3xl font-medium'>Earn passive income with your car</h2>
            <p className='mt-2'>Transform your idle vehicle into a consistent revenue stream on our platform.</p>
            <p className='max-w-130 mt-2'>Stay in complete control—set your own daily price, approve specific booking requests, and monitor your monthly earnings directly from your personalized Owner Dashboard!
            </p>

            <motion.button
            onClick={() => navigate('/owner/add-car')}
            whileHover={{scale: 1.05}} 
            whileTap={{scale: 0.95}}
            className='px-6 py-2 bg-white hover:bg-slate-100 transition-all
            text-primary rounded-lg text-sm mt-4 cursor-pointer'>
                List your car
            </motion.button>
        </div>

        <motion.img
        initial={{opacity: 0, y: 50}} 
        whileInView={{opacity: 1, x: 0}}
        transition={{duration: 0.6, delay: 0.4}}
        src={assets.banner_car_image} alt="car" className='max-h-45 mt-10' />

    </motion.div>
  )
}

export default Banner