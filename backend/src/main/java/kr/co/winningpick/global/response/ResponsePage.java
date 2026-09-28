package kr.co.winningpick.global.response;

import org.springframework.data.domain.Page;

import java.util.List;

public record ResponsePage<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean hasNext
) {
    public static <T> ResponsePage<T> from(Page<T> page) {
        return new ResponsePage<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.hasNext()
        );
    }
}
