import { useEffect, useState } from "react";

/**
 * Cycles through a list of phrases with a type-out / pause / delete rhythm.
 */
export function Typewriter({ phrases, typingSpeed = 45, deletingSpeed = 25, pause = 1600 }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];

    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }

    if (deleting && text === "") {
      setDeleting(false);
      setPhraseIndex((i) => (i + 1) % phrases.length);
      return;
    }

    const t = setTimeout(
      () => {
        setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
      },
      deleting ? deletingSpeed : typingSpeed,
    );

    return () => clearTimeout(t);
  }, [text, deleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pause]);

  return (
    <span>
      {text}
      <span className="inline-block w-[2px] h-[1em] bg-cyan-400 ml-1 align-middle animate-pulse" />
    </span>
  );
}
