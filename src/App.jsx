import './App.css'
import Login from "./pages/Login";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import MovieDetail from "./pages/MovieDetail";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import LoginCallback from "./pages/LoginCallback";
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header"; // 헤더 추가
import Preference from './pages/Preference';
import axios from 'axios';
import NewMovie from './pages/NewMovie';
import PrivateRoute from './components/PrivateRoute';
import AdminPrivateRoute from './components/AdminPrivateRouter';

// 모든 axios 요청에 대해 withCredentials: true를 전역적으로 설정
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

/* 헤더 숨길 경로 목록 */
const hiddenHeaderPaths = ["/", "/login", "/auth/kakao/callback", "/profile", "/admin", "/preference", "/admin/newMovie"];

/* 라우터 설정 추가 */
function Layout() {
  const location = useLocation();
  const shouldHideHeader = hiddenHeaderPaths.includes(location.pathname);
  
  return (
    <>
      { !shouldHideHeader && <Header /> } {/* 특정 경로에서 헤더 숨김 */}
      <div>
        <Routes>
          <Route path= "/"  element={<Login/>} />
          <Route path= "/login"  element={<Login/>} />
          <Route path= "/auth/kakao/callback"  element={<LoginCallback/>} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/movie/:id" element={<PrivateRoute><MovieDetail /></PrivateRoute>} />
          <Route path="/admin" element={<AdminPrivateRoute><Admin /></AdminPrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
          <Route path="/preference" element={<PrivateRoute><Preference /></PrivateRoute>} />
          <Route path='/admin/newMovie' element={<AdminPrivateRoute><NewMovie /></AdminPrivateRoute>} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout /> {/* Layout 컴포넌트가 Router 내부에서 실행됨 */}
    </Router>
  );
}

export default App;
