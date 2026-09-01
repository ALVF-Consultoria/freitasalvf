/** Escala tipografica da secao Blockchain.
 *
 *  Existe porque cada tela foi escrita isolada e a hierarquia virou ruido: os
 *  titulos iam de 30px na topologia a 128px na Solana, encolhendo justamente
 *  ao longo dos primeiros passos, e o corpo circulava por text-[6px],
 *  text-[8px], text-[9px], text-[10px], text-[11px], text-xs, text-sm e
 *  text-base sem criterio.
 *
 *  Sao papeis, nao tamanhos: escolha pelo que o texto E na tela, e o tamanho
 *  vem junto. Ajustar a escala inteira e uma edicao aqui, nao seis.
 *
 *  Cada papel carrega tamanho, entrelinha e espacamento — os tres andam
 *  juntos, porque tracking que funciona em 96px arruina 12px. Peso, caixa e
 *  cor ficam no ponto de uso: variam por motivo, nao por tamanho. */
export const bcType = {
  /** Uma frase que ocupa a tela sozinha: SOLANA, o slogan, o nome da
   *  plataforma em analise. Um por tela, no maximo. */
  display: "text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.85]",

  /** Titulo de uma tela que divide espaco com conteudo ao lado. */
  title: "text-3xl md:text-4xl lg:text-5xl tracking-tighter leading-[0.9]",

  /** Frase de apoio que ainda precisa ser lida de longe — o par da abertura. */
  lede: "text-xl md:text-3xl lg:text-4xl tracking-tight leading-[1.1]",

  /** Titulo dentro de um card, celula ou no. */
  cardTitle: "text-sm md:text-lg tracking-tight leading-tight",

  /** Corpo corrido. */
  body: "text-xs md:text-sm leading-relaxed",

  /** Etiqueta em caixa alta e espacada: legenda de secao, chip, chamada. */
  label: "text-[10px] md:text-xs uppercase tracking-[0.25em]",

  /** A menor marca legivel: rotulo dentro de elemento apertado, telemetria. */
  micro: "text-[9px] md:text-[10px] uppercase tracking-[0.4em]",
} as const;
