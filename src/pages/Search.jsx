import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./Search.css";
import Swal from "sweetalert2";
import { FaSyncAlt } from "react-icons/fa";

const Search = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastPage, setLastPage] = useState(0);
  
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("query");
    if (query) {
      fetchMovies(query, 0);
    }
  }, [location.search]);

  const fetchMovies = async (query, page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/movies/search`, {
        params: {
          keyword: query,
          page: page, 
          limit: 5, // 한 번에 가져올 영화 개수
        },
      });

      const results = response.data?.data?.list || [];

      if(results.length === 0) {
        Swal.fire({
          icon: 'info',
          title: '검색 결과 없음 !',
          text: '검색 결과가 존재하지 않습니다.'
        })

        // 검색 결과가 없을 경우, lastPage 0으로 초기화
        setLastPage(0);
        return;
      }

      if (page === 0) {
        setMovies(results); // 첫 페이지면 새로운 목록으로 교체
      } else {
        setMovies((prevMovies) => [...prevMovies, ...results]); // 페이지 추가 시 기존 목록에 더하기
      }

      setLastPage(page);
    } 
    catch (error) {
      console.error("영화 정보를 불러오는 데 실패했습니다:", error);
      setError("영화 데이터를 불러오는 중 오류가 발생했습니다.");
    } 
    finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    const query = new URLSearchParams(location.search).get("query");
    if (!query) return;
    
    try {
      setLoading(true);
      await fetchMovies(query, lastPage + 1);
    } 
    catch (error) {
      console.error("영화 새로고침에 실패했습니다:", error);
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <div className="search-section-header">
        <h1 className="search-title">검색 결과</h1>
        <button className="search-refresh-button" onClick={handleRefresh}>
          <FaSyncAlt />
        </button>
      </div>
      {loading && <div className="search-loading-spinner">로딩 중...</div>}
      {error && <div className="search-error-message">{error}</div>}
      {!loading && !error && (
        
        <div className="search-movies-grid">
          {
            movies.map((movie) => (
              <div key={movie.movieId} className="search-movie-card">
                <Link to={`/movie/${movie.movieId}`}>
                  <img
                    src={movie.posterImageUrl}
                    alt={movie.title}
                    className="search-movie-poster"
                  />
                </Link>
                <div className="search-movie-info">
                  <h3 className="search-movie-title">{movie.title}</h3>
                  <p className="search-movie-year">
                    개봉 연도:{" "}
                    {movie.releaseDate
                      ? movie.releaseDate.slice(0, 4)
                      : "정보 없음"}
                  </p>
                  <p className="search-movie-genre">
                    장르: {movie.genreList?.join(", ") || "정보 없음"}
                  </p>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};

export default Search;
