package kr.co.winningpick.domain.community.dto.response;

import kr.co.winningpick.domain.community.entity.Comment;

import java.time.LocalDateTime;

public record ResponseComment(
        Long id,
        Long postId,
        String author,
        String content,
        LocalDateTime createdAt
) {
    public static ResponseComment from(Comment comment) {
        return new ResponseComment(
                comment.getId(),
                comment.getPost().getId(),
                comment.getAuthor().getNickname(),
                comment.getContent(),
                comment.getCreatedAt()
        );
    }
}
