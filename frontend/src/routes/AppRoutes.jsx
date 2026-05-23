import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from '../pages/Home';
import UserProfile from '../pages/user/UserProfile';
import UserRegister from '../pages/user/UserRegister';
import UserLogin from '../pages/user/UserLogin';
import EditUserProfile from '../pages/user/EditUserProfile';
import CreatorRegister from '../pages/creator/CreatorRegister';
import CreatorLogin from '../pages/creator/CreatorLogin';
import CreatorProfile from '../pages/creator/CreatorProfile';
import EditCreatorProfile from '../pages/creator/EditCreatorProfile';
import CreatorReels from '../pages/creator/CreatorReels';
import CreateReel from '../pages/reel/CreateReel';
import Inbox from '../pages/Messaging/Inbox';
import ChatThread from '../pages/Messaging/ChatThread';
import Search from '../pages/Search';
import StackScroll from '../pages/stack/StackScroll';
import StackDetail from '../pages/stack/StackDetail';
import StackCreate from '../pages/stack/StackCreate';
import Achievements from '../pages/Achievements';

import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Auth Routes without Navigation Layout */}
        <Route path='/user/register' element={<UserRegister />} />
        <Route path='/user/login' element={<UserLogin />} />
        <Route path='/creator/register' element={<CreatorRegister />} />
        <Route path='/creator/login' element={<CreatorLogin />} />

        {/* Protected Routes requiring Authentication */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path='/' element={<Home />} />
            <Route path='/search' element={<Search />} />
            <Route path='/stack' element={<StackScroll />} />
            <Route path='/stack/create' element={<StackCreate />} />
            <Route path='/stack/:id' element={<StackDetail />} />
            <Route path='/messages' element={<Inbox />} />
            <Route path='/user/profile' element={<UserProfile />} />
            <Route path='/user/profile/edit' element={<EditUserProfile />} />
            <Route path='/creator/profile' element={<CreatorProfile />} />
            <Route path='/creator/profile/edit' element={<EditCreatorProfile />} />
            <Route path='/creator/reels' element={<CreatorReels />} />
            <Route path='/create-reel' element={<CreateReel />} />
            <Route path='/achievements' element={<Achievements />} />
          </Route>
          {/* ChatThread has its own custom TopBar + input bar, no BottomNav needed */}
          <Route path='/messages/:conversationId' element={<ChatThread />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRoutes;
