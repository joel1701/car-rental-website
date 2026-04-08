import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'

const Hero = () => {
    const navigate = useNavigate()

  return (
    <motion.div
    initial = {{opacity: 0 }}
    animate = {{opacity: 1 }}
    transition = {{duration: 0.8}}
    className='h-screen flex flex-col items-center
    justify-center gap-14 bg-light text-center'>

        <motion.h1 initial = {{y: 50, opacity: 0 }}
            animate = {{y: 0, opacity: 1 }}
            transition = {{duration: 0.8, delay: 0.2}}
        className='text-4xl md:text-5xl font-semibold'>Luxury cars on Rent</motion.h1>

        <motion.div
        initial = {{y: 50, opacity: 0, scale: 0.95 }}
        animate = {{y: 0, opacity: 1, scale: 1 }}
        transition = {{duration: 0.8, delay: 0.4}}
        className='flex flex-col items-center gap-4'>
            <motion.button
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
                onClick={() => navigate('/cars')}
                className='flex items-center justify-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer'
            >
                <img src={assets.search_icon} alt="search" className='brightness-300'/>
                Browse Cars
            </motion.button>
        </motion.div>
        
        <motion.img
        initial = {{y: 100, opacity: 0 }}
        animate = {{y: 0, opacity: 1 }}
        transition = {{duration: 0.8, delay: 0.6}}
        src={assets.main_car} alt="car" className='max-h-74' />

    </motion.div>
  )
}

export default Hero