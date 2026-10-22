type WordmarkProps = {
  small?: boolean;
};

export default function Wordmark({ small = true }: WordmarkProps) {
  return (
    <span className="wordmark">
      Strategy<i aria-hidden="true">.</i>
      <span className="sr-only"> </span>
      Experts
      {small && <small>Growth Partners</small>}
    </span>
  );
}
