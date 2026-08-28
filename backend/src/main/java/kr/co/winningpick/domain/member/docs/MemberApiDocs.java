package kr.co.winningpick.domain.member.docs;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.winningpick.domain.member.dto.request.RequestConfirmEmailVerification;
import kr.co.winningpick.domain.member.dto.request.RequestSendEmailVerification;
import kr.co.winningpick.domain.member.dto.response.ResponseEmailVerification;

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
}