import type { Metadata } from "next";
import { BlockchainView } from "./view";

export const metadata: Metadata = {
  title: "Blockchain",
  description:
    "Tokenização de ativos reais (RWA), smart contracts, governança em DAO e segurança on-chain. A FreitasALVF no ecossistema Solana, ChainLink, Polygon e Arbitrum.",
  openGraph: {
    title: "Blockchain | FreitasALVF",
    description:
      "Tokenização de ativos reais (RWA), smart contracts, governança em DAO e segurança on-chain, no ecossistema Solana, ChainLink, Polygon e Arbitrum.",
    type: "website",
    locale: "pt_BR",
    siteName: "FreitasALVF",
  },
};

export default function BlockchainPage() {
  return <BlockchainView />;
}
