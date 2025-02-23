import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./Search.css";
import { API_KEY, BASE_URL, PLACEHOLDER_IMAGE, LOGO_IMAGE } from "../constants";

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
      const [titleResponse, actorResponse, directorResponse, genreResponse] =
        await Promise.all([
          axios.get(BASE_URL, {
            params: {
              collection: "kmdb_new2",
              ServiceKey: API_KEY,
              type: "극영화",
              listCount: 100,
              sort: "prodYear,1",
              releaseDts: "20100101",
              releaseDte: "20251231",
              title: query, // 제목에 검색어 포함
            },
          }),
          axios.get(BASE_URL, {
            params: {
              collection: "kmdb_new2",
              ServiceKey: API_KEY,
              type: "극영화",
              listCount: 100,
              sort: "prodYear,1",
              releaseDts: "20100101",
              releaseDte: "20251231",
              director: query, // 감독에 검색어 포함
            },
          }),
          axios.get(BASE_URL, {
            params: {
              collection: "kmdb_new2",
              ServiceKey: API_KEY,
              type: "극영화",
              listCount: 100,
              sort: "prodYear,1",
              releaseDts: "20100101",
              releaseDte: "20251231",
              actor: query, // 배우에 검색어 포함
            },
          }),
          /*axios.get(BASE_URL, {
          params: {
            collection: "kmdb_new2",
            ServiceKey: API_KEY,
            type: "극영화",
            listCount: 100,
            sort: "prodYear,1",
            releaseDts: "20100101",
            releaseDte: "20251231",
            genre: query, // 장르에 검색어 포함
          },
        }),*/
        ]);

      const titleResults = titleResponse.data.Data?.[0]?.Result || [];
      const actorResults = actorResponse.data.Data?.[0]?.Result || [];
      const directorResults = directorResponse.data.Data?.[0]?.Result || [];
      // const genreResults = genreResponse.data.Data?.[0]?.Result || [];

      // 제목, 배우, 감독, 장르 검색 결과를 합치고 중복 제거
      const combinedResults = [
        ...titleResults,
        ...actorResults,
        ...directorResults,
        //  ...genreResults,
      ];
      const uniqueResults = Array.from(
        new Set(combinedResults.map((movie) => movie.movieSeq))
      ).map((id) => combinedResults.find((movie) => movie.movieSeq === id));

      setMovies(uniqueResults);
      console.log("검색된 영화 수:", uniqueResults.length);
    } catch (error) {
      console.error("영화 정보를 불러오는 데 실패했습니다:", error);
      setError("영화 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getPosterUrl = (posters) => {
    if (!posters) return null;
    const firstPoster = posters.split("|")[0];
    return firstPoster.startsWith("http")
      ? firstPoster
      : `http://${firstPoster}`;
  };

  const highlightText = (text) => {
    if (!text) return "";
    return text
      .replace(/!HS/g, '<span class="highlight">')
      .replace(/!HE/g, "</span>");
  };

  return (
    <div className="search-container">
      {loading && <div className="search-loading-spinner">로딩 중...</div>}
      {error && <div className="search-error-message">{error}</div>}
      {!loading && !error && (
        <div className="search-movies-grid">
          {movies.map((movie) => (
            <div key={movie.movieSeq} className="search-movie-card">
              <Link to={`/movie/${movie.movieSeq}`}>
                <img
                  src={getPosterUrl(movie.posters)}
                  alt={movie.title}
                  className="search-movie-poster"
                />
              </Link>
              <div className="search-movie-info">
                <h3
                  className="search-movie-title"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(movie.title),
                  }}
                />
                <p className="search-movie-director">
                  감독:{" "}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: highlightText(
                        movie.directors?.director?.[0]?.directorNm ||
                          "정보 없음"
                      ),
                    }}
                  />
                </p>
                <p className="search-movie-year">개봉 연도: {movie.prodYear}</p>
                <p className="search-movie-genre">장르: {movie.genre}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
