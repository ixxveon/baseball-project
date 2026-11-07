package kr.co.winningpick.domain.member.exception;

import kr.co.winningpick.global.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum MemberErrorCode implements ErrorCode {

    INVALID_VERIFICATION_CODE(HttpStatus.BAD_REQUEST, "인증번호가 올바르지 않습니다"),
    VERIFICATION_CODE_EXPIRED(HttpStatus.BAD_REQUEST, "인증번호가 만료되었거나 존재하지 않습니다."),
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "이미 사용 중인 이메일입니다"),
    DUPLICATE_NICKNAME(HttpStatus.CONFLICT, "이미 사용 중인 닉네임입니다"),
    EMAIL_NOT_VERIFIED(HttpStatus.BAD_REQUEST, "이메일 인증을 완료해주세요"),
    LOGIN_FAILED(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다."),
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 회원입니다."),
    INVALID_TEAM_ID(HttpStatus.BAD_REQUEST, "유효하지 않은 구단 ID입니다."),
    INVALID_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 리프레시 토큰입니다"),
    INVALID_CURRENT_PASSWORD(HttpStatus.BAD_REQUEST, "현재 비밀번호가 올바르지 않습니다"),
    SAME_AS_CURRENT_PASSWORD(HttpStatus.BAD_REQUEST, "현재 비밀번호와 다른 비밀번호를 입력해주세요"),
    PASSWORD_CHANGE_NOT_ALLOWED(HttpStatus.BAD_REQUEST, "소셜 로그인 회원은 비밀번호를 변경할 수 없습니다"),
    EMAIL_SEND_FAILED(HttpStatus.SERVICE_UNAVAILABLE, "인증번호 메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요"),
    VERIFICATION_RESEND_TOO_SOON(HttpStatus.TOO_MANY_REQUESTS, "인증번호는 1분 후에 다시 요청할 수 있습니다"),
    VERIFICATION_ATTEMPTS_EXCEEDED(HttpStatus.TOO_MANY_REQUESTS, "인증번호 입력 횟수를 초과했습니다. 인증번호를 다시 발송해주세요");

    private final HttpStatus status;
    private final String message;
}
