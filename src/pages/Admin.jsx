import React, { useEffect, useState } from 'react'
import './Admin.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AdminHeader from '../components/AdminHeader'

const Admin = () => {
    // 최신 영화 목록 저장
    const [newMovieList, setNewMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const imagePath = import.meta.env.VITE_IMAGE_PATH;

    useEffect(() => {
      getNewMovies();
    }, [])

    // 최신 영화 목록 불러오는 함수
    const getNewMovies = async () => {
      try {
        setIsLoading(true);
        const serverResponse = await axios.get("/movies/new-movies?&size=5");
        setNewMovieList(serverResponse.data.data.content);
      }
      catch (error) {
        console.error("최신 영화 목록 가져오기 실패 : ", error);
      }
      finally {
        setIsLoading(false);
      }
    } 

    // 영화 추가 버튼 클릭 시 페이지 이동
    const handleCreateButton = () => {
      navigate('/admin/newMovie');
    }

    return (
      <section className='admin-container'>
          <AdminHeader title="관리자 페이지" showBackButton={false} />
          {
            isLoading && (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>영화 정보를 불러오는 중...</p>
              </div>
            )
          }

          {
            !isLoading && (
              <>
                <div className='admin-title-container'>
                  <h2>최신 영화 정보 관리</h2>
                  <button className='admin-createButton' onClick={handleCreateButton}>영화 추가</button>
                </div>

                <div className='admin-movies-section'>
                  <div className="admin-movies-grid">
                    {
                      newMovieList.map(movie => (
                        <div key={movie.movieId} className="admin-movie-card">
                              <img
                                src={movie.posterImageUrl}
                                alt={movie.title}
                                className="admin-movie-poster"
                                onError={e => {
                                  e.target.src = `${imagePath}/cineaiLogo.png`; }} />
                            <div className="admin-movie-info">
                            <h3 className="admin-movie-title">{movie.title}</h3>
                            <p className="admin-movie-year">
                              개봉 연도:{" "}
                              {movie.releaseDate
                                ? movie.releaseDate.slice(0, 4)
                                : "정보 없음"}
                            </p>
                            <p className="admin-movie-genre">
                              장르: {movie.genreList?.join(", ") || "정보 없음"}
                            </p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </>
            )
          }
          
      </section>
    )
}

export default Admin