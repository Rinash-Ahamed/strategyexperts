type WordmarkProps = {
  small?: boolean;
};

export default function Wordmark({ small = true }: WordmarkProps) {
  return (
    <span className="wordmark">
      Strategy Experts
      {small && <small>Your Growth Partner</small>}
    </span>
  );
}
