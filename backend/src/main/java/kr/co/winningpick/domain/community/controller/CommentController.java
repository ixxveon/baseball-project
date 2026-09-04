package kr.co.winningpick.domain.community.controller;

import jakarta.validation.Valid;
import kr.co.winningpick.domain.community.docs.CommentApiDocs;
import kr.co.winningpick.domain.community.dto.request.RequestCreateComment;
import kr.co.winningpick.domain.community.dto.response.ResponseComment;
import kr.co.winningpick.domain.community.service.CommentService;
import kr.co.winningpick.domain.member.entity.Member;
import kr.co.winningpick.domain.member.exception.MemberErrorCode;
import kr.co.winningpick.domain.member.repository.MemberRepository;
import kr.co.winningpick.global.exception.BusinessException;
import kr.co.winningpick.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/community/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController implements CommentApiDocs {

    private final CommentService commentService;
    private final MemberRepository memberRepository;

    @Override
    @GetMapping
    public ApiResponse<List<ResponseComment>> getComments(@PathVariable Long postId) {
        return ApiResponse.success(commentService.getComments(postId));
    }

    @Override
    @PostMapping
    public ApiResponse<ResponseComment> createComment(
            @PathVariable Long postId,
            @RequestParam Long userId,
            @Valid @RequestBody RequestCreateComment request
    ) {
        Member author = memberRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(MemberErrorCode.LOGIN_FAILED));
        return ApiResponse.success(commentService.createComment(author, postId, request));
    }
}