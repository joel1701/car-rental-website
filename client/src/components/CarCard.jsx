import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const CarCard = ({car}) => {

  const currency = import.meta.env.VITE_CURRENCY || '₹';
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const backendOrigin = apiBaseUrl.replace(/\/api\/?$/, '');
  
  // Handle both imported images (objects/asset paths) and URL strings
  const imageSrc = car?.image
    ? (typeof car.image === 'string'
      ? (car.image.startsWith('http')
        ? car.image
        : car.image.startsWith('/uploads/')
          ? `${backendOrigin}${car.image}`
          : car.image.includes('car_image') || car.image.startsWith('/') && !car.image.startsWith('/uploads/')
            ? car.image // Local asset images
            : `${backendOrigin}/uploads/${car.image.replace(/^\/+/, '')}`)
      : car.image) // If it's an imported image object, use it directly
    : '';
  const navigate = useNavigate()

  
  return (
    <div onClick={()=>{navigate(`/car-details/${car._id}`); scrollTo(0,0)}}
    className='group rounded-x1 overflow-hidden shadow-lg
    hover:-translate-y-1 transition-all duration-500
    cursor-pointer'>
      
      <div className='relative h-48 overflow-hidden'>
        <img src={imageSrc} alt="car Image" className='w-full h-full object-cover
        transition-transform duration-500 group-hover:scale-105' />

        {car.isAvailable && <p className='absolute top-4 left-4 bg-primary/90
        text-white text-xs px-2.5 py-1 rounded-full'>Available Now</p>}

        <div className='absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm
        text-white px-3 py-2 rounded-lg'>
            <span className='font-semibold'>{currency}{car.pricePerDay}</span>
            <span className='text-sm text-white/80'> / day</span>
        </div>
      </div>

      <div className='p-4 sm:p-5'>
        <div className='flex justify-between items-start mb-2'>
          <div>
            <h3 className='text-lg font-medium'>{car.brand} {car.model}</h3>
            <p className='text-muted-foreground text-sm'>{car.category} {car.year}</p>
          </div>
        </div>

        <div className='mt-4 grid grid-cols-2 gap-y-2 text-gray-600'>
          <div className='flex items-center text-sm text-muted-foreground'>
            <img src={assets.user_icon} alt="" className='h-4 mr-2'/>
            <span>{car.seating_capacity}</span>
          </div>
          <div className='flex items-center text-sm text-muted-foreground'>
            <img src={assets.fuel_icon} alt="" className='h-4 mr-2'/>
            <span>{car.fuel_type}</span>
          </div>
          <div className='flex items-center text-sm text-muted-foreground'>
            <img src={assets.car_icon} alt="" className='h-4 mr-2'/>
            <span>{car.transmission}</span>
          </div>
          <div className='flex items-center text-sm text-muted-foreground'>
            <img src={assets.location_icon} alt="" className='h-4 mr-2'/>
            <span>{car.location}</span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default CarCard