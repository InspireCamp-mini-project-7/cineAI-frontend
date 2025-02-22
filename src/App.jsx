import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header"; // 헤더 추가
import Home from "./pages/Home";
import MovieDetail from './pages/MovieDetail';

const App = () => {
  return (
    <Router>
      <Header /> {/* 모든 페이지에서 헤더 유지 */}
      <div style={{ paddingTop: "60px" }}> {/* 헤더 높이만큼 여백 추가 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
      </div>
    </Router>
  );
};

export default App;
