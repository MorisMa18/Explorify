import React from 'react'
import { useSelector } from 'react-redux'
import '../components/Navbar.css'

import { selectUser } from '../features/userSlice'

import { Avatar } from '@material-ui/core'

function Navbar() {
    const user = useSelector(selectUser)

    return (
        <div className = 'navbar'>
            <div className="navbar__left">
                <h1> Explorify</h1>
                <h4> Home </h4>
            </div>

            <div className="navbar__right">
                <Avatar src={user.profileImage}/>
                <p> {user.displayName} </p>
            </div>
            
        </div>
    )
}

export default Navbar
