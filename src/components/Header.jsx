import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaComments,
  FaUserCircle,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";
import ChatbotSidebar from "../pages/ChatbotSidebar";
import "./Header.css";
import Swal from "sweetalert2";
import axios from "axios";

const Header = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const toggleChatbot = () => setIsChatbotOpen(!isChatbotOpen);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  // Bearer Token 가져오기
  const token = sessionStorage.getItem("accessToken");
  console.log("token : ", token);


  
  // 프로필 아이콘 클릭 시 회원 정보 페이지로 이동동
  const moveToProfile = () => {
    navigate('/profile');
  }

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "로그아웃 하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "로그아웃",
      cancelButtonText: "취소"
    });

    if(result.isConfirmed) {
      try {
        axios.post("http://localhost:8080/members/logout", {
          headers: {
             Authorization: `Bearer ${token}`
          }
        });

        Swal.fire({
          icon: 'success',
          title: '로그아웃 완료 !',
          text: '로그아웃에 성공하여 로그인 페이지로 이동합니다.'
        });

        // sessionStroage에서 토큰 제거
        sessionStorage.removeItem('accessToken');

        // 로그인 페이지로 이동
        navigate('/');
      }

      catch (error) {
        console.error("로그아웃 실패 : ", error);
      }
    }
  }
  
  return (
    <>
      <header className="header">
        {/* 왼쪽: 챗봇 버튼 */}
        <button className="chatbot-btn" onClick={toggleChatbot}>
          <FaComments className="chat-icon" />
        </button>

        {/* 중앙: 로고 + 검색창 + 프로필 아이콘 */}
        <div className="center-content">
          <Link to="/home" className="logo">
            <img src={'./src/assets/cineaiLogo.png'} alt="CineAI Logo" className="logo-image" />
          </Link>
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="배우, 영화 제목, 감독을 입력하세요"
            />
            <FaSearch className="search-icon" />
          </form>
          <button className="profile-btn" onClick={moveToProfile}>
            <FaUserCircle className="profile-icon" />
          </button>
        </div>

        {/* 오른쪽: 로그아웃 버튼 */}
        <div className="logout-container">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>로그아웃</span>
          </button>
        </div>
      </header>

      {/* Header에서만 사이드바 렌더링 */}
      <ChatbotSidebar
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
    </>
  );
};

export default Header;
