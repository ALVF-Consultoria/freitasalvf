import type { Metadata } from "next";
import { SolucoesIAView } from "./view";

export const metadata: Metadata = {
  title: "Soluções em IA",
  description:
    "NAIA, a Interface Autônoma da FreitasALVF. Criação e correção automática de provas para instituições de ensino, geração autônoma de histórias e atendimento inteligente no WhatsApp.",
  openGraph: {
    title: "Soluções em IA | FreitasALVF",
    description:
      "NAIA, a Interface Autônoma da FreitasALVF: avaliação educacional automatizada, storytelling autônomo e atendimento inteligente no WhatsApp.",
    type: "website",
    locale: "pt_BR",
    siteName: "FreitasALVF",
  },
};

export default function SolucoesIAPage() {
  return <SolucoesIAView />;
}
