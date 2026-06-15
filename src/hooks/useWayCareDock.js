// ============================================================================
//  useWayCareDock.js  -  hook que mantém o estado da dock atualizado
// ============================================================================
//  Faz polling do /status a cada `intervalo` ms.
//  Uso:  const { status, erro, carregando } = useWayCareDock();
// ============================================================================

import { useState, useEffect } from "react";
import { getStatus } from "../services/waycareApi";

export function useWayCareDock(intervalo = 3000) {
  const [status, setStatus] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function buscar() {
      try {
        const dados = await getStatus();
        if (ativo) {
          setStatus(dados);
          setErro(null);
        }
      } catch (e) {
        if (ativo) setErro(e.message);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    buscar();                                   // primeira chamada imediata
    const id = setInterval(buscar, intervalo);  // depois, em loop
    return () => { ativo = false; clearInterval(id); };
  }, [intervalo]);

  return { status, erro, carregando };
}
