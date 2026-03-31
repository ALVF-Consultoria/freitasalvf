import { useEffect, useRef } from 'react';

interface UseStepNavigationProps {
  onNext: () => void;
  onPrev: () => void;
  threshold?: number;
  cooldown?: number;
  enabled?: boolean;
}

/**
 * Hook para gerenciar navegação por etapas via Scroll (Wheel) e Touch (Swipe).
 * Ideal para seções fixas que progridem em 'steps'.
 */
export const useStepNavigation = ({
  onNext,
  onPrev,
  threshold = 50,
  cooldown = 1200,
  enabled = true
}: UseStepNavigationProps) => {
  const lastEventTime = useRef(0);
  const touchStartY = useRef<number | null>(null);

  // Função auxiliar para verificar se um elemento permitiu o scroll interno
  const isAtScrollBoundary = (target: HTMLElement, deltaY: number) => {
    let current: HTMLElement | null = target;
    
    while (current && current !== document.body) {
      const style = window.getComputedStyle(current);
      const isScrollable = (style.overflowY === 'auto' || style.overflowY === 'scroll') && 
                          current.scrollHeight > current.clientHeight;

      if (isScrollable) {
        if (deltaY > 0) {
          // Tentando descer: permitir se JÁ estiver no fundo
          const isAtBottom = Math.ceil(current.scrollTop + current.clientHeight) >= current.scrollHeight;
          if (!isAtBottom) return false;
        } else if (deltaY < 0) {
          // Tentando subir: permitir se JÁ estiver no topo
          const isAtTop = current.scrollTop === 0;
          if (!isAtTop) return false;
        }
      }
      current = current.parentElement;
    }
    return true;
  };

  useEffect(() => {
    if (!enabled) return;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastEventTime.current < cooldown) return;

      // Se estiver dentro de um scroll interno que ainda não chegou ao fim, ignorar navegação global
      if (!isAtScrollBoundary(e.target as HTMLElement, e.deltaY)) return;

      if (e.deltaY > 0) {
        onNext();
        lastEventTime.current = now;
      } else if (e.deltaY < 0) {
        onPrev();
        lastEventTime.current = now;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;
      const now = Date.now();

      if (now - lastEventTime.current < cooldown) return;

      if (Math.abs(deltaY) > threshold) {
        // Para Touch, deltaY > 0 significa mover dedo pra cima (quer ver conteúdo de baixo)
        if (!isAtScrollBoundary(e.target as HTMLElement, deltaY)) {
          touchStartY.current = null;
          return;
        }

        if (deltaY > 0) {
          onNext(); // Swipe Up -> Next
        } else {
          onPrev(); // Swipe Down -> Prev
        }
        lastEventTime.current = now;
      }
      
      touchStartY.current = null;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onNext, onPrev, threshold, cooldown, enabled]);
};
