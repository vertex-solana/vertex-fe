import { useState, useEffect, useRef } from 'react';

export function useScrollSpy(selectors: string[], options?: IntersectionObserverInit) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = selectors.map(selector => 
      document.querySelector(selector)
    ).filter(Boolean) as Element[];

    if (elements.length === 0) return;

    const defaultOptions: IntersectionObserverInit = {
      rootMargin: '0px 0px -80% 0px',
      threshold: 0.1,
      ...options
    };

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, defaultOptions);

    elements.forEach((element) => {
      observer.current?.observe(element);
    });

    return () => {
      elements.forEach((element) => {
        observer.current?.unobserve(element);
      });
    };
  }, [selectors, options]);

  return activeId;
}
