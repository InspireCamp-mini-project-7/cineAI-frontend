import React from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminPrivateRoute = ({ children }) => {
    // sessionStorage에서 비밀번호 확인
    const isAuthenticated = sessionStorage.getItem('password'); 
    
    if (!isAuthenticated) {
        Swal.fire({
            icon: 'warning',
            title: '관리자만 접근 가능 !',
            text: '로그인 페이지로 이동합니다.'
        })
        // 일반 사용자가 관리자 페이지에 접근 시도 시 로그인 페이지로 이동
        return <Navigate to="/login" replace />
    }

    return children;
};

export default AdminPrivateRoute;
