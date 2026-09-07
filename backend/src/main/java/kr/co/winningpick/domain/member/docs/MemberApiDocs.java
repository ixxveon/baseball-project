package kr.co.winningpick.domain.member.docs;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.winningpick.domain.member.dto.request.RequestConfirmEmailVerification;
import kr.co.winningpick.domain.member.dto.request.RequestLogin;
import kr.co.winningpick.domain.member.dto.request.RequestSendEmailVerification;
import kr.co.winningpick.domain.member.dto.request.RequestSignup;
import kr.co.winningpick.domain.member.dto.response.ResponseEmailVerification;
import kr.co.winningpick.domain.member.dto.response.ResponseLogin;
import kr.co.winningpick.domain.member.dto.response.ResponseNicknameAvailability;
import kr.co.winningpick.domain.member.dto.response.ResponseSignup;

@Tag(name = "Member", description = "회원 관련 API")
public interface MemberApiDocs {

    @Operation(summary = "이메일 인증번호 발송", description = "입력한 이메일로 6자리 인증번호를 발송합니다. 인증번호는 5분간 유효합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "발송 성공")
    })
    kr.co.winningpick.global.response.ApiResponse<Void> sendEmailVerification(RequestSendEmailVerification request);

    @Operation(summary = "이메일 인증번호 확인", description = "발송된 인증번호가 올바른지 확인합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "확인 요청 성공 (data.verified로 실제 일치 여부 확인)"),
            @ApiResponse(responseCode = "400", description = "해당 이메일로 발송된 인증번호가 없거나 만료됨",
                    content = @Content(examples = @ExampleObject(value = """
                            {"success":false,"message":"인증번호가 만료되었거나 존재하지 않습니다.","data":null}""")))
    })
    kr.co.winningpick.global.response.ApiResponse<ResponseEmailVerification> confirmEmailVerification(RequestConfirmEmailVerification request);

    @Operation(summary = "닉네임 중복확인", description = "입력한 닉네임을 사용할 수 있는지 확인합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "확인 성공 (data.available로 사용 가능 여부 확인)")
    })
    kr.co.winningpick.global.response.ApiResponse<ResponseNicknameAvailability> checkNicknameAvailability(String nickname);

    @Operation(summary = "회원가입", description = "이메일 인증이 완료된 사용자의 회원가입을 처리합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "가입 성공"),
            @ApiResponse(responseCode = "400", description = "이메일 인증 미완료",
                    content = @Content(examples = @ExampleObject(value = """
                        {"success":false,"message":"이메일 인증을 완료해주세요","data":null}"""))),
            @ApiResponse(responseCode = "409", description = "이메일 또는 닉네임 중복",
                    content = @Content(examples = @ExampleObject(value = """
                        {"success":false,"message":"이미 사용 중인 이메일입니다","data":null}""")))
    })
    kr.co.winningpick.global.response.ApiResponse<ResponseSignup> signup(RequestSignup request);

    @Operation(summary = "로그인", description = "이메일/비밀번호로 로그인하고 JWT Access Token을 발급받습니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "로그인 성공"),
            @ApiResponse(responseCode = "401", description = "이메일 또는 비밀번호 불일치",
                    content = @Content(examples = @ExampleObject(value = """
                        {"success":false,"message":"이메일 또는 비밀번호가 올바르지 않습니다.","data":null}""")))
    })
    kr.co.winningpick.global.response.ApiResponse<ResponseLogin> login(RequestLogin request);
}