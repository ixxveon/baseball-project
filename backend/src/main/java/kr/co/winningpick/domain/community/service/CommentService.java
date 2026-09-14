package kr.co.winningpick.domain.community.service;

import kr.co.winningpick.domain.community.dto.request.RequestCreateComment;
import kr.co.winningpick.domain.community.dto.response.ResponseComment;
import kr.co.winningpick.domain.community.entity.Comment;
import kr.co.winningpick.domain.community.entity.Post;
import kr.co.winningpick.domain.community.exception.PostErrorCode;
import kr.co.winningpick.domain.community.repository.CommentRepository;
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
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public List<ResponseComment> getComments(Long postId) {
        if (!postRepository.existsById(postId)) {
            throw new BusinessException(PostErrorCode.POST_NOT_FOUND);
        }
        return commentRepository.findAllByPostIdWithAuthorOrderByCreatedAtAsc(postId)
                .stream()
                .map(ResponseComment::from)
                .toList();
    }

    @Transactional
    public ResponseComment createComment(Member author, Long postId, RequestCreateComment request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(PostErrorCode.POST_NOT_FOUND));
        Comment comment = Comment.create(post, author, request.content());
        Comment savedComment = commentRepository.save(comment);
        return ResponseComment.from(savedComment);
    }
}