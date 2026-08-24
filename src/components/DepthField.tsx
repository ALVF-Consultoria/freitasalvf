"use client";

import { useAnimate } from "framer-motion";
import { useEffect, type CSSProperties } from "react";
import "./DepthField.css";

/**
 * Campo de profundidade: tres planos de pontos ladrilhados, cada um num ciclo
 * infinito de escala. Longe eles sao densos e pequenos, perto sao esparsos e
 * grandes — que e o que o olho usa para ler deslocamento para frente.
 *
 * Os ciclos correm em duracoes diferentes e defasados, entao sempre ha um plano
 * em cada estagio e a repeticao nao aparece. Nada aqui e por passo: o campo vive
 * sozinho. O passo so adiciona o solavanco.
 */

interface Layer {
  /** Lado do ladrilho. Menor = mais denso = mais distante. */
  tile: number;
  /** Raio do ponto. */
  dot: number;
  /** Opacidade no meio do ciclo. */
  peak: number;
  /** Duracao do ciclo. Menor = passa mais rapido = mais perto. */
  duration: number;
  delay: number;
}

const LAYERS: Layer[] = [
  { tile: 44, dot: 0.8, peak: 0.22, duration: 26, delay: 0 },
  { tile: 74, dot: 1.3, peak: 0.3, duration: 18, delay: -7 },
  { tile: 118, dot: 2.1, peak: 0.38, duration: 12, delay: -4 },
];

interface DepthFieldProps {
  /** Muda a cada passo e dispara o solavanco. */
  step: number;
  /** +1 descendo, -1 subindo: decide se o solavanco vai para fora ou para dentro. */
  direction: number;
  /** Cor dos pontos. Entra como `color` e as camadas leem com currentColor. */
  color: string;
  className?: string;
}

export const DepthField = ({ step, direction, color, className = "" }: DepthFieldProps) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (!scope.current) return;
    // Solavanco assimetrico: o empurrao e curto (12% do tempo) e o retorno ocupa
    // o resto. Simetrico, a volta seria lida como andar de re — exatamente o que
    // a gramatica de Z existe para eliminar.
    const push = direction >= 0 ? 1.07 : 0.94;
    animate(
      scope.current,
      { scale: [1, push, 1] },
      { duration: 1.6, times: [0, 0.12, 1], ease: "easeOut" }
    );
  }, [step, direction, animate, scope]);

  return (
    <div ref={scope} className={`depth-field ${className}`.trim()} style={{ color }}>
      {LAYERS.map((layer, i) => (
        <div
          key={i}
          className="depth-field__layer"
          style={
            {
              "--df-tile": `${layer.tile}px`,
              "--df-dot": `${layer.dot}px`,
              "--df-peak": layer.peak,
              "--df-duration": `${layer.duration}s`,
              "--df-delay": `${layer.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
};
