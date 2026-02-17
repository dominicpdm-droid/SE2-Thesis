import { useLayoutEffect, useRef } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { gsap } from "gsap";

export default function PageTransitions() {
  const location = useLocation();
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const el = containerRef.current;

    gsap.set(el, { opacity: 0 });

    gsap.to(el, {
      opacity: 1,
      duration: 1.2,
      ease: "circ.out",
    });
  }, [location]);

  return (
    <div ref={containerRef}>
      <Outlet />
    </div>
  );
}
