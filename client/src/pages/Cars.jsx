import React, { useEffect, useCallback } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CarCard from '../components/CarCard';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';
import {motion} from 'motion/react'

export const Cars = () => {

  const [searchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')

  const {cars, axios} = useAppContext() 

  const isSearchData = pickupLocation && pickupDate && returnDate
  const [filteredCars, setFilteredCars] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [input, setInput] = React.useState('')

  const applyFilter = useCallback(()=>{
    if(input === ''){
      setFilteredCars(cars)
      return null
    }

    const filtered = cars.slice().filter((car)=>{
      return car.brand.toLowerCase().includes(input.toLowerCase()) ||
      car.model.toLowerCase().includes(input.toLowerCase()) ||
      car.category.toLowerCase().includes(input.toLowerCase()) ||
      car.transmission.toLowerCase().includes(input.toLowerCase())
    })
    setFilteredCars(filtered)
  }, [input, cars])

  const searchCarAvailability = async () => {
    try {
      setLoading(true)
      const {data} = await axios.post('/bookings/check-availability',{
        location: pickupLocation,
        pickupDate,
        returnDate
      })
      if(data.success){
        setFilteredCars(data.cars)
        if(data.cars.length === 0){
          toast.error('No Cars Available')
        }
      }
    } catch (error) {
      toast.error(error.message || 'Error fetching cars')
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    if(isSearchData) {
      searchCarAvailability()
    } else {
      // Show all cars if no search params
      setFilteredCars(cars)
    }
  }, [pickupLocation, pickupDate, returnDate, cars])

  useEffect(()=>{
    cars.length > 0  && !isSearchData && applyFilter()
  }, [applyFilter, isSearchData, cars])
  


  return (
    <div>
      <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.6, ease: 'easeOut'}}
      
      className='flex flex-col items-center py-20 bg-light max-md:px-4'>
      <Title title='Available Cars' 
      subTitle='Browse our selection of premium vehicles available for your next adventure' />

      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{duration: 0.5, delay: 0.3}}
      className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12
      rounded-full shadow'>
        <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2'/>

        <input onKeyPress={(e)=> e.key === 'Enter' && applyFilter()} onChange={(e)=> setInput(e.target.value)} value={input} type="text" placeholder='Search by make, model, or features' 
        className='w-full h-full outline-none text-gray-500'/>

        <img src={assets.filter_icon} alt="filter" className='w-4.5 h-4.5 ml-2 cursor-pointer' onClick={applyFilter}/>
      </motion.div>
      </motion.div>

      <motion.div
      initial={{ opacity: 0}}
      animate={{ opacity: 1}}
      transition={{duration: 0.6, delay: 0.6}}
      className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
        {loading && <p className='text-gray-500 xl:px-20 max-w-7xl mx-auto'>Loading cars...</p>}
        {!loading && <p className='text-gray-500 xl:px-20 max-w-7xl mx-auto'>Showing {filteredCars.length} Cars</p>}

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4
        xl:px-20 max-w-7xl mx-auto'>
          {filteredCars.map((car, index)=>(
            <motion.div key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{duration: 0.4, delay: index*0.1, }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
