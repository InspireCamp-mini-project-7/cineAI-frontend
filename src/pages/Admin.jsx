import React, { useEffect, useState } from 'react'
import './Admin.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

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

        // 영화 전체 정보 불러오기 
        //await axios.get("http://localhost:8080/movies/upload");
        const serverResponse =  await axios.get("http://localhost:8080/movies/new-movies?&size=30");
        setNewMovieList(serverResponse.data.data.content);
        console.log("new movie list : ", serverResponse.data.data.content);
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
      Swal.fire({
        icon: 'success',
        title: '로그아웃 완료 !',
        text: '로그아웃에 성공하여 로그인 페이지로 이동합니다.'
      });

      // sessionStroage에서 토큰 제거
      sessionStorage.removeItem('password');

      // 로그인 페이지로 이동
      navigate('/');
    }
  }

    return (
      <section className='admin-container'>
          <header className='admin-header'>
              <div className='admin-headerText'>관리자 페이지</div>
              <div className="admin-logout-container">
                  <button className="admin-logout-btn" onClick={handleLogout}>
                      <FaSignOutAlt />
                      <span>로그아웃</span>
                  </button>
              </div>
          </header>
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
                          {/* <div className="admin-movie-title">{movie.title || "제목 없음"}</div> */}
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