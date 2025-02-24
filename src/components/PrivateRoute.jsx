import React from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const PrivateRoute = ({ children }) => {
    // sessionStorage에서 인증 토큰 확인
    const isAuthenticated = sessionStorage.getItem('accessToken'); 
    
    if (!isAuthenticated) {
        Swal.fire({
            icon: 'warning',
            title: '로그인 후 접근해주세요 !',
            text: '로그인 페이지로 이동합니다.'
        })
        // 로그인하지 않은 사용자가 다른 페이지에 접근 시도 시
        // 로그인 페이지로 이동
        return <Navigate to="/login" replace />
    }

    return children;
};

export default PrivateRoute;
