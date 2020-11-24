import React,{UseContext} from 'react'
import {Link} from 'react-router-dom'
import {UserContext} from '../App'
const NavBar = ()=>{
    const {state,dispatch} =UseContext(UserContext)
    const renderlist =()=>{
        if (state){
            return [
                <li><link to="/profile">profile</link></li>,
                <li><link to="/create">create post</link></li>
            ]
        }else{
            return [
                <li><link to="/signin">signin</link></li>,
                <li><link to="/signup">signup</link></li>
            ]
        }
    }
    return(
        <nav>
        <div className="nav-wrapper white">
            <link to={state?"/":"/signin"} className="brand-logo left">instagram</link>
            <ul id="nav-mobile"className="right">
            {renderlist()}
            </ul>
        </div>
        </nav>
    )
}
export default Navbar;