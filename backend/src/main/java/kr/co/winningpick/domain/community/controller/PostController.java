package kr.co.winningpick.domain.community.controller;

import jakarta.validation.Valid;
import kr.co.winningpick.domain.community.docs.PostApiDocs;
import kr.co.winningpick.domain.community.dto.request.RequestCreatePost;
import kr.co.winningpick.domain.community.dto.response.ResponsePost;
import kr.co.winningpick.domain.community.service.PostService;
import kr.co.winningpick.domain.member.entity.Member;
import kr.co.winningpick.domain.member.exception.MemberErrorCode;
import kr.co.winningpick.domain.member.repository.MemberRepository;
import kr.co.winningpick.global.exception.BusinessException;
import kr.co.winningpick.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/community/posts")
@RequiredArgsConstructor
public class PostController implements PostApiDocs {

    private final PostService postService;
    private final MemberRepository memberRepository;

    @Override
    @GetMapping
    public ApiResponse<List<ResponsePost>> getPosts() {
        return ApiResponse.success(postService.getPosts());
    }

    @Override
    @PostMapping
    public ApiResponse<ResponsePost> createPost(@RequestParam Long userId, @Valid @RequestBody RequestCreatePost request) {
        Member author = memberRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(MemberErrorCode.LOGIN_FAILED));
        return ApiResponse.success(postService.createPost(author, request));
    }

    @Override
    @GetMapping("/{id}")
    public ApiResponse<ResponsePost> getPost(@PathVariable Long id) {
        return ApiResponse.success(postService.getPost(id));
    }
}
