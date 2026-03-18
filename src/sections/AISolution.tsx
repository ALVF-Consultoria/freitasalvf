"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ParticlesBackground } from "../components/ParticlesBackground";
import { 
  ArrowLeft, ClipboardCheck, BarChart3, ShieldCheck, Zap, 
  MessageSquareQuote, BookOpen, PenTool, Globe, FileText,
  MessageCircle, LayoutDashboard, Rocket, TrendingUp
} from "lucide-react";

interface AISolutionProps {
  onBack: () => void;
}

const naiaAvaliativaFeatures = [
  {
    icon: <ClipboardCheck className="w-8 h-8 text-cyan-400" />,
    title: "Criação e correção automática",
    description: "Cria, aplica e corrige provas automaticamente de forma inteligente.",
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-cyan-400" />,
    title: "Relatórios Detalhados",
    description: "Gere relatórios para pedagogos, coordenadores e responsáveis.",
  },
  {
    icon: <Zap className="w-8 h-8 text-cyan-400" />,
    title: "Feedback Imediato",
    description: "Correção instantânea com comentários pedagógicos personalizados.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-cyan-400" />,
    title: "Conformidade e Segurança",
    description: "Controle de identidade e audit trail para avaliações formais.",
  }
];

const naiaStorytellingFeatures = [
  {
    icon: <FileText className="w-8 h-8 text-blue-400" />,
    title: "Histórias Autônomas",
    description: "Geração automática de Histórias a partir das suas respostas.",
  },
  {
    icon: <PenTool className="w-8 h-8 text-blue-400" />,
    title: "Validação Humana",
    description: "Não Gostou de algo? Você pode editar tudo com apenas 2 cliques.",
  },
  {
    icon: <Globe className="w-8 h-8 text-blue-400" />,
    title: "Multilinguagem",
    description: "Conteúdo focado em audiência em diversos idiomas e exportação.",
  },
  {
    icon: <BookOpen className="w-8 h-8 text-blue-400" />,
    title: "Experiência de Leitura",
    description: "Leia como PDF, na plataforma ou como livro digital folheável.",
  }
];

const naiaBusinessFeatures = [
  {
    icon: <MessageCircle className="w-8 h-8 text-emerald-400" />,
    title: "WhatsApp Inteligente",
    description: "Atendimento 24/7 com IA que entende o contexto e fecha vendas.",
  },
  {
    icon: <LayoutDashboard className="w-8 h-8 text-emerald-400" />,
    title: "Funil em Tempo Real",
    description: "Visualize cada etapa da jornada do cliente em um dashboard ultra-imersivo.",
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-emerald-400" />,
    title: "Gestão de Performance",
    description: "Métricas avançadas de conversão e ROI integradas ao seu CRM.",
  },
  {
    icon: <Rocket className="w-8 h-8 text-emerald-400" />,
    title: "Escala Infinita",
    description: "Processe milhares de leads simultaneamente com qualidade humana.",
  }
];

