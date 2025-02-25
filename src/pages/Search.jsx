import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./Search.css";
import { BASE_URL, LOGO_IMAGE } from "../constants";
import Swal from "sweetalert2";

const Search = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("query");
    if (query) {
      fetchMovies(query);
    }
  }, [location.search]);

  const fetchMovies = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/movies/search`, {
        params: {
          keyword: query,
          page: 0, // 기본 첫 페이지
          limit: 5, // 한 번에 가져올 영화 개수
        },
      });

      const results = response.data?.data?.list || [];
      setMovies(results);

      if(results.length === 0) {
        Swal.fire({
          icon: 'info',
          title: '검색 결과 없음 !',
          text: '검색 결과가 존재하지 않습니다.'
        })
      }
    } 
    catch (error) {
      console.error("영화 정보를 불러오는 데 실패했습니다:", error);
      setError("영화 데이터를 불러오는 중 오류가 발생했습니다.");
    } 
    finally {
      setLoading(false);
    }
  };

  const getPosterUrl = (posterUrl) => {
    return posterUrl || LOGO_IMAGE;
  };

  return (
    <div className="search-container">
      {loading && <div className="search-loading-spinner">로딩 중...</div>}
      {error && <div className="search-error-message">{error}</div>}
      {!loading && !error && (
        <div className="search-movies-grid">
          {
            movies.map((movie) => (
              <div key={movie.movieId} className="search-movie-card">
                <Link to={`/movie/${movie.movieId}`}>
                  <img
                    src={getPosterUrl(movie.posterImageUrl)}
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
