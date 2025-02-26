import React from 'react'
import './NewMovie.css'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'
import { FaSignOutAlt } from 'react-icons/fa' 
import AdminHeader from '../components/AdminHeader'

const NewMovie = () => {
    // 영화 정보를 요청 데이터 구조에 맞게 상태로 관리
    const [movie, setMovie] = useState({
        title: '',
        directorName: '',
        castList: '',      
        nation: '',
        plot: '',
        genreList: '',    
        releaseDate: ''
    });

    // 업로드할 이미지 파일
    const [posterFile, setPosterFile] = useState(null);
    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    const imagePath = import.meta.env.VITE_IMAGE_PATH;
    
    // 뒤로 가기 버튼 클릭 시, 관리자 최신 영화 목록 페이지로 이동
    const handleBackButtonClick = () => {
        navigate('/admin');
    }   

    // 포스터 업로드 버튼 클릭 시 파일 선택창 열기
    const handleUploadButtonClick = () => {
        fileInputRef.current?.click();
    };

    // 파일 선택 시 상태에 파일 정보 저장
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPosterFile(file); // 파일 객체 자체 저장
        }
    };

    // 초기화 버튼 클릭 시
    const handleDeleteButton = async () => {
        const result = await Swal.fire({
            title: "입력 내용을 삭제하시겠습니까?",
            text: "삭제 후 복구가 불가능합니다.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "네, 삭제할래요",
            cancelButtonText: "취소"
        })

        if(result.isConfirmed) {
            setMovie({ 
                title: '',
                directorName: '',
                castList: '',      
                nation: '',
                plot: '',
                genreList: '', 
                releaseDate: ''
            })

            setPosterFile(null);

            Swal.fire({
                icon: 'success',
                title: '입력한 영화 정보 삭제 완료 !',
                text: '입력한 영화 정보가 성공적으로 삭제되었습니다.' 
            });
        }
    }

    // 영화 추가 함수
    const handleSaveButton = async () => {
        const formData = new FormData();
    
        // 문자열 데이터 추가
        formData.append('title', movie.title);
        formData.append('nation', movie.nation);
        formData.append('plot', movie.plot);
        formData.append('releaseDate', movie.releaseDate);

        movie.directorName.split(',').map(item => item.trim()).forEach(director => {
            formData.append('directorName', director);
        });
    
        movie.castList.split(',').map(item => item.trim()).forEach(cast => {
            formData.append('castList', cast);
        });
    
        movie.genreList.split(',').map(item => item.trim()).forEach(genre => {
            formData.append('genreList', genre);
        });

        // 파일 추가
        if (posterFile) {
            formData.append('posterImage', posterFile);
        }

        try {
            await axios.post("/movies/create", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            Swal.fire({
                icon: 'success',
                title: '영화 정보 저장 완료!',
                text: '입력한 영화 정보가 성공적으로 저장되었습니다.'
            }).then(() => {
                setMovie({
                    title: '',
                    directorName: '',
                    castList: '',
                    nation: '',
                    plot: '',
                    genreList: '',
                    releaseDate: ''
                });
                setPosterFile(null);

                // 추가 시 관리자 페이지로 이동
                navigate(-1);
            });
            
        } 
        catch (error) {
            console.error("영화 정보 저장 실패:", error);
            Swal.fire({
                icon: 'error',
                title: '저장 실패!',
                text: '모든 값을 입력했는지 다시 확인해주세요.'
            });
        }
    };
    
    // 로그아웃 처리 함수
      const handleLogout = async () => {
        const result = await Swal.fire({
          title: "로그아웃 하시겠습니까?",
          text: "작성하신 내용이 모두 삭제됩니다.",
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
        <section className='newmovie-container'>
            <AdminHeader title="관리자 페이지" />
            <h2>최신 영화 추가</h2>
            <div className="newmovie-movie-info">
                <div>
                    <label>포스터 이미지 : </label>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange} 
                    />

                    <button className="newmovie-upload-btn" onClick={handleUploadButtonClick}>
                    📤 파일 선택
                    </button>

                    {posterFile && <span>📁 {posterFile.name}</span>}
                </div>

                <div>
                    <label>제목 : </label>
                    <input
                    type="text"
                    placeholder="영화 제목"
                    value={movie.title}
                    onChange={(e) =>
                        setMovie({ ...movie, title: e.target.value })
                    }
                    />
                </div>

                <div>
                    <label>감독 (쉼표로 구분) : </label>
                    <input
                    type="text"
                    placeholder="감독 이름"
                    value={movie.directorName}
                    onChange={(e) =>
                        setMovie({ ...movie, directorName: e.target.value })
                    }
                    />
                </div>

                <div>
                    <label>출연 배우 (쉼표로 구분) : </label>
                    <input
                    type="text"
                    placeholder="예: 레오나르도 디카프리오, 조셉 고든-레빗, 엘렌 페이지"
                    value={movie.castList}
                    onChange={(e) =>
                        setMovie({ ...movie, castList: e.target.value })
                    }
                    />
                </div>

                <div>
                    <label>국가 : </label>
                    <input
                    type="text"
                    placeholder="제작 국가"
                    value={movie.nation}
                    onChange={(e) =>
                        setMovie({ ...movie, nation: e.target.value })
                    }
                    />
                </div>

                <div>
                    <label>장르 (쉼표로 구분) : </label>
                    <input
                    type="text"
                    placeholder="예: 과학 영화, 액션, 모험"
                    value={movie.genreList}
                    onChange={(e) =>
                        setMovie({ ...movie, genreList: e.target.value })
                    }
                    />
                </div>

                <div>
                    <label>개봉일 : </label>
                    <input
                    type="text"
                    placeholder="예: 20101225"
                    value={movie.releaseDate}
                    onChange={(e) =>
                        setMovie({ ...movie, releaseDate: e.target.value })
                    }
                    />
                </div>
            </div>

            <div className="newmovie-plot-section">
                <h3>줄거리</h3>
                <textarea
                    placeholder="줄거리 입력"
                    value={movie.plot}
                    onChange={(e) =>
                    setMovie({ ...movie, plot: e.target.value })
                    }
                ></textarea>
            </div>

            <div className='newmovie-button-container'>
                <button className='newmovie-deleteButton' onClick={handleDeleteButton}>초기화</button>
                <button className='newmovie-saveButton' onClick={handleSaveButton}>저장</button>
            </div>
        </section>
    )
}

export default NewMovie