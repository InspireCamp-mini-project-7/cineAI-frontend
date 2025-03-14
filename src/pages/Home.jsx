import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LOGO_IMAGE } from "../constants";
import axios from "axios";
import "./Home.css";
import { FaSyncAlt } from "react-icons/fa";

const Home = () => {
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastMovieId, setLastMovieId] = useState(0);

  const token = sessionStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      alert("로그인이 필요합니다!");
      window.location.href = "/login";
      return;
    }
    
    // 세션 스토리지에서 저장된 데이터 확인
    const cachedRecommended = sessionStorage.getItem('recommendedMovies');
    const cachedLatest = sessionStorage.getItem('latestMovies');
    
    if (cachedRecommended && cachedLatest) {
      // 캐시된 데이터가 있으면 사용
      setRecommendedMovies(JSON.parse(cachedRecommended));
      setLatestMovies(JSON.parse(cachedLatest));
      setLoading(false);
    } else {
      // 없으면 새로 로드
      initializeMovieData();
    }
  }, []);

  const initializeMovieData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        // 병렬 처리로 성능 향상
        fetchRecommendedMovies(),
        fetchLatestMovies(),
      ]);
    } 
    catch (error) {
      console.error("영화 정보 로드 실패 상세:", {
        status: error.response?.status,
        data: error.response?.data,
      });
    } 
    finally {
      setLoading(false);
    }
  };

  const fetchRecommendedMovies = async () => {
    try {
      // const params = {
      //   size: 5,
      //   lastMovieId: parseInt(lastMovieId) || 0, //  null 방지 처리
      // };


      // 한 번에 5개 요청
      const response = await axios.get("/movies/todays?size=5");
      // {
      //   // params,
      //   // paramsSerializer: { indexes: null }, 
      // });

      // if (!response.data || !Array.isArray(response.data)) {
      //   throw new Error("유효하지 않은 응답 형식");
      // }

      setRecommendedMovies(response.data.data.content);
      sessionStorage.setItem('recommendedMovies', JSON.stringify(response.data.data.content));

      if (response.data.length > 0) {
        setLastMovieId(response.data[response.data.length - 1].movieId);
      }
    } 
    catch (error) {
      console.error("추천 영화 조회 실패:", {
        error: error.response?.data || error.message,
        params: { lastMovieId },
      });
      throw error;
    }
  };

  const fetchLatestMovies = async () => {
    try {
      const response = await axios.get(
        "/movies/new-movies?&size=5");
      //   {
      //     // params: {
      //     //   size: 5,
      //     //   // 하드코딩 값 → 동적 ID 사용
      //     //   lastMovieId: parseInt(latestMovies[latestMovies.length - 1]?.movieId) || 0,
      //     // },
      //   }
      // );

      // 응답 데이터 구조 확인
      // if (!response.data?.content) {
      //   throw new Error("잘못된 데이터 구조");
      // }

      // setLatestMovies((prev) => [...prev, ...response.data.content]);
      setLatestMovies(response.data.data.content);
      sessionStorage.setItem('latestMovies', JSON.stringify(response.data.data.content));
    } catch (error) {
      console.error("최신 영화 조회 실패:", {
        error: error.response?.data || error.message,
      });
      throw error;
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      await fetchRecommendedMovies();
    } catch (error) {
      console.error("영화 새로고침에 실패했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLatestRefresh = async () => {
    try {
      setLoading(true);
      await fetchLatestMovies();
    } catch (error) {
      console.error("최신 영화 새로고침에 실패했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>영화 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="main-container">
      <h1 className="main-title">영화 추천 목록</h1>
      <div className="movies-section">
        <div className="section-header">
          <h2>맞춤 영화 추천</h2>
          <button className="refresh-button" onClick={handleRefresh}>
            <FaSyncAlt />
          </button>
        </div>
        <div className="movies-grid">
          {recommendedMovies.map((movie) => (
            <div key={movie.movieId} className="movie-card">
              <Link to={`/movie/${movie.movieId}`}>
                <img
                  src={movie.posterImageUrl}
                  alt={movie.title}
                  className="movie-poster"
                  onError={(e) => {
                    e.target.src = LOGO_IMAGE;
                  }}
                />
              </Link>
              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-year">
                  개봉 연도:{" "}
                  {movie.releaseDate
                    ? movie.releaseDate.slice(0, 4)
                    : "정보 없음"}
                </p>
                <p className="movie-genre">
                  장르: {movie.genreList?.join(", ") || "정보 없음"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="movies-section">
        <div className="section-header">
          <h2>최신 영화</h2>
          <button className="refresh-button" onClick={handleLatestRefresh}>
            <FaSyncAlt />
          </button>
        </div>
        <div className="movies-grid">
          {latestMovies.map((movie) => (
            <div key={movie.movieId} className="movie-card">
              <Link to={`/movie/${movie.movieId}`}>
                <img
                  src={movie.posterImageUrl}
                  alt={movie.title}
                  className="movie-poster"
                  onError={(e) => {
                    e.target.src = LOGO_IMAGE;
                  }}
                />
              </Link>
              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-year">
                  개봉 연도:{" "}
                  {movie.releaseDate
                    ? movie.releaseDate.slice(0, 4)
                    : "정보 없음"}
                </p>
                <p className="movie-genre">
                  장르: {movie.genreList?.join(", ") || "정보 없음"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;