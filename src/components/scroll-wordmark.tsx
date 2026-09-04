import { useEffect, useRef } from "react";

const MOTION_START = 0.08;
const MOTION_END = 0.9;
const MERGE_START = 0.7;
// Preserve the original 300dvh sequence in the first two-thirds of the
// expanded 400dvh section, then use the final third for the continuation.
const CHANGE_SEQUENCE_END = 2 / 3;

type MotionMetrics = {
  chanceX: number;
  chanceY: number;
  journeyX: number;
  journeyY: number;
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const smoothstep = (value: number) => {
  const progress = clamp(value);
  return progress * progress * (3 - 2 * progress);
};

export function ScrollWordmark() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const chanceRef = useRef<HTMLDivElement>(null);
  const chanceTargetRef = useRef<HTMLSpanElement>(null);
  const journeyJRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const chance = chanceRef.current;
    const chanceTarget = chanceTargetRef.current;
    const journeyJ = journeyJRef.current;

    if (!section || !stage || !chance || !chanceTarget || !journeyJ) {
      return;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame: number | null = null;
    let measurementFrame: number | null = null;
    let isDisposed = false;
    let metrics: MotionMetrics = {
      chanceX: 0,
      chanceY: 0,
      journeyX: 0,
      journeyY: 0,
    };

    const setFrame = (motionProgress: number, continuationProgress: number) => {
      const mergeProgress = smoothstep((motionProgress - MERGE_START) / (1 - MERGE_START));
      const dissolveProgress = smoothstep(motionProgress / 0.78);
      const continuationOffset = 1 - continuationProgress;

      stage.style.setProperty("--chance-x", `${metrics.chanceX * motionProgress}px`);
      stage.style.setProperty("--chance-y", `${metrics.chanceY * motionProgress}px`);
      stage.style.setProperty("--journey-x", `${metrics.journeyX * motionProgress}px`);
      stage.style.setProperty("--journey-y", `${metrics.journeyY * motionProgress}px`);
      stage.style.setProperty("--journey-scale", `${1 - motionProgress * 0.08}`);
      stage.style.setProperty("--journey-opacity", `${1 - mergeProgress}`);
      stage.style.setProperty("--remainder-opacity", `${1 - dissolveProgress}`);
      stage.style.setProperty("--remainder-shift", `${dissolveProgress * 40}px`);
      stage.style.setProperty("--remainder-blur", `${dissolveProgress * 10}px`);
      stage.style.setProperty("--source-opacity", `${1 - mergeProgress}`);
      stage.style.setProperty("--change-opacity", `${mergeProgress}`);
      stage.style.setProperty(
        "--ambient-shift",
        `${motionProgress * 12 + continuationProgress * 6}%`,
      );
      stage.style.setProperty("--continuation-opacity", `${continuationProgress}`);
      stage.style.setProperty("--continuation-blur", `${continuationOffset * 10}px`);
      stage.style.setProperty("--make-x", `${continuationOffset * 32}px`);
      stage.style.setProperty("--make-y", `${continuationOffset * 24}px`);
      stage.style.setProperty("--happen-x", `${continuationOffset * -32}px`);
      stage.style.setProperty("--happen-y", `${continuationOffset * -24}px`);
    };

    const renderCurrentFrame = () => {
      const sectionRect = section.getBoundingClientRect();
      const scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const rawProgress = clamp(-sectionRect.top / scrollDistance);
      const changeSequenceProgress = clamp(rawProgress / CHANGE_SEQUENCE_END);
      const motionProgress = reducedMotionQuery.matches
        ? 1
        : smoothstep((changeSequenceProgress - MOTION_START) / (MOTION_END - MOTION_START));
      const continuationProgress = reducedMotionQuery.matches
        ? 1
        : smoothstep((rawProgress - CHANGE_SEQUENCE_END) / (1 - CHANGE_SEQUENCE_END));

      setFrame(motionProgress, continuationProgress);
    };

    const renderFrame = () => {
      animationFrame = null;
      renderCurrentFrame();
    };

    const scheduleRender = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(renderFrame);
      }
    };

    const measure = () => {
      measurementFrame = null;

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }

      stage.style.setProperty("--chance-x", "0px");
      stage.style.setProperty("--chance-y", "0px");
      stage.style.setProperty("--journey-x", "0px");
      stage.style.setProperty("--journey-y", "0px");
      stage.style.setProperty("--journey-scale", "1");

      const stageRect = stage.getBoundingClientRect();
      const chanceRect = chance.getBoundingClientRect();
      const chanceTargetRect = chanceTarget.getBoundingClientRect();
      const journeyJRect = journeyJ.getBoundingClientRect();
      const chanceX = stageRect.left + (stageRect.width - chanceRect.width) / 2 - chanceRect.left;
      const chanceY = stageRect.top + (stageRect.height - chanceRect.height) / 2 - chanceRect.top;

      metrics = {
        chanceX,
        chanceY,
        journeyX:
          chanceTargetRect.left +
          chanceX +
          (chanceTargetRect.width - journeyJRect.width) / 2 -
          journeyJRect.left,
        journeyY: chanceTargetRect.top + chanceY - journeyJRect.top,
      };

      renderCurrentFrame();
    };

    const scheduleMeasure = () => {
      if (measurementFrame === null) {
        measurementFrame = window.requestAnimationFrame(measure);
      }
    };

    window.addEventListener("scroll", scheduleRender, { passive: true });
    window.addEventListener("resize", scheduleMeasure);
    reducedMotionQuery.addEventListener("change", scheduleMeasure);
    scheduleMeasure();

    void document.fonts.ready.then(() => {
      if (!isDisposed) {
        scheduleMeasure();
      }
    });

    return () => {
      isDisposed = true;
      window.removeEventListener("scroll", scheduleRender);
      window.removeEventListener("resize", scheduleMeasure);
      reducedMotionQuery.removeEventListener("change", scheduleMeasure);

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }

      if (measurementFrame !== null) {
        window.cancelAnimationFrame(measurementFrame);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[400dvh] bg-background motion-reduce:h-dvh"
      data-home-section="wordmark-transition"
      aria-labelledby="wordmark-title"
    >
      <h1 id="wordmark-title" className="sr-only">
        Chance Journey becomes Make Change Happen
      </h1>
      <div
        ref={stageRef}
        className="sticky top-0 isolate h-dvh overflow-hidden text-foreground [--ambient-shift:0%] [--chance-x:0px] [--chance-y:0px] [--change-opacity:0] [--continuation-blur:10px] [--continuation-opacity:0] [--happen-x:-32px] [--happen-y:-24px] [--journey-opacity:1] [--journey-scale:1] [--journey-x:0px] [--journey-y:0px] [--make-x:32px] [--make-y:24px] [--remainder-blur:0px] [--remainder-opacity:1] [--remainder-shift:0px] [--source-opacity:1] [background:radial-gradient(circle_at_calc(12%_+_var(--ambient-shift))_18%,color-mix(in_oklch,#7c3aed_9%,transparent),transparent_38%),radial-gradient(circle_at_calc(88%_-_var(--ambient-shift))_82%,color-mix(in_oklch,#fb7185_10%,transparent),transparent_40%),var(--background)]"
      >
        <div
          className="absolute inset-0 overflow-hidden font-mono text-[clamp(5rem,13vw,12rem)] leading-[0.82] font-bold tracking-[-0.09em] whitespace-nowrap [@media(max-width:640px)]:text-[clamp(3.75rem,17vw,5.75rem)] [@media(max-width:640px)]:tracking-[-0.1em]"
          aria-hidden="true"
        >
          <div
            ref={chanceRef}
            className="absolute top-[max(6.5rem,12vh)] left-[clamp(1.5rem,4vw,4.5rem)] m-0 flex items-baseline [transform:translate3d(var(--chance-x),var(--chance-y),0)] will-change-transform motion-reduce:will-change-auto [@media(max-width:640px)]:inset-x-0 [@media(max-width:640px)]:top-[max(6.5rem,15vh)] [@media(max-width:640px)]:justify-center"
          >
            <span>Chan</span>
            <span ref={chanceTargetRef} className="relative inline-block">
              <span className="[opacity:var(--source-opacity)]">c</span>
              <span className="absolute inset-0 [opacity:var(--change-opacity)]">g</span>
            </span>
            <span>e</span>
          </div>
          <div className="absolute right-[clamp(1.5rem,4vw,4.5rem)] bottom-[max(2.5rem,9vh)] m-0 flex items-baseline will-change-transform motion-reduce:will-change-auto [@media(max-width:640px)]:inset-x-0 [@media(max-width:640px)]:bottom-[max(2rem,10vh)] [@media(max-width:640px)]:justify-center">
            <span
              ref={journeyJRef}
              className="inline-block [transform-origin:50%_60%] [transform:translate3d(var(--journey-x),var(--journey-y),0)_scale(var(--journey-scale))] [opacity:var(--journey-opacity)] [will-change:transform,opacity] motion-reduce:will-change-auto"
            >
              J
            </span>
            <span className="inline-block [transform:translate3d(var(--remainder-shift),0,0)] [opacity:var(--remainder-opacity)] [filter:blur(var(--remainder-blur))] [will-change:transform,opacity,filter] motion-reduce:will-change-auto">
              ourney
            </span>
          </div>
          <div
            className="absolute top-[max(6.5rem,12vh)] left-[clamp(1.5rem,4vw,4.5rem)] m-0 [transform:translate3d(var(--make-x),var(--make-y),0)] [opacity:var(--continuation-opacity)] [filter:blur(var(--continuation-blur))] [will-change:transform,opacity,filter] motion-reduce:will-change-auto [@media(max-width:640px)]:inset-x-0 [@media(max-width:640px)]:top-[max(6.5rem,15vh)] [@media(max-width:640px)]:text-center"
            data-wordmark-word="make"
          >
            Make
          </div>
          <div
            className="absolute right-[clamp(1.5rem,4vw,4.5rem)] bottom-[max(2.5rem,9vh)] m-0 [transform:translate3d(var(--happen-x),var(--happen-y),0)] [opacity:var(--continuation-opacity)] [filter:blur(var(--continuation-blur))] [will-change:transform,opacity,filter] motion-reduce:will-change-auto [@media(max-width:640px)]:inset-x-0 [@media(max-width:640px)]:bottom-[max(2rem,10vh)] [@media(max-width:640px)]:text-center"
            data-wordmark-word="happen"
          >
            Happen
          </div>
        </div>
      </div>
    </section>
  );
}
