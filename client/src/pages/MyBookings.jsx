import React from 'react'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import { useAppContext } from '../context/AppContext';
import Loader from '../components/Loader';
import { toast } from 'react-hot-toast';
import {motion} from 'motion/react'

export const MyBookings = () => {

  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const backendOrigin = apiBaseUrl.replace(/\/api\/?$/, '');
  const { axios, token, isUserLoading, navigate, setShowLogin } = useAppContext();

  const formatDate = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toISOString().split('T')[0];
  };

  const getImageSrc = (image) => {
    if (!image) return assets.car_image1;
    if (typeof image === 'string') {
      if (image.startsWith('http')) return image;
      if (image.startsWith('/uploads/')) return `${backendOrigin}${image}`;
      if (image.startsWith('uploads/')) return `${backendOrigin}/${image}`;
      if (image.includes('car_image') || (image.startsWith('/') && !image.startsWith('/uploads/'))) return image;
      return `${backendOrigin}/uploads/${image.replace(/^\/+/, '')}`;
    }
    return image || assets.car_image1;
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/bookings/user');
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message || 'Failed to load bookings');
        setBookings([]);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (isUserLoading) return;

    if (!token) {
      setLoading(false);
      setShowLogin(true);
      navigate('/');
      return;
    }

    fetchBookings()
  }, [token, isUserLoading, navigate, setShowLogin])

  return (
    <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{duration: 0.6}} 
    className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm
    max-w-7xl'>
      <Title title='My Bookings'
      subTitle='View and manage all your car bookings'
      align='left' />

      {loading ? <Loader /> : (
        
      <div>
        {bookings.length > 0 ? (
        bookings.map((booking, index)=> (
          (() => {
            const carInfo = booking.car || {
              brand: booking.carBrand,
              model: booking.carModel,
              image: booking.carImage,
              year: booking.carYear,
              category: booking.carCategory,
              location: booking.carLocation,
            };

            return (
           <div key={booking._id} className='grid grid-cols-1 md:grid-cols-4 gap-6 
           p-6 border border-borderColor rounded-lg mt-5 first:mt-12' >
            {/* car image + info */}
            <div className='md:col-span-1'>
              <div className='rounded-md overflow-hidden mb-3'>
                <img src={getImageSrc(carInfo?.image)} alt={carInfo?.name || `${carInfo?.brand || 'Car'} image`} className='w-full h-auto
                aspect-video object-cover' />
              </div>
              <p className='text-lg font-medium mt-2'>{carInfo?.brand || 'Deleted'} • {carInfo?.model || 'Car'}</p>

              <p className='text-gray-500'>{carInfo?.year || 'N/A'} • {carInfo?.category || 'N/A'} • {carInfo?.location || 'N/A'}</p>
            </div>

            {/* booking details */}
            <div className='md:col-span-2'>
              <div className='flex items-center gap-2'>
                <p className='px-3 py-1.5 bg-light rounded'>Booking #{index+1}</p>
                <p className={`px-3 py-1 text-xs rounded-full ${booking.status === 'confirmed' ? 'bg-green-400/15 text-green-600' : 'bg-red-400/15 text-red-600'}`}>{booking.status}</p>
              </div>

              <div className='flex items-start gap-2 mt-3'>
                <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1'/>
                <div>
                  <p className='text-gray-500'>Rental Period</p>
                  <p>{formatDate(booking.pickupDate)} to {formatDate(booking.returnDate)}</p>
                </div>  
              </div>

              <div className='flex items-start gap-2 mt-3'>
                <img src={assets.location_icon_colored} alt="" className='w-4 h-4 mt-1'/>
                <div>
                  <p className='text-gray-500'>Pick-up Location</p>
                  <p>{carInfo?.location || 'N/A'}</p>
                </div>  
              </div>
            </div>

            {/* price and actions */}
            <div className='md:col-span-1 flex flex-col justify-between gap-6'>
              <div className='text-sm text-gray-500 text-right'>
                <p>Total Price</p>
                <h1 className='text-2xl font-semibold text-primary'>{currency}{booking.price ?? 0}</h1>
                <p>Booked on {formatDate(booking.createdAt)}</p>
              </div>
            </div>

           </div>
          )
          })()
        ))
        ) : (
          <p className='text-center text-gray-500 mt-12'>No bookings yet. Start exploring cars!</p>
        )}
      </div>
      )}
    </motion.div>
  )
}
