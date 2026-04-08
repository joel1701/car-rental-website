import React from 'react'
import Title from '../../components/owner/Title'
import { assets, cityList } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddCar = () => {

  const {axios, currency} = useAppContext()

  const [image, setImage] = React.useState(null)
  const [car, setCar] = React.useState({
    brand: "",
    model: "",
    year: 0,
    pricePerDay: 0,
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: 0,
    location: "",
    description: "",
  })

  const [isLoading, setIsLoading] = React.useState(false)
  const [showDropdown, setShowDropdown] = React.useState(false)
  const onSubmitHandler = async (e)=>{
    e.preventDefault()
    if(isLoading) return null

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('car', JSON.stringify(car))

      const {data} = await axios.post('/owner/add-car', formData)

      if(data.success){
        toast.success(data.message)
        setImage(null)
        setCar({
          brand: "",
          model: "",
          year: 0,
          pricePerDay: 0,
          category: "",
          transmission: "",
          fuel_type: "",
          seating_capacity: 0,
          location: "",
          description: "",
        })
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <div className='px-4 py-10 md:px-10 flex-1'>
      <Title title="Add New Car"
      subtitle="Fill in the details to list a new car for booking. Please include
      pricing, availability information, and a car specifications." />

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 text-gray-500
      text-sm mt-6 max-w-xl'>

        {/* car image */}
        <div className='flex items-center gap-2 w-full'>
          <label htmlFor="car-image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_icon} alt="" 
            className='h-14 rounded cursor-pointer'/>
            <input type="file" id="car-image" accept='image/*' hidden 
            onChange={e => setImage(e.target.files[0])}/>
          </label>
          <p className='text-sm text-gray-500'>Upload picture of your car</p>
        </div>

        {/* car brand and model */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Brand</label>
            <input type="text" placeholder='e.g. BMW, Mercedes, Audi...' required
            className='px-3 py-2 mt-1 border border-borderColor rounded-md
            outline-none' value={car.brand} onChange={e=> setCar({...car, brand: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label>Model</label>
            <input type="text" placeholder='e.g. X3, C-Class, A4...' required
            className='px-3 py-2 mt-1 border border-borderColor rounded-md
            outline-none' value={car.model} onChange={e=> setCar({...car, model: e.target.value})}/>
          </div>
        </div>

        {/* Car year, price, category */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Year</label>
            <input type="number" placeholder='e.g. 2020, 2021, 2022...' required
            className='px-3 py-2 mt-1 border border-borderColor rounded-md
            outline-none' value={car.year} onChange={e=> setCar({...car, year: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label>Daily Price ({currency})</label>
            <input type="number" placeholder='e.g. 50, 100, 150...' required
            className='px-3 py-2 mt-1 border border-borderColor rounded-md
            outline-none' value={car.pricePerDay} onChange={e=> setCar({...car, pricePerDay: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label>Category</label>
            <select onChange={e=> setCar({...car, category: e.target.value})} value={car.category}
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
              <option value="">Select a category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Convertible">Convertible</option>
              <option value="Van">Van</option>
              <option value="Truck">Truck</option>
            </select>
          </div>
        </div>

        {/* Car transmission, fuel type, seating capacity */}

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Transmission</label>
            <select onChange={e=> setCar({...car, transmission: e.target.value})} value={car.transmission}
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
              <option value="">Select a transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label>Fuel Type</label>
            <select onChange={e=> setCar({...car, fuel_type: e.target.value})} value={car.fuel_type}
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
              <option value="">Select a fuel type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label>Seating Capacity</label>
            <input type="number" placeholder='e.g. 2, 4, 5...' required
            className='px-3 py-2 mt-1 border border-borderColor rounded-md
            outline-none' value={car.seating_capacity} onChange={e=> setCar({...car, seating_capacity: e.target.value})}/>
          </div>
        </div>

        {/* Car location*/}
        <div className='flex flex-col w-full relative'>
          <label>Location</label>
            <input 
                type="text"
                value={car.location}
                onChange={(e) => {
                    setCar({...car, location: e.target.value});
                    setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none w-full'
                placeholder='Type a location...'
            />
            {showDropdown && (
                <ul className='absolute top-full mt-1 left-0 w-full bg-white border border-borderColor rounded-md shadow-lg max-h-48 overflow-y-auto z-50 text-left text-gray-700'>
                    {cityList
                        .filter((city) => city.toLowerCase().includes(car.location.toLowerCase()))
                        .map((city) => (
                            <li 
                                key={city} 
                                className='px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm font-normal'
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setCar({...car, location: city});
                                    setShowDropdown(false);
                                }}
                            >
                                {city}
                            </li>
                        ))
                    }
                    {cityList.filter((city) => city.toLowerCase().includes(car.location.toLowerCase())).length === 0 && (
                        <li className='px-4 py-2 text-sm text-gray-500'>No cities found</li>
                    )}
                </ul>
            )}
        </div>

        {/* Car description */}
        <div className='flex flex-col w-full'>
            <label>Description</label>
            <textarea rows={5} placeholder='Enter a description for the car...' required
            className='px-3 py-2 mt-1 border border-borderColor rounded-md
            outline-none' value={car.description} onChange={e=> setCar({...car, description: e.target.value})}></textarea>
        </div>

        <button className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary
        text-white rounded-md font-medium w-max cursor-pointer'>
          <img src={assets.tick_icon} alt="" />
          {isLoading ? 'Listing...' : 'List Your Car'}
        </button>

      </form>
    </div>
  )
}

export default AddCar