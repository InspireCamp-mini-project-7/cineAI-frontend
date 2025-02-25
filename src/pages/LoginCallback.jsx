import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import './LoginCallback.css'

const LoginCallback = () => {
    /* 리다이렉트 URI로부터 코드 추출 */
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');

    const navigate = useNavigate();

    /* 서버에 코드 전송 -> 토큰 받기 */
    const getToken = async (code) => {
        try {
            // API에 코드 전달 및 토큰 추출
            const serverResponse = await axios.post("/auth/social-login", 
                { code });

            // accessToken 추출
            const { accessToken } = serverResponse.data.data;
            
            // sessionStorage에 accessToken 저장 => 추후 변경
            sessionStorage.setItem("accessToken", accessToken);
            
            // 첫 로그인이 아니면 홈 페이지로 이동
            if(serverResponse.data.data.loginStatus === "NOTFIRST")
                navigate("/home");
            // 첫 로그인이면 선호 영화 조사 페이지로 이동
            else if(serverResponse.data.data.loginStatus === "FIRST")
                navigate("/preference");
        }
        catch (error) {
            console.error("카카오 로그인 실패 : ", error);
            navigate("/");      // 로그인 실패 시 로그인 페이지로 이동
        } 
    };

    /* 코드 존재 시, 액세스 토큰 요청 및 서버로 전송 (POST) */
    // code 값 변경될 때마다 useEffect 호출 -> code 존재 시 getToken 호출
    useEffect(() => {
        if(code)
            getToken(code);
        else
            navigate("/")       // code 없으면 로그인 페이지로 이동
    }, [code]);

    return (
        <div className="loginCallback-container">
            <h1>로그인 중 . . .</h1>
        </div>
    )
}

export default LoginCallback