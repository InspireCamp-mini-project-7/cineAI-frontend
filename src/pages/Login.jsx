import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();

    /* 카카오 로그인 접속 */
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=dd30bf01e82d03f8cdae72dccd634374&redirect_uri=http://localhost:5173/auth/kakao/callback&response_type=code`;

    const handleKakaoLogin = () => {
        window.location.href = kakaoAuthUrl;
    };

    // 로그인 성공 후 리디렉션 처리
    const handleLoginSuccess = () => {
        console.log('로그인 성공');
        navigate('/home');
    };

    // 로그인 콜백 처리
    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        console.log('code:', code);

        if (code) {
            // 여기에 카카오 로그인 API 호출 및 토큰 저장 로직 추가
            axios.post('/api/auth/kakao', { code })
                .then(response => {
                    console.log('로그인 API 응답:', response.data);
                    handleLoginSuccess();
                })
                .catch(error => {
                    console.error('로그인 API 호출 실패:', error);
                });
        }
    }, []);

    return (
        <section className='login-container'>
            <img className='login-logo' src='../src/assets/cineaiLogo.png'/>        
            <button className='login-button' onClick={handleKakaoLogin}>
                <img className='login-icon' src='../src/assets/kakaoIcon.png'/>
                <div className='login-text'>카카오 계정 로그인</div>                 
            </button>
        </section>
    );
};

export default Login;