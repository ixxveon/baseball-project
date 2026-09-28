package kr.co.winningpick.domain.community.service;

import kr.co.winningpick.domain.community.dto.request.RequestCreateComment;
import kr.co.winningpick.domain.community.dto.response.ResponseComment;
import kr.co.winningpick.domain.community.entity.Comment;
import kr.co.winningpick.domain.community.entity.Post;
import kr.co.winningpick.domain.community.exception.CommentErrorCode;
import kr.co.winningpick.domain.community.exception.PostErrorCode;
import kr.co.winningpick.domain.community.repository.CommentRepository;
import kr.co.winningpick.domain.community.repository.PostRepository;
import kr.co.winningpick.domain.member.entity.Member;
import kr.co.winningpick.global.exception.BusinessException;
import kr.co.winningpick.global.response.ResponsePage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public ResponsePage<ResponseComment> getComments(Long postId, Pageable pageable) {
        if (!postRepository.existsById(postId)) {
            throw new BusinessException(PostErrorCode.POST_NOT_FOUND);
        }
        Page<Comment> page = commentRepository.findAllByPostIdWithAuthor(postId, pageable);
        Page<ResponseComment> responsePage = page.map(ResponseComment::from);
        return ResponsePage.from(responsePage);
    }

    @Transactional
    public ResponseComment createComment(Member author, Long postId, RequestCreateComment request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(PostErrorCode.POST_NOT_FOUND));
        Comment comment = Comment.create(post, author, request.content());
        Comment savedComment = commentRepository.save(comment);
        return ResponseComment.from(savedComment);
    }

    @Transactional
    public void deleteComment(Long postId, Long commentId, Long memberId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException(CommentErrorCode.COMMENT_NOT_FOUND));

        if (!comment.getPost().getId().equals(postId)) {
            throw new BusinessException(CommentErrorCode.COMMENT_NOT_FOUND);
        }

        if (!comment.getAuthor().getId().equals(memberId)) {
            throw new BusinessException(CommentErrorCode.FORBIDDEN);
        }

        commentRepository.delete(comment);
    }
}