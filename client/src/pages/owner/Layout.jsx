import React, { useEffect } from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner'
import Sidebar from '../../components/owner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import Loader from '../../components/Loader'

const Layout = () => {
  
  const {isOwner, isUserLoading, token, navigate} = useAppContext()

  useEffect(() =>{
    if(!isUserLoading && (!token || !isOwner)){
      navigate('/')
    }
  }, [isOwner, isUserLoading, token, navigate])

  if (isUserLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader />
      </div>
    )
  }

  if (!isOwner) {
    return null
  }

  return (
    <div className='flex flex-col'>
      <NavbarOwner />
      <div className='flex flex-1'>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}

export default Layout