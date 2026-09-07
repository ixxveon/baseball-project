package kr.co.winningpick.domain.community.service;

import kr.co.winningpick.domain.community.dto.request.RequestCreatePost;
import kr.co.winningpick.domain.community.dto.response.ResponsePost;
import kr.co.winningpick.domain.community.entity.Post;
import kr.co.winningpick.domain.community.exception.PostErrorCode;
import kr.co.winningpick.domain.community.repository.PostRepository;
import kr.co.winningpick.domain.member.entity.Member;
import kr.co.winningpick.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {

    private final PostRepository postRepository;

    public List<ResponsePost> getPosts() {
        return postRepository.findAllWithAuthorAndCommentCountOrderByCreatedAtDesc()
                .stream()
                .map(row -> ResponsePost.from((Post) row[0], (Long) row[1]))
                .toList();
    }

    @Transactional
    public ResponsePost createPost(Member author, RequestCreatePost request) {
        Post post = Post.create(request.gameId(), author, request.title(), request.content(), request.category());
        Post savedPost = postRepository.save(post);
        return ResponsePost.from(savedPost, 0);
    }

    public ResponsePost getPost(Long postId) {
        List<Object[]> rows = postRepository.findByIdWithAuthorAndCommentCount(postId);
        if (rows.isEmpty()) {
            throw new BusinessException(PostErrorCode.POST_NOT_FOUND);
        }
        Object[] row = rows.get(0);
        return ResponsePost.from((Post) row[0], (Long) row[1]);
    }


}
