package kr.co.winningpick.domain.community.dto.response;

import kr.co.winningpick.domain.community.entity.Post;
import kr.co.winningpick.domain.community.type.PostCategoryType;

import java.time.LocalDateTime;

public record ResponsePost(
        Long id,
        Long gameId,
        PostCategoryType category,
        String title,
        String content,
        String author,
        LocalDateTime createdAt,
        Integer commentCount
) {
    public static ResponsePost from(Post post) {
        return new ResponsePost(
                post.getId(),
                post.getGameId(),
                post.getCategory(),
                post.getTitle(),
                post.getContent(),
                post.getAuthor().getNickname(),
                post.getCreatedAt(),
                0
        );
    }
}
