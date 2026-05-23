import { useMemo } from "react";

const whitepaperPath = "/docs/LexCrypt_Whitepape.docx";

export default function Whitepaper() {
  const embedUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const docUrl = new URL(whitepaperPath, window.location.origin).toString();
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(docUrl)}`;
  }, []);

  const isLocal =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  return (
    <div className="card">
      <h2>LexCrypt Whitepaper</h2>
      <p className="muted">
        This page serves the latest whitepaper document. If the preview does not render in your
        browser, use the download button.
      </p>
      <div className="row" style={{ marginBottom: 16 }}>
        <a className="primary" href={whitepaperPath} download>
          Download Whitepaper
        </a>
        <a className="secondary" href={whitepaperPath} target="_blank" rel="noreferrer">
          Open in New Tab
        </a>
      </div>
      {isLocal ? (
        <div className="muted">
          Inline preview requires a public URL. Please use Download/Open while running locally.
        </div>
      ) : (
        <iframe className="doc-frame" src={embedUrl} title="LexCrypt Whitepaper" />
      )}
    </div>
  );
}
