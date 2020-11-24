import React,{usecontext} from 'react'
import {link} from  'react-router-dom'
import {usercontext} from '../app'
const navbar = ()=>{
    const {state,dispatch} =usecontext(usercontext)
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
        <div classname="nav-wrapper white">
            <link to={state?"/":"/signin"} classname="brand-logo left">instagram</link>
            <ul id="nav-mobile"classname="right">
            {renderlist()}
            </ul>
        </div>
        </nav>
    )