export const AISolution = ({ onBack }: AISolutionProps) => {
  /*
    steps overview:
    1-2: Avaliativa Intro
    3-6: Avaliativa Cards 1-4
    7: Bridge Slogan 1
    8-9: Storytelling Intro
    10-13: Storytelling Cards 1-4
    14: Bridge Slogan 2 (Business Transition)
    15-16: Business Intro
    17-20: Business Cards 1-4
    21: Final Conclusion
  */
  const [step, setStep] = useState(1);
  const lastScrollTime = useRef(0);
  const totalSteps = 21;

  useEffect(() => {
    const handleNavigation = (direction: "next" | "prev") => {
      const now = Date.now();
      if (now - lastScrollTime.current > 700) { // Cooldown mais agressivo para 21 steps
        setStep((prev) => {
          if (direction === "next" && prev < totalSteps) return prev + 1;
          if (direction === "prev" && prev > 1) return prev - 1;
          return prev;
        });
        lastScrollTime.current = now;
      }
    };

    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        handleNavigation("next");
      } else if (e.deltaY < 0) {
        handleNavigation("prev");
      }
    };

    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center overflow-hidden py-20 px-6 font-sans text-center">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <ParticlesBackground />
      </div>

      {/* Dynamic Ambient Lights */}
      <motion.div 
        animate={{ 
          backgroundColor: 
            step <= 7 ? "rgba(8, 145, 178, 0.08)" : 
            step <= 14 ? "rgba(37, 99, 235, 0.08)" : 
            "rgba(16, 185, 129, 0.08)"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] blur-[180px] rounded-full pointer-events-none transition-colors duration-1000" 
      />
      
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onBack}
        className="absolute top-10 left-10 z-50 flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
      >
        <div className="p-2 rounded-full border border-white/10 group-hover:border-white/30 bg-white/5 backdrop-blur-md">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="text-xs font-mono tracking-widest uppercase">Dashboard</span>
      </motion.button>

      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center justify-center min-h-[60vh]">
        
        {/* === AVALIATIVA (1-6) === */}
        <AnimatePresence mode="wait">
          {(step === 1 || step === 2) && (
            <motion.div
              key="aval-intro"
              initial={{ opacity: 0, scale: 0.5, rotateY: 20, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, rotateY: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.5, rotateY: -20, filter: "blur(30px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center absolute"
            >
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                  NAIA <span className="text-cyan-400">Avaliativa</span>
                </h2>
                <p className="text-cyan-400 font-mono text-xl md:text-2xl tracking-[0.4em] uppercase mt-2 opacity-80">Educação Inteligente</p>
              </motion.div>
              {step >= 2 && (
                <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl text-white/80 text-lg md:text-2xl italic font-light">
                  Plataforma educacional com IA. Criação, aplicação e correção de provas de forma totalmente automatizada e segura para instituições.
                </motion.p>
              )}
            </motion.div>
          )}

          {(step >= 3 && step <= 6) && (
            <motion.div
              key="aval-cards"
              initial={{ opacity: 0, rotateX: 10 }}
              animate={{ opacity: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 2, filter: "blur(40px)" }}
              className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {naiaAvaliativaFeatures.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8, z: -100 }}
                  animate={step > i + 2 ? { opacity: 1, scale: 1, z: 0 } : { opacity: 0 }}
                  className="p-8 rounded-[32px] border border-cyan-400/20 bg-cyan-950/20 backdrop-blur-3xl shadow-[0_0_30px_rgba(34,211,238,0.05)]"
                >
                  <div className="mb-6 p-5 rounded-2xl bg-cyan-400/10 text-cyan-400 inline-block">{f.icon}</div>
                  <h4 className="text-lg font-bold text-white uppercase mb-4">{f.title}</h4>
                  <p className="text-sm text-white/50 font-light">{f.description}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {step === 7 && (
            <motion.div
              key="bridge-1"
              initial={{ opacity: 0, scale: 0.2, filter: "blur(30px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 4, filter: "blur(50px)" }}
              className="flex flex-col items-center absolute"
            >
              <MessageSquareQuote className="w-12 h-12 text-cyan-400 mb-8 opacity-50" />
              <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_40px_rgba(34,211,238,0.6)]">
                O futuro da Educação é <br />
                <span className="text-cyan-400">Humano</span> e <span className="text-cyan-400">Inteligente</span>
              </h2>
            </motion.div>
          )}

          {/* === STORYTELLING (8-13) === */}
          {(step === 8 || step === 9) && (
            <motion.div
              key="story-intro"
              initial={{ opacity: 0, x: -100, skewX: 10, filter: "blur(20px)" }}
              animate={{ opacity: 1, x: 0, skewX: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 100, skewX: -10, filter: "blur(30px)" }}
              className="flex flex-col items-center absolute"
            >
              <div className="mb-8 font-black uppercase tracking-tighter">
                <h2 className="text-5xl md:text-8xl text-white drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                  NAIA <span className="text-blue-500">Storytelling</span>
                </h2>
                <p className="text-blue-400 font-mono text-xl md:text-2xl tracking-[0.4em] mt-2 opacity-80">Histórias Autônomas</p>
              </div>
              {step >= 9 && (
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl text-white/80 text-lg md:text-2xl italic font-light">
                  Geração automática de histórias a partir das suas respostas. Conteúdo emocional focado em audiência e engajamento.
                </motion.p>
              )}
            </motion.div>
          )}

          {(step >= 10 && step <= 13) && (
            <motion.div
              key="story-cards"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -500, filter: "blur(50px)" }}
              className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {naiaStorytellingFeatures.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={step > i + 9 ? { opacity: 1, y: 0 } : { opacity: 0 }}
                  className="p-8 rounded-[32px] border border-blue-500/20 bg-blue-950/10 backdrop-blur-3xl shadow-[0_0_30px_rgba(59,130,246,0.05)]"
                >
                  <div className="mb-6 p-5 rounded-2xl bg-blue-500/10 text-blue-400 inline-block">{f.icon}</div>
                  <h4 className="text-lg font-bold text-white uppercase mb-4">{f.title}</h4>
                  <p className="text-sm text-white/50 font-light">{f.description}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {step === 14 && (
            <motion.div
              key="bridge-2"
              initial={{ opacity: 0, scale: 1.5, filter: "blur(30px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0, filter: "blur(50px)" }}
              className="flex flex-col items-center absolute"
            >
              <Rocket className="w-12 h-12 text-blue-400 mb-8 animate-bounce" />
              <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight">
                Escalando para o <br />
                <span className="text-blue-500 text-glow-blue">Próximo Nível</span>
              </h2>
            </motion.div>
          )}

          {/* === BUSINESS AUTOMATION (15-21) === */}
          {(step === 15 || step === 16) && (
            <motion.div
              key="biz-intro"
              initial={{ opacity: 0, scale: 2, filter: "blur(50px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.5, filter: "blur(30px)" }}
              className="flex flex-col items-center absolute"
            >
              <div className="mb-8 font-black uppercase tracking-tighter">
                <h2 className="text-5xl md:text-8xl text-white drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                  NAIA <span className="text-emerald-400">Business</span>
                </h2>
                <p className="text-emerald-400 font-mono text-xl md:text-2xl tracking-[0.4em] mt-2 opacity-80">WhatsApp & Dashboard</p>
              </div>
              {step >= 16 && (
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl text-white/80 text-lg md:text-2xl italic font-light">
                  Revolucione seu atendimento e converta mais com automação inteligente e visão total do seu funil de vendas.
                </motion.p>
              )}
            </motion.div>
          )}

          {(step >= 17 && step <= 20) && (
            <motion.div
              key="biz-cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0, rotate: 180, filter: "blur(50px)" }}
              className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {naiaBusinessFeatures.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, rotateY: 180 }}
                  animate={step > i + 16 ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="p-8 rounded-[32px] border border-emerald-500/20 bg-emerald-950/10 backdrop-blur-3xl shadow-[0_0_40px_rgba(16,185,129,0.1)]"
                >
                  <div className="mb-6 p-5 rounded-2xl bg-emerald-500/10 text-emerald-400 inline-block">{f.icon}</div>
                  <h4 className="text-lg font-bold text-white uppercase mb-4">{f.title}</h4>
                  <p className="text-sm text-white/50 font-light">{f.description}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {step === 21 && (
            <motion.div
              key="final-close"
              initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              className="flex flex-col items-center absolute w-full max-w-4xl"
            >
              <TrendingUp className="w-16 h-16 text-emerald-400 mb-8 animate-pulse" />
              <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight mb-8">
                Visão Total. <br />
                <span className="text-emerald-400">Escala Infinita.</span>
              </h2>
              <p className="text-white/60 text-lg md:text-2xl font-light italic mb-12">
                Domine seu mercado com a inteligência autônoma que trabalha 24/7 por você.
              </p>
              <button 
                onClick={onBack}
                className="px-12 py-5 rounded-full border border-emerald-500/30 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 font-mono text-sm tracking-[0.3em] uppercase transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)]"
              >
                ENCERRAR_CONEXÃO_SISTEMA
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PROCEED INDICATOR */}
        {step < totalSteps && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">PROXIMO_MODULO_DISPONIVEL</span>
            <div className="w-px h-12 bg-linear-to-b from-white/20 to-transparent" />
          </motion.div>
        )}
      </div>

      {/* Footer Labels */}
      <div className="absolute bottom-6 left-8 flex flex-col gap-1 opacity-20 font-mono text-[8px] text-white pointer-events-none uppercase text-left">
        <span>AGENT_PROTOCOL: NAIA_V6.1.0</span>
        <span>ACTIVE_MODULE: {step <= 7 ? 'AVALIATIVA' : step <= 14 ? 'STORYTELLING' : 'BUSINESS_INTEL'}</span>
        <span>SEQUENCE_BUFFER: {step}/21</span>
      </div>
    </section>
  );
};
