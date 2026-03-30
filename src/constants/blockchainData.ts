import { Gem, Cpu, Users, ShieldAlert } from "lucide-react";
import React from 'react';

export const blockchainFeatures = [
  {
    icon: React.createElement(Gem, { className: "w-8 h-8 text-amber-500" }),
    title: "Tokenização (RWA)",
    description: "Transforme ativos reais do mundo físico em tokens digitais programáveis e fracionáveis.",
  },
  {
    icon: React.createElement(Cpu, { className: "w-8 h-8 text-amber-500" }),
    title: "Smart Contracts",
    description: "Automação total de processos com contratos inteligentes autoexecutáveis e auditáveis.",
  },
  {
    icon: React.createElement(Users, { className: "w-8 h-8 text-amber-500" }),
    title: "Governança (DAO)",
    description: "Decisões colegiadas, transparentes e imutáveis através de protocolos descentralizados.",
  },
  {
    icon: React.createElement(ShieldAlert, { className: "w-8 h-8 text-amber-500" }),
    title: "Segurança On-Chain",
    description: "Proteção máxima de dados e transações com criptografia de ponta e transparência total.",
  }
];

export const ecosystemPlatforms = [
  {
    name: "Solana",
    color: "text-purple-400",
    glow: "bg-purple-500/20",
    url: "https://solana.com",
    mission: "Processamento ultraveloz para adoção em massa.",
    description: "Infraestrutura de alta performance com taxas mínimas, permitindo que aplicações alcancem bilhões de usuários sem gargalos técnicos.",
    specs: [
      { l: "TPS_MAX", v: "65,000+" },
      { l: "BLOCK_TIME", v: "400ms" },
      { l: "VALIDATORS", v: "2,000+ ACTIVE" }
    ]
  },
  {
    name: "ChainLink",
    color: "text-blue-500",
    glow: "bg-blue-500/20",
    url: "https://chain.link",
    mission: "Conectando o mundo real aos smart contracts.",
    description: "A rede de oráculos líder que provê dados seguros e auditáveis off-chain para a automação total de processos on-chain.",
    specs: [
      { l: "DATA_FEEDS", v: "1000+ ACTIVE" },
      { l: "NET_VALUE_ENABLE", v: "$10B+" },
      { l: "ORACLE_NODES", v: "DECENTRALIZED" }
    ]
  },
  {
    name: "Polygon",
    color: "text-purple-600",
    glow: "bg-purple-700/20",
    url: "https://polygon.technology",
    mission: "Escalando o ecossistema Ethereum para todos.",
    description: "Uma solução de segunda camada que democratiza o acesso à Web3, mantendo a compatibilidade total com os padrões globais.",
    specs: [
      { l: "L2_SCALING", v: "ZK_PROOFS" },
      { l: "TX_COST", v: "< $0.01" },
      { l: "DA_LAYER", v: "AVALON_CORE" }
    ]
  },
  {
    name: "Arbitrum",
    color: "text-blue-400",
    glow: "bg-blue-400/20",
    url: "https://arbitrum.io",
    mission: "Segurança máxima com eficiência extrema.",
    description: "Rollups otimistas que herdam a robustez do Ethereum enquanto reduzem custos e aumentam a velocidade das transações complexas.",
    specs: [
      { l: "ROLLUP_TYPE", v: "OPTIMISTIC" },
      { l: "SEC_LEVEL", v: "ETHEREUM_L1" },
      { l: "GAS_EFFICIENCY", v: "99% SAVINGS" }
    ]
  }
];

export const solanaImmersionData = {
  hero: {
    title: "SOLANA ECOSYSTEM",
    subtitle: "A Fronteira da Performance Web3",
    metrics: [
      { label: "LATENCY", value: "400MS", detail: "SUB-SECOND FINALITY" },
      { label: "TX_COST", value: "<$0.001", detail: "AVERAGE FEE" },
      { label: "THROUGHPUT", value: "65K+", detail: "TPS CAPACITY" }
    ]
  },
  pillars: [
    {
      id: "speed",
      title: "VELOCIDADE RADICAL",
      description: "Otimização via Proof of History (PoH), permitindo que a rede processe transações em paralelo sem gargalos de consenso.",
      tech: "Gulf Stream & Sealevel"
    },
    {
      id: "scale",
      title: "ESCALA INFINITA",
      description: "Arquitetura projetada para acompanhar a Lei de Moore, escalando o throughput conforme o hardware evolui.",
      tech: "Turbine & Cloudbreak"
    },
    {
      id: "adoption",
      title: "ADOÇÃO REAL",
      description: "Infraestrutura pronta para pagamentos globais, NFTs e DeFi de alta frequência com experiência de usuário Web2.",
      tech: "Solana Pay & Actions"
    }
  ],
  ecosystem: [
    { name: "JUPITER", role: "Liquidez Agregada" },
    { name: "HELIUM", label: "DePIN Infrastructure" },
    { name: "HÉLIUS", role: "RPC/Developer Tools" },
    { name: "JITO", label: "MEV Optimization" }
  ]
};

