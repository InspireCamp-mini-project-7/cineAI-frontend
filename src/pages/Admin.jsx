import React, { useEffect, useState } from 'react'
import './Admin.css'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Admin = () => {

    // 최신 영화 목록 저장
    const [newMovieList, setNewMovieList] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
      getNewMovies();
    }, [])

    // 최신 영화 목록 불러오는 함수
    const getNewMovies = async () => {
      try {
        const serverResponse =  await axios.get("http://localhost:8080/movies/new-movies?&size=30");
        setNewMovieList(serverResponse.data.data.content);
        console.log("new movie list : ", serverResponse.data.data.content);
      }
      catch (error) {
        console.error("최신 영화 목록 가져오기 실패 : ", error);
      }
    } 

    // 영화 추가 버튼 클릭 시 페이지 이동
    const handleCreateButton = () => {
      navigate('/admin/newMovie');
    }

    return (
      <section className='admin-container'>
          <header className='admin-header'>
              <div className='admin-headerText'>관리자 페이지</div>
          </header>
          <div className='admin-title-container'>
            <h2>최신 영화 정보 관리</h2>
            <button className='admin-createButton' onClick={handleCreateButton}>영화 추가</button>
          </div>

          <div className='admin-movies-section'>
            <div className="admin-movies-grid">
              {newMovieList.map(movie => (
                <div key={movie.movieId} className="admin-movie-card">
                    {/* <Link to={`/movie/${movie.movieId}`}> */}
                      <img
                        src={movie.posterImageUrl}
                        alt={movie.title}
                        className="admin-movie-poster"
                        onError={e => {
                          e.target.src = '../src/assets/cineaiLogo.png'; }} />
                      {/* </Link> */}
                  <div className="movie-title">{movie.title || "제목 없음"}</div>
                </div>
              ))}
            </div>
          </div>
      </section>
    )
}

export default Admin