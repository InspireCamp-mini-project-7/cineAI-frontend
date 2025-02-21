import React, { useState, useEffect } from 'react'
import './Profile.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {

    const navigate = useNavigate();

    // 현재 탭 저장 상태 변수
    const [activeTab, setActiveTab] = useState("account");

    // 닉네임 수정 아이콘 클릭 상태 저장 변수
    const [clickNickname, setclickNickname] = useState(false);

    // 현재 닉네임 저장 상태 변수
    const [nickname, setNickname] = useState("");

    // 서버에서 받은 데이터 저장 상태 변수
    const [userInfo, setUserInfo] = useState(null);
    const [likeList, setLikeList] = useState([]);

    // 탭 변경 함수
    const handleTabChange = tab => setActiveTab(tab);

    // 닉네임 수정 아이콘 클릭 여부 변경 함수
    const handleNicknameClick = click => setclickNickname(click);

    // 닉네임 수정 버튼 클릭 시 실행 함수
    const updateNickname = async () => {
        // nickname 값이 null이 아니면 수정 요청
        if(nickname) {
            try {
                const serverResponse = await axios.patch("http://localhost:8080/members/me/edit", {
                    nickname: nickname
                });
    
                // 닉네임 변경 요청 성공 시
                if(serverResponse.status === 200) 
                    console.log("닉네임 변경 성공");
            }
            catch (error) {
                console.error("닉네임 변경 실패 : ", error);
            }  
        }
        else {
            alert("닉네임을 입력하세요 !");
        }
    }

    // 사용자 정보 요청 함수
    const getUserInfo = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const serverResponse = await axios.get("http://localhost:8080/members/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(serverResponse.data.success)
                setUserInfo(serverResponse.data.data);
        }
        catch (error) {
            console.error("회원 정보 로딩 실패 : ", error);
        } 
    }

    // 찜 목록 요청 함수
    const getLikeList = async () => {
        try {
            const serverResponse = await axios.get("http://localhost:8080/members/list");
            setLikeList(serverResponse.data);
        }
        catch (error) {
            console.error("찜한 영화 목록 로딩 실패 : ", error);
        }
    }

    // 홈페이지 이동 함수
    const moveToHome = () => {
        navigate("/home");
    }
    
    // 회원 탈퇴 함수
    const deleteUser = async () => {
        alert("계정을 삭제하시겠습니까 ?");

        const token = localStorage.getItem("accessToken");

        try {
            const serverResponse = await axios.delete("http://localhost:8080/members/withdrawl", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(serverResponse.data.success)
                setUserInfo(serverResponse.data.data);
        }
        catch (error) {
            console.error("회원 탈퇴 실패 : ", error);
        } 
    }

    // activeTab 변경될 때만 useEffect 호출
    useEffect(() => {
        // 현재 탭이 account인 경우, 사용자 정보 불러옴
        if(activeTab === 'account')
            getUserInfo();
        // 현재 탭이 preference인 경우, 사용자 찜 목록 불러옴
        else if(activeTab === 'preference')
            getLikeList();
    }, [activeTab])



    return (
        <section className='profile-container'>
            <header className='profile-header'>
                <img className='profile-homeIcon' src='./src/assets/homeIcon.png' onClick={moveToHome}></img>
                <div className='profile-headerText'>회원 정보 관리</div>
            </header>
            <main className='profile-main'>
                <aside className='profile-sidebar'>
                    <ul>
                        <li className={activeTab === 'account' ? 'active' : ''}
                            onClick={() => handleTabChange('account')}>
                            <img src='./src/assets/keyIcon.png'/>
                            <div>계정 정보</div>
                        </li>
                        <li className={activeTab === 'preference' ? 'active' : ''}
                            onClick={() => handleTabChange('preference')}>
                            <img src='./src/assets/heartIcon.png'/>
                            <div>영화 찜 목록</div>
                        </li>
                    </ul>
                </aside>

                <section className='profile-content'>
                    {activeTab === 'account' && (
                        <>
                            <h2>계정 정보</h2>
                            <div className='profile-account'>
                                    <div><strong>닉네임</strong></div>
                                    <div>홍길동</div>
                                    <img className='profile-editIcon' src='./src/assets/editIcon.png'
                                         onClick={() => handleNicknameClick(!clickNickname)}/><br />
                                        {clickNickname ? (
                                            <>
                                                <div><strong>닉네임 변경</strong></div>
                                                <input className='profile-editNickname' type='text' value={nickname} onChange={e => setNickname(e.target.value)}/>
                                                <button className='profile-editButton' onClick={updateNickname}>수정</button><br /> 
                                            </>    
                                            ) : (<></>)
                                        }
                                    
                                    <div><strong>이메일</strong></div> 
                                    <div>hong@test.com</div><br/>
                                    <button className='profile-deleteButton' onClick={deleteUser}>회원 탈퇴</button>
                            </div>
                            {userInfo && (
                                <div className='profile-account'>
                                    <div><strong>닉네임</strong></div>
                                    <div>{userInfo.nickName}</div>
                                    <img className='profile-editIcon' src='./src/assets/editIcon.png'
                                         onClick={() => handleNicknameClick(!clickNickname)}/><br />
                                        {clickNickname ? (
                                            <>
                                                <div><strong>닉네임 변경</strong></div>
                                                <input className='profile-editNickname' type='text' value={nickname} onChange={e => setNickname(e.target.value)}/>
                                                <button className='profile-editButton' onClick={updateNickname}>수정</button><br /> 
                                            </>    
                                            ) : (<></>)
                                        }
                                    <div><strong>이메일</strong></div> 
                                    <div>{userInfo.email}</div>
                                    <button className='profile-deleteButton'>회원 탈퇴</button>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'preference' && (
                        <div className='profile-preference'>
                            <h2>찜한 영화 목록</h2>
                            <ul>
                                {likeList.length > 0 ? (
                                        likeList.map((movie, index) => (
                                            <li key={index}> {movie.title} </li>
                                        ))
                                    ) 
                                    : (
                                        <p>찜한 영화가 존재하지 않습니다.</p>
                                    )
                                }
                            </ul>
                        </div>    
                    )}
                </section>
            </main>
        </section>
    )
}

export default Profile