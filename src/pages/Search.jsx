import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./Search.css";
import Swal from "sweetalert2";
import { IoIosAddCircleOutline } from "react-icons/io";

const Search = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastPage, setLastPage] = useState(0);
  
  const location = useLocation();
  const scrollRef = useRef(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("query");
    if (query) {
      // 세션 스토리지에서 이 검색어에 대한 캐시 확인
      const cachedData = sessionStorage.getItem(`search_${query}`);
      const cachedLastPage = sessionStorage.getItem(`search_lastPage_${query}`);
      
      if (cachedData && cachedLastPage) {
        // 캐시된 데이터가 있으면 사용
        setMovies(JSON.parse(cachedData));
        setLastPage(parseInt(cachedLastPage));
        setLoading(false);
        setError(null);
      } else {
        // 캐시된 데이터가 없으면 API 호출
        fetchMovies(query, 0);
      }
    }
  }, [location.search]);

  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); // 100ms 딜레이 추가
  }, [movies]);
  

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

        setLastPage(0);
        // 빈 결과도 캐싱 (불필요한 API 호출 방지)
        sessionStorage.setItem(`search_${query}`, JSON.stringify([]));
        sessionStorage.setItem(`search_lastPage_${query}`, '0');
        return;
      }

      let updatedMovies = [];
      
      if (page === 0) {
        updatedMovies = results;
        setMovies(results);
      } else {
        updatedMovies = [...movies, ...results];
        setMovies(updatedMovies);
      }

      // 검색 결과 캐싱
      sessionStorage.setItem(`search_${query}`, JSON.stringify(updatedMovies));
      sessionStorage.setItem(`search_lastPage_${query}`, page.toString());
      
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

  const handleAddClick = async () => {
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
      </div>
      {loading && <div className="search-loading-spinner">로딩 중...</div>}
      {error && <div className="search-error-message">{error}</div>}
      {!loading && !error && (
        <div className="search-movies-container">
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
          <button className="search-add-button" onClick={handleAddClick}>
              <IoIosAddCircleOutline />
          </button>
          <div ref={scrollRef}/>
        </div>
      )}
    </div>
  );
};

export default Search;
