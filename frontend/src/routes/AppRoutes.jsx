import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from '../pages/Home';
import Saved from '../pages/Saved';
import UserProfile from '../pages/UserProfile';
import UserRegister from '../pages/user/UserRegister';
import UserLogin from '../pages/user/UserLogin';
import FoodPartnerRegister from '../pages/food-partner/FoodPartnerRegister';
import FoodPartnerLogin from '../pages/food-partner/FoodPartnerLogin';
import FoodPartnerProfile from '../pages/food-partner/FoodPartnerProfile';
import CreateFood from '../pages/food/CreateFood';
import Inbox from '../pages/Messaging/Inbox';
import ChatThread from '../pages/Messaging/ChatThread';
import Search from '../pages/Search';

import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Auth Routes without Navigation Layout */}
        <Route path='/user/register' element={<UserRegister />} />
        <Route path='/user/login' element={<UserLogin />} />
        <Route path='/food-partner/register' element={<FoodPartnerRegister />} />
        <Route path='/food-partner/login' element={<FoodPartnerLogin />} />

        {/* Public Content Routes with Navigation Layout */}
        {/* Currently making Home and Saved "public" so you can visually test without navigating auth first */}
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/search' element={<Search />} />
          <Route path='/saved' element={<Saved />} />
          <Route path='/messages' element={<Inbox />} />
          <Route path='/food-partner/:id' element={<FoodPartnerProfile />} />
        </Route>

        {/* ChatThread has its own custom TopBar + input bar, no BottomNav needed */}
        <Route path='/messages/:conversationId' element={<ChatThread />} />

        {/* Protected Routes requiring Authentication + Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path='/profile' element={<UserProfile />} />
            <Route path='/create-food' element={<CreateFood />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRoutes;