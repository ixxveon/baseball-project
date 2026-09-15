package kr.co.winningpick.domain.member.controller;

import jakarta.validation.Valid;
import kr.co.winningpick.domain.member.docs.MemberApiDocs;
import kr.co.winningpick.domain.member.dto.request.*;
import kr.co.winningpick.domain.member.dto.response.*;
import kr.co.winningpick.domain.member.service.MemberService;
import kr.co.winningpick.global.exception.BusinessException;
import kr.co.winningpick.global.exception.GlobalErrorCode;
import kr.co.winningpick.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class MemberController implements MemberApiDocs {

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
