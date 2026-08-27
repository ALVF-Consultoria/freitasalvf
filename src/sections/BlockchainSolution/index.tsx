"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import { useMobile } from "@/hooks/useMobile";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { ParticleImage } from "@/components/ParticleImage";
import { ScrollIndicator } from "@/components/common/ScrollIndicator";
import { BlockchainHUD } from "./BlockchainHUD";
import { IntroStep } from "./IntroStep";
import { FeatureStep } from "./FeatureStep";
import { TopologyStep } from "./TopologyStep";
import { AnalysisStep } from "./AnalysisStep";
import { SolanaIntro, SolanaDeepDive, SolanaEcosystem } from "./SolanaStep";
import { SloganStep } from "./SloganStep";

interface BlockchainSolutionProps {
  onBack: () => void;
}

// Faixas dos blocos. Ficam aqui em cima para as guardas do JSX nao virarem
// numeros soltos, e para mover um bloco ser uma edicao so.
const INTRO_END = 2;
const FEATURES_START = 3;
const FEATURES_END = 6;
const TOPOLOGY_STEP = 7;
const ANALYSIS_START = 8;
const ANALYSIS_END = 11;
const SOLANA_START = 12;
const SOLANA_END = 14;
const TOTAL_STEPS = 15;

export const BlockchainSolution = ({ onBack }: BlockchainSolutionProps) => {
  const isMobile = useMobile();
  const [step, setStep] = useState(1);
  // +1 descendo, -1 subindo. E o que faz a viagem se inverter ao voltar, em vez
  // de repetir a animacao de ida.
  const [direction, setDirection] = useState(1);

  const isIntro = step <= INTRO_END;
  const isSolana = step >= SOLANA_START && step <= SOLANA_END;
  // O ScrollIndicator (mouse + "deslize para navegar") e a dica cheia da primeira
  // tela; a linha fina cobre o resto do percurso. Os dois moram em bottom-10
  // left-1/2, entao so um pode estar no ar por vez.
  const showScrollHint = step === 1 && !isMobile;

  // O holograma nao morre no fim da abertura: entrar no cubo e sair dele na tela
  // seguinte desmancharia a viagem toda. Ele atravessa as features, e o que muda
  // e o ponto de vista — a camera segue avancando devagar e um vazio abre no
  // miolo, entao a arte deixa de ser o assunto e vira o lugar onde o conteudo
  // acontece. Sai so no passo 7, onde a topologia assume com cenario proprio.
  const showHologram = step <= FEATURES_END;
  const insideCube = step >= FEATURES_START;
  const holoZoom = step <= 1 ? 1 : 3.6 + Math.max(0, step - 2) * 0.22;

  useStepNavigation({
    onNext: () => {
      if (step < TOTAL_STEPS) {
        setDirection(1);
        setStep((prev) => prev + 1);
      } else onBack();
    },
    // Simetrico ao onNext, como na secao de IA: subir antes do primeiro passo
    // devolve ao dashboard em vez de travar no topo.
    onPrev: () => {
      if (step > 1) {
        setDirection(-1);
        setStep((prev) => prev - 1);
      } else onBack();
    },
    cooldown: isIntro ? 1400 : 700,
  });

  return (
    <section className="relative h-screen w-full bg-[#050505] overflow-hidden">
      {/* Background Dinamico. So entra onde nao ha outro campo no ar: sai nos
          passos da Solana, que ja tem cenario proprio e cinco elementos
          desfocados, e sai enquanto o holograma do cubo esta montado, onde ele
          seria um segundo sistema de particulas concorrendo com o primeiro —
          cem divs animados por tras de milhares de pontos de canvas, embolando a
          leitura dos dois. Sobram a topologia, a analise e o slogan.
          O motivo nao e so pintar menos: cada quadro que essas particulas animam
          obriga todo backdrop-filter por cima a re-amostrar e re-desfocar o
          fundo. Parar o fundo e o que deixa o navegador cachear esse desfoque.
          A opacidade e 0.3 para alinhar com o resto do site (as outras secoes
          amortecem em 30-40%; aqui rodava em forca total) e vai no animate, nao
          numa classe: framer-motion escreve opacity inline e a classe seria
          sobrescrita. */}
      <AnimatePresence>
        {!isSolana && !showHologram && (
          <motion.div
            key="bc-particles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <ParticlesBackground />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid de Dados de Fundo (Sutil) */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#f59e0b 0.5px, transparent 0.5px), linear-gradient(90deg, #f59e0b 0.5px, transparent 0.5px)",
          backgroundSize: "100px 100px",
        }}
      />

      {/* Luz ambiente. Dois radiais cruzando em opacidade em vez de trocar a
          classe do gradiente: gradiente nao interpola em transition-colors, e a
          opacidade e composta pela GPU. */}
      <motion.div
        animate={{ opacity: step > 1 && !isSolana ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-radial-at-c from-amber-500/5 via-transparent to-transparent z-0 pointer-events-none"
      />
      <motion.div
        animate={{ opacity: isSolana ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-radial-at-c from-[#9945FF]/10 via-transparent to-transparent z-0 pointer-events-none"
      />

      {/* Cenario da Solana. Mora no orquestrador, e nao dentro de cada bloco 12-14,
          para os tres passos compartilharem o mesmo fundo continuo — mesmo motivo
          pelo qual o Antigravity fica no orquestrador da secao de IA. */}
      <AnimatePresence>
        {isSolana && (
          <motion.div
            key="solana-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0 pointer-events-none opacity-20"
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, #9945FF 1px, transparent 0)",
                backgroundSize: "48px 48px",
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(20,241,149,0.05)_50%,transparent_75%)] bg-size-[1000px_1000px] animate-[pulse_8s_infinite]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Holograma de particulas. Mora aqui, e nao dentro de um bloco de passo,
          por dois motivos. Os blocos entram com variantes de viagem que aplicam
          filter: blur, e um canvas animando por quadro dentro de um ancestral
          com filter obriga a rerrasterizar a subarvore inteira a cada valor da
          transicao. E aqui ele atravessa as trocas de passo sem remontar, que e
          o que permite a camera seguir avancando de um bloco para o proximo em
          vez de as particulas se reunirem de novo a cada tela. */}
      <AnimatePresence>
        {showHologram && (
          <motion.div
            key="bc-intro-hologram"
            initial={{ opacity: 0 }}
            animate={{ opacity: insideCube ? 0.5 : 0.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <ParticleImage
              src="/images/blockchian/into.png"
              alt="Cubo de dados encadeado"
              scale={isMobile ? 0.85 : 0.62}
              offsetX={0}
              offsetY={isMobile ? 0.06 : 0}
              /* 0.22 e medido, nao chutado: 47% dos pixels opacos desta arte tem
                 canal mais forte abaixo de 0.1 e sao as faces escuras do cubo.
                 Cortando ate 0.22 sobram as arestas acesas e os realces vermelhos,
                 e o teto de particulas passa a comprar grade fina em cima deles. */
              lightThreshold={0.22}
              density={3}
              particleSize={isMobile ? 1.8 : 2.2}
              maxParticles={isMobile ? 1400 : 4200}
              scatter={isMobile ? 140 : 220}
              gatherDuration={1800}
              stagger={600}
              pointerRepel={isMobile ? 26 : 48}
              repelRadius={isMobile ? 100 : 160}
              dragRadius={isMobile ? 160 : 280}
              dragStrength={0.85}
              /* Passo 2 e a entrada no cubo: as frases abrem para as laterais e
                 a camera atravessa a arte. Nao e scale CSS no canvas — o zoom
                 afasta as posicoes das particulas dentro dele, entao cada ponto
                 continua nitido em vez de virar um bloco borrado. */
              zoom={holoZoom}
              /* O vazio so abre depois de entrar: nos passos 1 e 2 o cubo e o
                 assunto e furar o meio dele nao faria sentido. */
              coreFade={insideCube ? (isMobile ? 220 : 360) : 0}
              zoomFollow={0.035}
              /* A desmontagem carrega o movimento parado, entao o idleDrift
                 recua: os dois somados so embolam a leitura. */
              idleDrift={0.35}
              dissolve={isMobile ? 8 : 13}
              dissolveSpeed={0.85}
              dissolveSpread={0.3}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <BlockchainHUD step={step} onBack={onBack} />

      <div className="relative z-10 w-full max-w-7xl flex items-center justify-center h-full px-12 mx-auto">
        {/* As keys ficam aqui, no filho direto do AnimatePresence: e delas que ele
            depende para saber que a tela mudou e rodar a animacao de saida. Sem
            key na chamada todos os blocos leem como "" e o exit nunca roda. */}
        {/* custom precisa estar nos dois lugares: no AnimatePresence ele alimenta
            a variante do bloco que esta SAINDO, no filho a do que esta ENTRANDO. */}
        <AnimatePresence mode="wait" custom={direction}>
          {step <= INTRO_END && <IntroStep key="bc-intro" step={step} direction={direction} />}

          {step >= FEATURES_START && step <= FEATURES_END && (
            <FeatureStep key="bc-features" step={step} direction={direction} />
          )}

          {step === TOPOLOGY_STEP && <TopologyStep key="bc-topology" direction={direction} />}

          {step >= ANALYSIS_START && step <= ANALYSIS_END && (
            <AnalysisStep key={`bc-analysis-${step}`} step={step} direction={direction} />
          )}

          {step === SOLANA_START && <SolanaIntro key="bc-solana-intro" direction={direction} />}
          {step === SOLANA_START + 1 && <SolanaDeepDive key="bc-solana-deep" direction={direction} />}
          {step === SOLANA_END && <SolanaEcosystem key="bc-solana-eco" direction={direction} />}

          {step === TOTAL_STEPS && <SloganStep key="bc-slogan" direction={direction} />}
        </AnimatePresence>
      </div>

      {showScrollHint && <ScrollIndicator />}

      {/* Indicador de continuidade: some no ultimo passo, onde nao ha para onde ir. */}
      {step < TOTAL_STEPS && !showScrollHint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 md:gap-2 pointer-events-none z-20 ${isMobile ? "opacity-40" : ""}`}
        >
          <div className="w-px h-8 md:h-12 bg-linear-to-b from-amber-500/30 to-transparent" />
        </motion.div>
      )}

      {/* Scanner Visual (Efeito de HUD) */}
      <motion.div
        animate={{ y: ["0%", "100%", "0%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 w-full h-px bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.5)] z-20 pointer-events-none"
      />
    </section>
  );
};
