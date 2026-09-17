package kr.co.winningpick.domain.community.controller;

import jakarta.validation.Valid;
import kr.co.winningpick.domain.community.docs.PostControllerDocs;
import kr.co.winningpick.domain.community.dto.request.RequestCreatePost;
import kr.co.winningpick.domain.community.dto.request.RequestUpdatePost;
import kr.co.winningpick.domain.community.dto.response.ResponsePost;
import kr.co.winningpick.domain.community.service.PostService;
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

import java.util.List;

@RestController
@RequestMapping("/api/v1/community/posts")
@RequiredArgsConstructor
public class PostController implements PostControllerDocs {

    private final PostService postService;
    private final MemberRepository memberRepository;

    @Override
    @GetMapping
    public ApiResponse<ResponsePage<ResponsePost>> getPosts(
            @RequestParam(required = false) Long gameId,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return ApiResponse.success(postService.getPosts(gameId, pageable));
    }
    
    @Override
    @PostMapping
    public ApiResponse<ResponsePost> createPost(@RequestAttribute(name = "memberId", required = false) Long memberId, @Valid @RequestBody RequestCreatePost request) {
        if (memberId == null) {
            throw new BusinessException(GlobalErrorCode.UNAUTHORIZED);
        }
        Member author = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(MemberErrorCode.LOGIN_FAILED));
        return ApiResponse.success(postService.createPost(author, request));
    }

    @Override
    @GetMapping("/{id}")
    public ApiResponse<ResponsePost> getPost(@PathVariable Long id) {
        return ApiResponse.success(postService.getPost(id));
    }

    @Override
    @PatchMapping("/{id}")
    public ApiResponse<ResponsePost> updatePost(
            @PathVariable Long id,
            @RequestAttribute(name = "memberId", required = false) Long memberId,
            @Valid @RequestBody RequestUpdatePost request
    ) {
        if (memberId == null) {
            throw new BusinessException(GlobalErrorCode.UNAUTHORIZED);
        }
        return ApiResponse.success(postService.updatePost(id, memberId, request));
    }

    @Override
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deletePost(
            @PathVariable Long id,
            @RequestAttribute(name = "memberId", required = false) Long memberId
    ) {
        if (memberId == null) {
            throw new BusinessException(GlobalErrorCode.UNAUTHORIZED);
        }
        postService.deletePost(id, memberId);
        return ApiResponse.success(null);
    }
}
