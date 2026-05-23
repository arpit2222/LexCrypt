import { useMemo } from "react";

const pitchDeckPath = "/docs/LexCrypt_PitchDeck.pptx";

export default function PitchDeck() {
  const embedUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const docUrl = new URL(pitchDeckPath, window.location.origin).toString();
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(docUrl)}`;
  }, []);

  const isLocal =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  return (
    <div className="card">
      <h2>LexCrypt Pitch Deck</h2>
      <p className="muted">
        This page serves the latest pitch deck. If the preview does not render in your browser,
        use the download button.
      </p>
      <div className="row" style={{ marginBottom: 16 }}>
        <a className="primary" href={pitchDeckPath} download>
          Download Pitch Deck
        </a>
        <a className="secondary" href={pitchDeckPath} target="_blank" rel="noreferrer">
          Open in New Tab
        </a>
      </div>
      {isLocal ? (
        <div className="muted">
          Inline preview requires a public URL. Please use Download/Open while running locally.
        </div>
      ) : (
        <iframe className="doc-frame" src={embedUrl} title="LexCrypt Pitch Deck" />
      )}
    </div>
  );
}
