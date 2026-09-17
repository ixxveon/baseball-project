package kr.co.winningpick.domain.community.controller;

import jakarta.validation.Valid;
import kr.co.winningpick.domain.community.docs.CommentControllerDocs;
import kr.co.winningpick.domain.community.dto.request.RequestCreateComment;
import kr.co.winningpick.domain.community.dto.response.ResponseComment;
import kr.co.winningpick.domain.community.service.CommentService;
import kr.co.winningpick.domain.member.entity.Member;
import kr.co.winningpick.domain.member.exception.MemberErrorCode;
import kr.co.winningpick.domain.member.repository.MemberRepository;
import kr.co.winningpick.global.exception.BusinessException;
import kr.co.winningpick.global.exception.GlobalErrorCode;
import kr.co.winningpick.global.response.ApiResponse;
import kr.co.winningpick.global.response.ResponsePage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/community/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController implements CommentControllerDocs {

    private final CommentService commentService;
    private final MemberRepository memberRepository;

    @Override
    @GetMapping
    public ApiResponse<ResponsePage<ResponseComment>> getComments(
            @PathVariable Long postId,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return ApiResponse.success(commentService.getComments(postId, pageable));
    }

    @Override
    @PostMapping
    public ApiResponse<ResponseComment> createComment(
            @PathVariable Long postId,
            @RequestAttribute(name = "memberId", required = false) Long memberId,
            @Valid @RequestBody RequestCreateComment request
    ) {
        if (memberId == null) {
            throw new BusinessException(GlobalErrorCode.UNAUTHORIZED);
        }
        Member author = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(MemberErrorCode.LOGIN_FAILED));
        return ApiResponse.success(commentService.createComment(author, postId, request));
    }

    @Override
    @DeleteMapping("/{commentId}")
    public ApiResponse<Void> deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestAttribute(name = "memberId", required = false) Long memberId
    ) {
        if (memberId == null) {
            throw new BusinessException(GlobalErrorCode.UNAUTHORIZED);
        }
        commentService.deleteComment(postId, commentId, memberId);
        return ApiResponse.success(null);
    }
}