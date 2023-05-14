// Write your JS code here
// import {Component} from 'react'
import {  Link} from 'react-router-dom'
// import {FiMenu} from 'react-icons/fi'
// import {MdCancel} from 'react-icons/md'
// import Cookies from 'js-cookie'
import './index.css'

const Header = () => (

            <nav className='navbar'>
                <ul className='nav-list'>
                    <Link className='nav-link' to='/'><li className='nav-item'>Home</li></Link>
                    <Link className='nav-link' to='/search-location'><li className='nav-item'>Search Location</li></Link>
                </ul>
            </nav>
    )


export default Header
