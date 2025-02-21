import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatbotSidebar from "./ChatbotSidebar";
import "./Main.css";

const API_KEY = "5733CS321TJ154JO0103";
const BASE_URL = "/api/openapi-data2/wisenut/search_api/search_json2.jsp";
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/200x300?text=No+Image";
const LOGO_IMAGE = "../Logo image.png";

const Main = () => {
  const [movies, setMovies] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          collection: "kmdb_new2",
          ServiceKey: API_KEY,
          type: "극영화",
          listCount: 500,
          sort: "prodYear,1",
          releaseDts: "20100101",
          releasDte: "20251231",
        },
      });

      const results = response.data.Data?.[0]?.Result || [];
      setMovies(results);
      console.log("전체 영화 수:", results.length);
    } catch (error) {
      console.error("영화 정보를 불러오는 데 실패했습니다:", error);
    }
  };

  const getPosterUrl = (posters) => {
    if (!posters) return null;
    const firstPoster = posters.split("|")[0];
    return firstPoster.startsWith("http") ? firstPoster : `http://${firstPoster}`;
  };

  const hasValidPoster = (movie) => {
    const posterUrl = getPosterUrl(movie.posters);
    return posterUrl && posterUrl !== PLACEHOLDER_IMAGE;
  };

  const filterAdultMovies = (movies) => {
    return movies.filter(movie => !movie.rating.includes("관람불가"));
  };

  const getRandomMovies = (movies, count) => {
    const validMovies = filterAdultMovies(movies)
      .filter(movie => hasValidPoster(movie));
    const shuffled = [...validMovies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const getUpcomingMovies = (movies, count) => {
    const today = new Date();
    console.log("현재 날짜:", today.toISOString());

    // 개봉일 있는 영화 필터링
    const moviesWithReleaseDate = movies.filter(movie => movie.repRlsDate);
    console.log("개봉일 있는 영화 수:", moviesWithReleaseDate.length);

    // 미래 개봉 영화 필터링
    const futureMovies = moviesWithReleaseDate.filter(movie => {
      const releaseDate = new Date(movie.repRlsDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
      const isFuture = releaseDate > today;
      return isFuture;
    });
    console.log("미래 개봉 영화 수:", futureMovies.length);

    // 포스터 있는 영화 필터링
    const moviesWithPosters = futureMovies.filter(movie => hasValidPoster(movie));
    console.log("포스터 있는 미래 개봉 영화 수:", moviesWithPosters.length);

    const sortedMovies = moviesWithPosters
      .sort((a, b) => new Date(a.repRlsDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')) 
                    - new Date(b.repRlsDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')));

    // 정렬된 영화들의 개봉일 출력
    sortedMovies.forEach(movie => {
      console.log("영화:", movie.title, "개봉일:", movie.repRlsDate);
    });

    return sortedMovies.slice(0, count);
  };

  const randomMovies = getRandomMovies(movies, 4);
  const upcomingMovies = getUpcomingMovies(movies, 4);

  return (
    <div className={`main-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <h1 className="main-title">맞춤 영화 추천</h1>

      <ChatbotSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="movies-section">
        <h2>랜덤 영화 추천</h2>
        <div className="movies-grid">
          {randomMovies.map((movie, index) => (
            <div key={index} className="movie-card">
              <img 
                src={getPosterUrl(movie.posters)} 
                alt={movie.title} 
                className="movie-poster"
                onError={(e) => {
                  e.target.src = LOGO_IMAGE;
                }}
              />
              <h2 className="movie-title">{movie.title || "제목 없음"}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="movies-section">
        <h2>개봉 예정 영화</h2>
        <div className="movies-grid">
          {upcomingMovies.map((movie, index) => (
            <div key={index} className="movie-card">
              <img 
                src={getPosterUrl(movie.posters)} 
                alt={movie.title} 
                className="movie-poster"
                onError={(e) => {
                  e.target.src = LOGO_IMAGE;
                }}
              />
              <h2 className="movie-title">{movie.title || "제목 없음"}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;