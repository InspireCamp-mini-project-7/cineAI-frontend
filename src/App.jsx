import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header"; // 헤더 추가
import Main from "./pages/Main";

const App = () => {
  return (
    <Router>
      <Header /> {/* 모든 페이지에서 헤더 유지 */}
      <div style={{ paddingTop: "60px" }}> {/* 헤더 높이만큼 여백 추가 */}
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
      </div>
    </Router>
  );
};

export default App;
