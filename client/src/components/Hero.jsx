import React, { useState } from 'react'
import { assets, cityList } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { motion } from 'motion/react'

const Hero = () => {

    const [pickupLocation, setPickupLocation] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)

    const {pickupDate, setPickupDate, returnDate, setReturnDate, navigate} = useAppContext()

    const handleSearch = (e) =>{
        e.preventDefault()
        navigate('/cars?pickupLocation='+pickupLocation+'&pickupDate='+pickupDate+'&returnDate='+returnDate)
    }

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

        <motion.form
        initial = {{y: 50, opacity: 0, scale: 0.95 }}
        animate = {{y: 0, opacity: 1, scale: 1 }}
        transition = {{duration: 0.8, delay: 0.4}}
        onSubmit={handleSearch} className='flex flex-col md:flex-row items-start md:items-center
        justify-between p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-200
        bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]'>

            <div className='flex flex-col md:flex-row items-start md:items-center
            gap-10 min-md:ml-8'>

                    <div className='flex flex-col items-start gap-2 relative'>
                       <label htmlFor="pickup-location">Pickup Location</label>
                        <input 
                            id="pickup-location"
                            required
                            type="text"
                            value={pickupLocation}
                            onChange={(e) => {
                                setPickupLocation(e.target.value);
                                setShowDropdown(true);
                            }}
                            onFocus={() => setShowDropdown(true)}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                            className='outline-none text-sm text-gray-500 placeholder-gray-400 bg-transparent w-36 md:w-40'
                            placeholder='Type a city...'
                        />
                        {showDropdown && (
                            <ul className='absolute top-16 left-0 w-52 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto z-50 text-left'>
                                {cityList
                                    .filter((city) => city.toLowerCase().includes(pickupLocation.toLowerCase()))
                                    .map((city) => (
                                        <li 
                                            key={city} 
                                            className='px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-700'
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                setPickupLocation(city);
                                                setShowDropdown(false);
                                            }}
                                        >
                                            {city}
                                        </li>
                                    ))
                                }
                                {cityList.filter((city) => city.toLowerCase().includes(pickupLocation.toLowerCase())).length === 0 && (
                                    <li className='px-4 py-2 text-sm text-gray-500'>No cities found</li>
                                )}
                            </ul>
                        )}
                    </div>
                    <div className='flex flex-col items-start gap-2'>
                       <label htmlFor="pickup-date">Pick-up Date</label>
                       <input value={pickupDate} onChange={e=>setPickupDate(e.target.value)} type="date" id='pickup-date' min={new Date().toISOString().
                        split('T')[0]} className='text-sm text-gray-500' required />
                    </div>
                    <div className='flex flex-col items-start gap-2'>
                       <label htmlFor="return-date">Return Date</label>
                       <input value={returnDate} onChange={e=>setReturnDate(e.target.value)} type="date" id='return-date' className='text-sm text-gray-500' required />
                    </div>
            </div>
                    <motion.button
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    className='flex items-center jusitfy-center gap-1 px-9 py-3
                    max-sm:mt-4 bg-primary hover:bg-primary-dull text-white rounded-full
                    cursor-pointer'>
                        <img src={assets.search_icon} alt="search" className='brightness-300'/>
                        Search
                    </motion.button>
        </motion.form>
        
        <motion.img
        initial = {{y: 100, opacity: 0 }}
        animate = {{y: 0, opacity: 1 }}
        transition = {{duration: 0.8, delay: 0.6}}
        src={assets.main_car} alt="car" className='max-h-74' />

    </motion.div>
  )
}

export default Hero