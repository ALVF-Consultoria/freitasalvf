"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import { useMobile } from "@/hooks/useMobile";
import { Antigravity } from "@/components/Antigravity";
import { ScrollIndicator } from "@/components/common/ScrollIndicator";
import { IntroQuote, IntroBrand } from "./IntroSteps";
import { AvaliativaIntro, AvaliativaCards, AvaliativaBridge } from "./AvaliativaStep";
import { StorytellingIntro, StorytellingCards, StorytellingBridge } from "./StorytellingStep";
import { BusinessIntro, BusinessCards, BusinessClose } from "./BusinessStep";
import { SaibaMaisStep } from "./SaibaMaisStep";

interface AISolutionProps {
  onBack: () => void;
}

export const AISolution = ({ onBack }: AISolutionProps) => {
  const isMobile = useMobile();
  // As duas telas de conceito vinham do antigo AITransition e agora abrem a
  // propria secao. contentStep preserva a numeracao original dos blocos (1..21),
  // para as guardas abaixo nao precisarem ser deslocadas.
  const INTRO_STEPS = 2;
  const CONTENT_STEPS = 22;

  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(1);
  // +1 descendo, -1 subindo. E o que faz a viagem se inverter ao voltar, em vez
  // de repetir a animacao de ida.
  const [direction, setDirection] = useState(1);
  const totalSteps = INTRO_STEPS + CONTENT_STEPS;
  const contentStep = step - INTRO_STEPS;
  const isIntro = step <= INTRO_STEPS;

  useStepNavigation({
    onNext: () => {
      if (step < totalSteps) {
        setDirection(1);
        setStep((prev) => prev + 1);
      } else onBack();
    },
    // Simetrico ao onNext: passar do ultimo passo sai da secao, e subir antes do
    // primeiro tambem — volta para a home em vez de travar no topo.
    onPrev: () => {
      if (step > 1) {
        setDirection(-1);
        setStep((prev) => prev - 1);
      } else onBack();
    },
    cooldown: isIntro ? 1500 : 700,
  });

  return (
    <section ref={sectionRef} className={`relative min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center overflow-hidden font-sans text-center ${isMobile ? 'p-6 pt-20' : 'py-20 px-6'}`}>
      {/* Antigravity nas duas telas de abertura. Como a key nao muda entre elas, o
          canvas nao remonta na passagem do 1 para o 2: o contexto WebGL sobrevive,
          as particulas nao sao resemeadas e o campo fica continuo por tras da
          troca de conteudo. Sai em fade so ao entrar no conteudo numerado. */}
      <AnimatePresence>
        {isIntro && (
          <motion.div
            key="antigravity-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <Antigravity
              count={300}
              magnetRadius={6}
              ringRadius={8}
              waveSpeed={0.4}
              waveAmplitude={1}
              particleSize={1}
              lerpSpeed={0.05}
              color="#5227FF"
              autoAnimate
              particleVariance={1}
              rotationSpeed={0}
              depthFactor={1}
              pulseSpeed={3}
              particleShape="capsule"
              fieldStrength={10}
              // Sem isso o R3F so escuta no wrapper do canvas, que o bloco de
              // conteudo cobre — o ponteiro so respondia nas bordas da tela.
              eventSource={isMobile ? undefined : sectionRef}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Ambient Lights */}
      <motion.div
        animate={{
          backgroundColor:
            contentStep <= 7 ? "rgba(8, 145, 178, 0.08)" :
            contentStep <= 14 ? "rgba(37, 99, 235, 0.08)" :
            "rgba(16, 185, 129, 0.08)"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] blur-[180px] rounded-full pointer-events-none transition-colors duration-1000"
      />

      {/* Scanline das telas de apresentacao (preservado do AITransition) */}
      {isIntro && (
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-cyan-400/3 to-transparent bg-size-[100%_4px] pointer-events-none z-0" />
      )}

      {/* Back Button */}
      <div className={`absolute ${isMobile ? 'top-6 left-6' : 'top-10 left-10'} z-50`}>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
        >
          <div className="p-2 rounded-full border border-white/10 group-hover:border-white/30 bg-white/5 backdrop-blur-md">
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase">FECHAR</span>
        </motion.button>
      </div>

      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center justify-center min-h-[60vh]">

        {/* As keys ficam aqui, no filho direto do AnimatePresence: e delas que ele
            depende para saber que a tela mudou e rodar a animacao de saida. */}
        {/* custom precisa estar nos dois lugares: no AnimatePresence ele alimenta
            a variante do bloco que esta SAINDO, no filho a do que esta ENTRANDO. */}
        <AnimatePresence mode="wait" custom={direction}>
          {/* === APRESENTACAO (steps 1-2) — herdado do antigo AITransition === */}
          {step === 1 && <IntroQuote key="intro-quote" direction={direction} />}
          {step === 2 && <IntroBrand key="intro-brand" direction={direction} />}

          {/* === AVALIATIVA (1-7) === */}
          {(contentStep === 1 || contentStep === 2) && <AvaliativaIntro key="aval-intro" contentStep={contentStep} direction={direction} />}
          {(contentStep >= 3 && contentStep <= 6) && <AvaliativaCards key="aval-cards" contentStep={contentStep} direction={direction} />}
          {contentStep === 7 && <AvaliativaBridge key="bridge-1" direction={direction} />}

          {/* === STORYTELLING (8-14) === */}
          {(contentStep === 8 || contentStep === 9) && <StorytellingIntro key="story-intro" contentStep={contentStep} direction={direction} />}
          {(contentStep >= 10 && contentStep <= 13) && <StorytellingCards key="story-cards" contentStep={contentStep} direction={direction} />}
          {contentStep === 14 && <StorytellingBridge key="bridge-2" direction={direction} />}

          {/* === BUSINESS AUTOMATION (15-21) === */}
          {(contentStep === 15 || contentStep === 16) && <BusinessIntro key="biz-intro" contentStep={contentStep} direction={direction} />}
          {(contentStep >= 17 && contentStep <= 20) && <BusinessCards key="biz-cards" contentStep={contentStep} direction={direction} />}
          {contentStep === 21 && <BusinessClose key="final-close" direction={direction} />}

          {/* === FECHAMENTO (22) === */}
          {contentStep === 22 && <SaibaMaisStep key="saiba-mais" direction={direction} />}
        </AnimatePresence>

        {(contentStep === 1 && !isMobile) && <ScrollIndicator />}

        {/* PROCEED INDICATOR */}
        {step < totalSteps && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }}
            className={`fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 md:gap-2 pointer-events-none ${isMobile ? 'opacity-40' : ''}`}
          >
            <div className="w-px h-8 md:h-12 bg-linear-to-b from-white/20 to-transparent" />
          </motion.div>
        )}
      </div>
    </section>
  );
};
