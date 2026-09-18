package kr.co.winningpick.domain.member.controller;

import jakarta.validation.Valid;

import kr.co.winningpick.domain.member.dto.request.ProfileUpdateRequest;
import kr.co.winningpick.domain.member.docs.MemberControllerDocs;
import kr.co.winningpick.domain.member.dto.request.RequestConfirmEmailVerification;
import kr.co.winningpick.domain.member.dto.request.RequestLogin;
import kr.co.winningpick.domain.member.dto.request.RequestReissue;
import kr.co.winningpick.domain.member.dto.request.RequestSendEmailVerification;
import kr.co.winningpick.domain.member.dto.request.RequestSignup;
import kr.co.winningpick.domain.member.dto.response.ResponseEmailVerification;
import kr.co.winningpick.domain.member.dto.response.ResponseLogin;
import kr.co.winningpick.domain.member.dto.response.ResponseNicknameAvailability;
import kr.co.winningpick.domain.member.dto.response.ResponseReissue;
import kr.co.winningpick.domain.member.dto.response.ResponseSignup;
import kr.co.winningpick.domain.member.service.MemberService;
import kr.co.winningpick.global.exception.BusinessException;
import kr.co.winningpick.global.exception.GlobalErrorCode;
import kr.co.winningpick.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class MemberController implements MemberControllerDocs {

    private final MemberService memberService;

    @Override
    @PostMapping("/email-verification/send")
    public ApiResponse<Void> sendEmailVerification(@Valid @RequestBody RequestSendEmailVerification request) {
        memberService.sendEmailVerification(request.email());
        return ApiResponse.success(null);
    }

    @Override
    @PostMapping("/email-verification/confirm")
    public ApiResponse<ResponseEmailVerification> confirmEmailVerification(@Valid @RequestBody RequestConfirmEmailVerification request) {
        boolean verified = memberService.confirmEmailVerification(request.email(), request.code());
        return ApiResponse.success(new ResponseEmailVerification(verified));
    }

    @Override
    @GetMapping("/nickname-availability")
    public ApiResponse<ResponseNicknameAvailability> checkNicknameAvailability(@RequestParam String nickname) {
        boolean available = memberService.checkNicknameAvailability(nickname);
        return ApiResponse.success(new ResponseNicknameAvailability(available));
    }

    @Override
    @PostMapping("/signup")
    public ApiResponse<ResponseSignup> signup(@Valid @RequestBody RequestSignup request) {
        ResponseSignup response = memberService.signup(request);
        return ApiResponse.success(response);
    }

    @Override
    @PostMapping("/login")
    public ApiResponse<ResponseLogin> login(@Valid @RequestBody RequestLogin request) {
        ResponseLogin response = memberService.login(request);
        return ApiResponse.success(response);
    }

    @Override
    @PatchMapping("/profile")
    public ApiResponse<Void> updateProfile(
            // 👇 1. 가짜 값 대신, 필터(인터셉터)가 꽂아주는 로그인 유저 ID를 받아옵니다.
            @RequestAttribute(name = "memberId", required = false) Long memberId,
            @Valid @RequestBody ProfileUpdateRequest request) {

        // 👇 2. 로그인하지 않은 사용자(memberId가 null)면 401 UNAUTHORIZED 에러를 던집니다!
        if (memberId == null) {
            throw new BusinessException(GlobalErrorCode.UNAUTHORIZED);
        }

        // 3. 실제 멤버 ID를 Service로 넘겨줍니다.
        memberService.updateProfile(memberId, request);
        return ApiResponse.success(null);
    }

    @Override
    @PostMapping("/reissue")
    public ApiResponse<ResponseReissue> reissue(@Valid @RequestBody RequestReissue request) {
        return ApiResponse.success(memberService.reissue(request.refreshToken()));
    }

    @Override
    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestAttribute(name = "memberId", required = false) Long memberId) {
        if (memberId == null) {
            throw new BusinessException(GlobalErrorCode.UNAUTHORIZED);
        }
        memberService.logout(memberId);
        return ApiResponse.success(null);
    }
}
