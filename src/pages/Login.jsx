import React from 'react'
import './Login.css'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    /* 카카오 로그인 접속 */
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=dd30bf01e82d03f8cdae72dccd634374&redirect_uri=${import.meta.env.VITE_KAKAO_CALLBACK_URL}&response_type=code`;

    const handleKakaoLogin = () => {
        window.location.href = kakaoAuthUrl;
    };
    
    const navigate = useNavigate();

    const imagePath = import.meta.env.VITE_IMAGE_PATH;

    const handleAdminLogin = async () => {
        const { value: password } = await Swal.fire({
            title: '관리자 로그인',
            input: 'password',
            inputLabel: '비밀번호를 입력하세요',
            inputPlaceholder: '비밀번호',
            showCancelButton: true,
            confirmButtonText: '로그인',
            cancelButtonText: '취소'
        });

        if (password) {
            try {
                // sessionStorage에 관리자 비밀번호 저장
                sessionStorage.setItem('password', password);

                const serverResponse = await axios.post("/members/admin-login", { password });
                if(serverResponse.data.status === 200) {
                     // 로그인 성공 시, 관리자 페이지로 이동
                    Swal.fire({
                        icon: 'success',
                        title: '관리자 로그인 성공 !',
                        text: '관리자 페이지로 이동합니다.'
                    }).then(() => {
                        navigate('/admin');
                    });
                }
            }
            catch (error) {
                console.error("관리자 로그인 실패 : ", error);
                Swal.fire({
                    icon: 'error',
                    title: '관리자 로그인 실패 !',
                    text: '비밀번호가 틀렸습니다.'
                });
            }
        }
    };

    return (
        <>
            <button className='login-admin' onClick={handleAdminLogin}>관리자</button>
            <section className='login-container'>
                <img className='login-logo' src={`${imagePath}/cineaiLogo.png`}/>        
                <button className='login-button' onClick={handleKakaoLogin}>
                    <img className='login-icon' src={`${imagePath}/kakaoIcon.png`} />
                    <div className='login-text'>카카오 계정 로그인</div>                 
                </button>
            </section>
        </>
    )
}

export default Login
