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

const LOGO_IMAGE = "../Logo image.png";

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

  return (
    <>
      <header className="header">
        {/* 왼쪽: 챗봇 버튼 */}
        <button className="chatbot-btn" onClick={toggleChatbot}>
          <FaComments className="chat-icon" />
        </button>

        {/* 중앙: 로고 + 검색창 + 프로필 아이콘 */}
        <div className="center-content">
          <Link to="/" className="logo">
            <img src={LOGO_IMAGE} alt="CineAI Logo" className="logo-image" />
          </Link>
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="배우, 영화 제목, 감독을 입력하세요"
            />
            <button type="submit" className="search-icon">
              <FaSearch />
            </button>
          </form>
          <button className="profile-btn" onClick={handleProfileClick}>
            <FaUserCircle className="profile-icon" />
          </button>
        </div>

        {/* 오른쪽: 로그아웃 버튼 */}
        <div className="logout-container">
          <button className="logout-btn">
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
