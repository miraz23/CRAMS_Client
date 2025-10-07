import React from 'react'
import iiuc from "../../../assets/IIUC_LOGO.webp"
import { Link, useNavigate } from 'react-router-dom'
const Navbar = () => {
  const navigate = useNavigate()
  return (
    <div className='flex justify-between items-center px-6 py-4 shadow-2xl'>
      {/* for logo */}
      <div className='flex items-center gap-3'>
        <img src={iiuc} alt="" className='h-12 w-12'/>
        <p>IIUC</p>
      </div>
      {/* login button */}
      <div>
        <button onClick={()=>{navigate("/login")}} className='bg-green-900 hover:bg-green-600 text-white px-6 py-2 rounded-3xl cursor-pointer'>Login</button>
      </div>

    </div>
  )
}

export default Navbar