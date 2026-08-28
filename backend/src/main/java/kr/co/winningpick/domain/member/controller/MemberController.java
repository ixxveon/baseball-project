package kr.co.winningpick.domain.member.controller;

import kr.co.winningpick.domain.member.docs.MemberApiDocs;
import kr.co.winningpick.domain.member.dto.request.RequestConfirmEmailVerification;
import kr.co.winningpick.domain.member.dto.request.RequestLogin;
import kr.co.winningpick.domain.member.dto.request.RequestSendEmailVerification;
import kr.co.winningpick.domain.member.dto.request.RequestSignup;
import kr.co.winningpick.domain.member.dto.response.ResponseEmailVerification;
import kr.co.winningpick.domain.member.dto.response.ResponseLogin;
import kr.co.winningpick.domain.member.dto.response.ResponseNicknameAvailability;
import kr.co.winningpick.domain.member.dto.response.ResponseSignup;
import kr.co.winningpick.domain.member.service.MemberService;
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
    public ApiResponse<Void> sendEmailVerification(@RequestBody RequestSendEmailVerification request) {
        memberService.sendEmailVerification(request.email());
        return ApiResponse.success(null);
    }

    @Override
    @PostMapping("/email-verification/confirm")
    public ApiResponse<ResponseEmailVerification> confirmEmailVerification(@RequestBody RequestConfirmEmailVerification request) {
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
    public ApiResponse<ResponseSignup> signup(@RequestBody RequestSignup request) {
        ResponseSignup response = memberService.signup(request);
        return ApiResponse.success(response);
    }

    @Override
    @PostMapping("/login")
    public ApiResponse<ResponseLogin> login(@RequestBody RequestLogin request) {
        ResponseLogin response = memberService.login(request);
        return ApiResponse.success(response);
    }
}
