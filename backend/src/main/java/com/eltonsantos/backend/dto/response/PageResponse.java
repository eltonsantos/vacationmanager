package com.eltonsantos.backend.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;

@Schema(description = "Resposta paginada contendo lista de itens e metadados de paginação")
public record PageResponse<T>(
        @Schema(description = "Lista de itens da página atual")
        List<T> content,

        @Schema(description = "Número da página atual (começa em 0)", example = "0")
        int page,

        @Schema(description = "Quantidade de itens por página", example = "10")
        int size,

        @Schema(description = "Total de elementos em todas as páginas", example = "100")
        long totalElements,

        @Schema(description = "Total de páginas disponíveis", example = "10")
        int totalPages,

        @Schema(description = "Indica se é a primeira página", example = "true")
        boolean first,

        @Schema(description = "Indica se é a última página", example = "false")
        boolean last
) {
    public static <E, T> PageResponse<T> from(Page<E> page, Function<E, T> mapper) {
        return new PageResponse<>(
                page.getContent().stream().map(mapper).toList(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast()
        );
    }
}
