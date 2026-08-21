"use client";

import {
  ClipboardCheck, BarChart3, ShieldCheck, Zap,
  BookOpen, PenTool, Globe, FileText,
  MessageCircle, LayoutDashboard, Rocket, TrendingUp
} from "lucide-react";

export const naiaAvaliativaFeatures = [
  {
    icon: <ClipboardCheck className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />,
    title: "Criação e correção automática",
    description: "Cria, aplica e corrige provas automaticamente de forma inteligente.",
  },
  {
    icon: <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />,
    title: "Relatórios Detalhados",
    description: "Gere relatórios para pedagogos, coordenadores e responsáveis.",
  },
  {
    icon: <Zap className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />,
    title: "Feedback Imediato",
    description: "Correção instantânea com comentários pedagógicos personalizados.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />,
    title: "Conformidade e Segurança",
    description: "Controle de identidade e audit trail para avaliações formais.",
  }
];

export const naiaStorytellingFeatures = [
  {
    icon: <FileText className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />,
    title: "Histórias Autônomas",
    description: "Geração automática de Histórias a partir das suas respostas.",
  },
  {
    icon: <PenTool className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />,
    title: "Validação Humana",
    description: "Não Gostou de algo? Você pode editar tudo com apenas 2 cliques.",
  },
  {
    icon: <Globe className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />,
    title: "Multilinguagem",
    description: "Conteúdo focado em audiência em diversos idiomas e exportação.",
  },
  {
    icon: <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />,
    title: "Experiência de Leitura",
    description: "Leia como PDF, na plataforma ou como livro digital folheável.",
  }
];

export const naiaBusinessFeatures = [
  {
    icon: <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />,
    title: "WhatsApp Inteligente",
    description: "Atendimento 24/7 com IA que entende o contexto e fecha vendas.",
  },
  {
    icon: <LayoutDashboard className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />,
    title: "Funil em Tempo Real",
    description: "Visualize cada etapa da jornada do cliente em um dashboard ultra-imersivo.",
  },
  {
    icon: <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />,
    title: "Gestão de Performance",
    description: "Métricas avançadas de conversão e ROI integradas ao seu CRM.",
  },
  {
    icon: <Rocket className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />,
    title: "Escala Infinita",
    description: "Processe milhares de leads simultaneamente com qualidade humana.",
  }
];
