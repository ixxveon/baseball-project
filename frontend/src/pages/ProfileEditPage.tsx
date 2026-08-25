import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileEditPage(): React.JSX.Element {
    const navigate = useNavigate();

    // 상태 관리
    const [nickname, setNickname] = useState('위닝요정');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // 📌 닉네임 변경 핸들러 (2~10자 검사)
    const handleNicknameChange = () => {
        const trimmedNickname = nickname.trim();

        if (trimmedNickname.length < 2 || trimmedNickname.length > 10) {
            alert('닉네임은 2~10자로 입력해주세요.');
            return;
        }

        alert(`닉네임이 '${trimmedNickname}'(으)로 변경 요청되었습니다! (API 연동 필요)`);
    };

    // 📌 비밀번호 변경 핸들러 (영문, 숫자 포함 8자리 검사)
    const handlePasswordChange = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('모든 비밀번호 항목을 입력해주세요.');
            return;
        }

        // 비밀번호 정규식: 최소 8자리 이상, 영문(대소문자)과 숫자가 최소 1개씩 포함되어야 함
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;

        if (!passwordRegex.test(newPassword)) {
            alert('새 비밀번호는 영문과 숫자를 포함하여 8자리 이상으로 입력해주세요.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        alert('비밀번호 변경 요청되었습니다! (API 연동 필요)');
    };

    return (
        <div className="profile-edit-container">
            <style>
                {`
          .profile-edit-container { background-color: #F4F6F8; min-height: 100vh; font-family: 'Pretendard', sans-serif; padding-bottom: 80px; }
          .header-nav { background: #fff; padding: 16px 20px; display: flex; align-items: center; border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; z-index: 10; }
          .btn-back { background: none; border: none; font-size: 20px; cursor: pointer; color: #111827; padding: 4px; display: flex; align-items: center; justify-content: center; }
          .header-title { font-size: 18px; font-weight: 700; color: #111827; flex: 1; text-align: center; margin-right: 24px; }
          
          .edit-content { max-width: 600px; margin: 24px auto; padding: 0 16px; display: flex; flex-direction: column; gap: 24px; }
          .edit-section { background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); border: 1px solid #f3f4f6; }
          .section-title { font-size: 18px; font-weight: 800; color: #111827; margin: 0 0 20px 0; border-bottom: 2px solid #f3f4f6; padding-bottom: 12px; }
          
          .form-group { margin-bottom: 16px; }
          .form-label { display: block; font-size: 14px; font-weight: 600; color: #4b5563; margin-bottom: 8px; }
          .input-wrap { display: flex; gap: 8px; }
          .form-input { flex: 1; padding: 14px 16px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 15px; transition: all 0.2s; }
          .form-input:focus { outline: none; border-color: #E6002D; box-shadow: 0 0 0 3px rgba(230,0,45,0.1); }
          
          .btn-action { padding: 14px 20px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background 0.2s; border: none; }
          .btn-check { background: #f3f4f6; color: #374151; white-space: nowrap; }
          .btn-check:hover { background: #e5e7eb; }
          .btn-submit { width: 100%; background: #111827; color: #fff; margin-top: 8px; font-size: 15px; }
          .btn-submit:hover { background: #1f2937; }
        `}
            </style>

            <header className="header-nav">
                <button className="btn-back" onClick={() => navigate(-1)}>←</button>
                <div className="header-title">프로필 수정</div>
            </header>

            <div className="edit-content">
                {/* 1. 닉네임 변경 섹션 */}
                <section className="edit-section">
                    <h2 className="section-title">닉네임 변경</h2>
                    <div className="form-group">
                        <label className="form-label">새로운 닉네임</label>
                        <div className="input-wrap">
                            <input
                                type="text"
                                className="form-input"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="2~10자 이내로 입력해주세요"
                            />
                            <button className="btn-action btn-check" onClick={() => alert('사용 가능한 닉네임입니다.')}>중복 확인</button>
                        </div>
                    </div>
                    <button className="btn-action btn-submit" onClick={handleNicknameChange}>닉네임 변경하기</button>
                </section>

                {/* 2. 비밀번호 변경 섹션 */}
                <section className="edit-section">
                    <h2 className="section-title">비밀번호 변경</h2>
                    <div className="form-group">
                        <label className="form-label">현재 비밀번호</label>
                        <input
                            type="password"
                            className="form-input"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="현재 사용 중인 비밀번호"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">새 비밀번호</label>
                        <input
                            type="password"
                            className="form-input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="영문, 숫자 포함 8자리 이상"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">새 비밀번호 확인</label>
                        <input
                            type="password"
                            className="form-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="새 비밀번호를 다시 입력해주세요"
                        />
                    </div>
                    <button className="btn-action btn-submit" onClick={handlePasswordChange}>비밀번호 변경하기</button>
                </section>
            </div>
        </div>
    );
}