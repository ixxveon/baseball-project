package kr.co.winningpick.domain.community.exception;

import kr.co.winningpick.global.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CommentErrorCode implements ErrorCode {

    COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "댓글을 찾을 수 없습니다"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "본인 댓글만 삭제할 수 있습니다");

    private final HttpStatus status;
    private final String message;
}
