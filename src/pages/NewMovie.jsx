import React from 'react'
import './NewMovie.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'

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

    const navigate = useNavigate();

    // 뒤로 가기 버튼 클릭 시, 관리자 최신 영화 목록 페이지로 이동
    const handleBackButton = () => {
        navigate('/admin');
    }   

    // 포스터 이미지 업로드
    const handleUpload = () => {  

        // API 완성 후 추가
    }

    // 초기화 버튼 클릭 시
    const handleDeleteButton = async () => {
        // 파일 삭제 추가 

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
        }

        Swal.fire({
            icon: 'success',
            title: '입력한 영화 정보 삭제 완료 !',
            text: '입력한 영화 정보가 성공적으로 삭제되었습니다.' 
        });
    }

    // 영화 추가 함수
    const handleSaveButton = async () => {
        const requestData = {
            ...movie,
            directorName: movie.directorName.split(',').map(item => item.trim()),
            castList: movie.castList.split(',').map(item => item.trim()),
            genreList: movie.genreList.split(',').map(item => item.trim())
        };

        console.log('요청 데이터 : ', requestData);

        try {
            await axios.post(
                "http://localhost:8080/movies/create",
                requestData,
                {
                    headers: {
                      'Content-Type': 'application/json'
                    }
                });

            Swal.fire({
                icon: 'success',
                title: '입력한 영화 정보 저장 완료 !',
                text: '입력한 영화 정보가 성공적으로 저장되었습니다.' 
            });

            // 입력 필드 초기화
            setMovie({ 
                title: '',
                directorName: '',
                castList: '',      
                nation: '',
                plot: '',
                genreList: '', 
                releaseDate: ''
            })
        }
        catch (error) {
            console.error("영화 정보 저장 실패 : ", error);
        }
    }

     return (
        <section className='newmovie-container'>
            <header className='newmovie-header'>
                <img className='newmovie-backButton' src='../src/assets/backIcon.png' onClick={handleBackButton} />
                <div className='newmovie-headerText'>관리자 페이지</div>
            </header>
            <h2>최신 영화 추가</h2>
            <div className="newmovie-movie-info">
                <div>
                    <label>포스터 이미지 : </label>
                    {/* <input
                    type="text"
                    placeholder="포스터 URL"
                    value={movie.posterImageUrl}
                    onChange={(e) =>
                        setMovie({ ...movie, posterImageUrl: e.target.value })
                    }
                    /> */}
                    <button className="newmovie-upload-btn" onClick={handleUpload}>
                    📤
                    </button>
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
                    <label>감독 : </label>
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
                    <label>개봉년도 : </label>
                    <input
                    type="text"
                    placeholder="예: 2010"
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