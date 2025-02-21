import React, { useEffect } from 'react'
import './Login.css'
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';


const Login = () => {
    /* 카카오 로그인 접속 */
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=dd30bf01e82d03f8cdae72dccd634374&redirect_uri=http://localhost:8080/auth/kakao/callback&response_type=code`;

    const handleKakaoLogin = () => {
        window.location.href = kakaoAuthUrl;
    };

    /* 리다이렉트 URI로부터 코드 추출 */
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');

    const navigate = useNavigate();

    // const rest_api_host = import.meta.env.VITE_REST_API_HOST;
	// const rest_api_port = import.meta.env.VITE_REST_API_PORT;

    /* 서버에 코드 전송 -> 토큰 받기 */
    const getToken = async (code) => {
        try {
            // API에 코드 전달 및 토큰 추출
            const serverResponse = await axios.post("http://localhost:8080/auth/social-login", 
                { code },
                { headers: {"Content-Type": "application/json"} }
            );

            // accessToken, refreshToken 추출
            const {accessToken, refreshToken} = serverResponse.data.data;
            
            // localStorage에 accessToken 저장 => 추후 변경
            localStorage.setItem("accessToken", accessToken);

            // 로그인 성공 후, 홈 페이지로 이동
            navigate("/home");
        }
        catch (error) {
            console.error("카카오 로그인 실패 : ", error);
        } 
    };

    /* 코드 존재 시, 액세스 토큰 요청 및 서버로 전송 (POST) */
    // code 값 변경될 때마다 useEffect 호출 -> code 존재 시 getToken 호출
    useEffect(() => {
        if(code)
            getToken(code);
    }, [code]);

    return (
        <section className='login-container'>
            <img className='login-logo' src='../src/assets/cineaiLogo.png'/>        
            <button className='login-button' onClick={handleKakaoLogin}>
                <img className='login-icon' src='../src/assets/kakaoIcon.png'/>
                <div className='login-text'>카카오 계정 로그인</div> 
            </button>
        </section>
    )
}

export default Login