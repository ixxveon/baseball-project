import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNicknameForm } from '../hooks/useNicknameForm';
import { useTeamPreferenceForm } from '../hooks/useTeamPreferenceForm';
import { usePasswordForm } from '../hooks/usePasswordForm';
import { KBO_TEAMS } from '../constants/teams';
import { useWithdraw } from '../hooks/useWithdraw';

export default function ProfileEditPage(): React.JSX.Element {
    const navigate = useNavigate();
    const nicknameForm = useNicknameForm();
    const preferenceForm = useTeamPreferenceForm();
    const passwordForm = usePasswordForm();
    const withdrawAction = useWithdraw();

    return (
        <div className="profile-edit-container">
            <style>
                {`
          .profile-edit-container { background-color: #F4F6F8; min-height: 100vh; font-family: 'Pretendard', sans-serif; padding-bottom: 80px; }
          .header-nav { background: #fff; padding: 16px 20px; display: flex; align-items: center; border-bottom: 1px solid #e5e7eb; position: sticky; top: 64px; z-index: 10; }
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
          .form-group > .form-input { width: 100%; box-sizing: border-box; }
          .toggle-row { display: flex; align-items: center; gap: 10px; font-size: 15px; color: #374151; cursor: pointer; }
          .form-input.input-error { border-color: #e71937; }
          .field-message { display: block; margin-top: 6px; }
          .btn-withdraw { align-self: center; background: none; border: none; color: #9ca3af; font-size: 13px; text-decoration: underline; text-underline-offset: 3px; padding: 8px; }
          .btn-withdraw:hover { color: #6b7280; }
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
                        <label className="form-label" htmlFor="nickname">새로운 닉네임</label>
                        <div className="input-wrap">
                            <input
                                id="nickname"
                                ref={nicknameForm.inputRef}
                                type="text"
                                className={`form-input${nicknameForm.message?.type === 'error' ? ' input-error' : ''}`}
                                value={nicknameForm.nickname}
                                onChange={(e) => nicknameForm.changeInput(e.target.value)}
                                placeholder="2~10자 이내로 입력해주세요"
                            />
                            <button className="btn-action btn-check" onClick={nicknameForm.checkNickname}>중복 확인</button>
                        </div>
                        {nicknameForm.message && (
                            <span className={`field-message ${nicknameForm.message.type === 'error' ? 'auth-error' : 'auth-success'}`}>
                                {nicknameForm.message.text}
                            </span>
                        )}
                    </div>
                    <button className="btn-action btn-submit" onClick={nicknameForm.changeNickname}>닉네임 변경하기</button>
                </section>

                <section className="edit-section">
                    <h2 className="section-title">응원 설정</h2>
                    <div className="form-group">
                        <label className="form-label" htmlFor="favoriteTeam">최애 구단</label>
                        <select
                            id="favoriteTeam"
                            className="form-input"
                            value={preferenceForm.favoriteTeamId ?? ''}
                            onChange={(e) => preferenceForm.setFavoriteTeamId(e.target.value ? Number(e.target.value) : null)}
                        >
                            <option value="">구단을 선택해주세요</option>
                            {KBO_TEAMS.map((team) => (
                                <option key={team.id} value={team.id}>{team.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="toggle-row">
                            <input
                                type="checkbox"
                                checked={preferenceForm.pushAlarm}
                                onChange={(e) => preferenceForm.setPushAlarm(e.target.checked)}
                            />
                            <span>경기 알림 받기</span>
                        </label>
                    </div>
                    <button className="btn-action btn-submit" onClick={preferenceForm.savePreference}>설정 저장하기</button>
                </section>

                {/* 2. 비밀번호 변경 섹션 */}
                <section className="edit-section">
                    <h2 className="section-title">비밀번호 변경</h2>
                    <div className="form-group">
                        <label className="form-label">현재 비밀번호</label>
                        <input
                            type="password"
                            className="form-input"
                            value={passwordForm.currentPassword}
                            onChange={(e) => passwordForm.setCurrentPassword(e.target.value)}
                            placeholder="현재 사용 중인 비밀번호"
                            autoComplete="current-password"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">새 비밀번호</label>
                        <input
                            type="password"
                            className="form-input"
                            value={passwordForm.newPassword}
                            onChange={(e) => passwordForm.setNewPassword(e.target.value)}
                            placeholder="영문, 숫자 포함 8자리 이상"
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">새 비밀번호 확인</label>
                        <input
                            type="password"
                            className="form-input"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => passwordForm.setConfirmPassword(e.target.value)}
                            placeholder="새 비밀번호를 다시 입력해주세요"
                            autoComplete="new-password"
                        />
                        {passwordForm.errorMessage && (
                            <span className="field-message auth-error">{passwordForm.errorMessage}</span>
                        )}
                    </div>
                    <button className="btn-action btn-submit" onClick={passwordForm.submitPassword}>비밀번호 변경하기</button>
                </section>
                <button
                    className="btn-withdraw"
                    onClick={() => { void withdrawAction.withdrawAccount(); }}
                    disabled={withdrawAction.isWithdrawing}
                >
                    회원 탈퇴
                </button>
            </div>
        </div>
    );
}
