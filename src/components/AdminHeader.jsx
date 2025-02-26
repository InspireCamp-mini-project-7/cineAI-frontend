import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './AdminHeader.css';

const AdminHeader = ({ title }) => {
    const navigate = useNavigate();
    const imagePath = import.meta.env.VITE_IMAGE_PATH;

    const handleBackButtonClick = () => {
        navigate(-1);
    };

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

            sessionStorage.removeItem('password');
            navigate('/');
        }
    };

    return (
        <header className='admin-header'>
            <img 
                className='admin-back-button' 
                src={`${imagePath}/backIcon.png`} 
                onClick={handleBackButtonClick}
                alt="뒤로 가기"
            />
            <div className='admin-header-text'>{title}</div>
            <div className="admin-logout-container">
                <button className="admin-logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt />
                    <span>로그아웃</span>
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;