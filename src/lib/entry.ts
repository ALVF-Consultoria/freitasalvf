"use client";

/** Ja passamos pela porta de entrada nesta carga do documento?
 *
 *  Variavel de modulo, e nao sessionStorage: um router.push entre rotas nao
 *  recarrega o documento, entao o valor sobrevive a ida e volta para
 *  /solucoes-ia ou /blockchain e zera num F5 — que e exatamente a diferenca
 *  entre "voltei de uma rota" e "abri a pagina de novo". Com sessionStorage o
 *  hero sumia ate fechar a aba.
 *
 *  Mora aqui, e nao dentro de page.tsx, porque quem marca nao e so a home. A
 *  flag ficava presa a um efeito que so rodava enquanto / estava montada, entao
 *  abrir /blockchain direto pela URL — ou dar F5 estando nela — deixava a flag
 *  em false e a volta caia no hero em vez do dashboard. Agora a rota avisa na
 *  saida, que e o momento em que ela de fato sabe que o proximo destino e o hub. */
let entered = false;

export const markEntered = (): void => {
  entered = true;
};

export const hasEnteredDocument = (): boolean => entered;
