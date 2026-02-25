
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Home from '../pages/Home'
import UserRegister from '../pages/user/UserRegister'
import UserLogin from '../pages/user/UserLogin'
import FoodPartnerRegister from '../pages/food-partner/FoodPartnerRegister'
import FoodPartnerLogin from '../pages/food-partner/FoodPartnerLogin'
import CreateFood from '../pages/food/CreateFood'


function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/user/register' element={<UserRegister />} />
        <Route path='/user/login' element={<UserLogin />} />
        <Route path='/food-partner/register' element={<FoodPartnerRegister />} />
        <Route path='/food-partner/login' element={<FoodPartnerLogin />} />
        <Route path='/create-food' element={<CreateFood />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes