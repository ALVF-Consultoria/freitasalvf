"use client";

import { motion } from "framer-motion";
import { useMobile } from "@/hooks/useMobile";
import { MobileScrollWrapper } from "@/components/common/MobileScrollWrapper";
import { travelSoft, type TravelProps } from "@/lib/travel";
import { bcType } from "./typography";

interface IntroStepProps extends TravelProps {
  step: number;
}

export const IntroStep = ({ step, direction }: IntroStepProps) => {
  const isMobile = useMobile();

  // Passo 2 e a passagem: as duas frases abrem para fora do quadro enquanto a
  // camera entra no cubo. O zoom em si e do orquestrador, que e quem monta o
  // holograma — aqui so acontece o afastamento do texto.
  const parting = step >= 2;
  // No celular as colunas viram linhas empilhadas, entao abrir na horizontal nao
  // le como afastamento; o que carrega a saida ali e o desvanecer.
  const part = isMobile ? 60 : 420;
  const glide = { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.div
      variants={travelSoft}
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      className="flex flex-col w-full"
    >
      <MobileScrollWrapper accentColor="amber">
        {/* Os dois blocos sao um par de display, nao titulo mais legenda: mesmo
            peso, com a direita descendo cerca de uma linha em relacao a esquerda.
            O desnivel vem de uma margem, e nao de self-start/self-end numa caixa
            alta: aquilo jogava um para o topo e outro para o rodape da tela, um
            afastamento muito maior do que a diagonal curta que se quer aqui.
            E margem, e nao translate, porque o x da despedida ja escreve
            transform inline nestes mesmos nos. O max-w-5xl recolhe o par para o
            miolo em vez de deixar cada bloco colado numa borda do max-w-7xl. */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between w-full md:max-w-5xl md:mx-auto gap-10 md:gap-8">
          <motion.div
            animate={{ x: parting ? -part : 0, opacity: parting ? 0 : 1 }}
            transition={glide}
            className="md:max-w-md lg:max-w-lg shrink-0 text-left"
          >
            <h2 className={`${bcType.title} text-white uppercase`}>
              <span className="text-amber-500">o presente é</span>
              <span className="block">descentralizado</span>
            </h2>
          </motion.div>

          <motion.div
            animate={{ x: parting ? part : 0, opacity: parting ? 0 : 1 }}
            transition={glide}
            className="md:max-w-sm lg:max-w-md shrink-0 md:text-right md:mt-12 lg:mt-14"
          >
            <p className={`${bcType.lede} text-white/80 font-light`}>
              A economia programável não é o futuro, é a{" "}
              <span className="text-amber-500">infraestrutura do agora</span>.
            </p>
          </motion.div>
        </div>
      </MobileScrollWrapper>
    </motion.div>
  );
};
