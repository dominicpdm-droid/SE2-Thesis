import { useLayoutEffect, useRef } from "react";
import React from "react";
import { gsap } from "gsap";

export default function SlideLeft({
  children,
  selector = null,
  from = { autoAlpha: 0, xPercent: 20 },
  to = { autoAlpha: 1, xPercent: 0 },
  stagger = 1,
  duration = 1,
}) {
  const elementRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const target = selector
        ? elementRef.current.querySelectorAll(selector)
        : elementRef.current;
      gsap.fromTo(target, from, { ...to, stagger, duration });
    });

    return () => ctx.revert();
  }, []);

  return React.cloneElement(children, { ref: elementRef });
}
