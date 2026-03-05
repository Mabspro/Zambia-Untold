"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import type { Marker } from "@/data/markers";
import type { Narrative } from "@/data/narratives";

type ExportBriefButtonProps = {
  marker: Marker;
  narrative: Narrative;
};

/**
 * Flatten a Narrative to plain text for the export dossier.
 * Supports both legacy `body` string and structured `blocks` array.
 * Only paragraph blocks are included; images and quotes are skipped.
 */
function narrativeBodyText(n: Narrative): string {
  if (n.blocks && n.blocks.length > 0) {
    return n.blocks
      .filter((b): b is { type: "paragraph"; content: string } => b.type === "paragraph")
      .map((b) => b.content)
      .join("\n\n");
  }
  return n.body;
}

export function ExportBriefButton({ marker, narrative }: ExportBriefButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const escapeHtml = (text: string) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Create a temporary hidden container for the dossier layout
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "800px";
      container.style.backgroundColor = "#0F0B08";
      container.style.color = "#E4D7C5";
      container.style.fontFamily = "sans-serif";
      container.style.padding = "40px";
      container.style.boxSizing = "border-box";
      
      // Capture the current WebGL canvas for the globe thumbnail
      // We grab the existing canvas so we don't need to re-render WebGL
      let globeDataUrl = "";
      const canvas = document.querySelector("canvas");
      if (canvas) {
        try {
          globeDataUrl = canvas.toDataURL("image/jpeg", 0.9);
        } catch {
          globeDataUrl = "";
        }
      }

      const dateStr = new Date().toISOString().split("T")[0];

      // Build the dossier HTML
      container.innerHTML = `
        <div style="border: 1px solid rgba(184, 115, 51, 0.4); padding: 30px;">
          
          <!-- Header -->
          <div style="border-bottom: 2px solid #b87333; padding-bottom: 15px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end;">
            <div>
              <div style="font-family: monospace; color: #b87333; font-size: 14px; letter-spacing: 0.15em; margin-bottom: 5px;">DOCUMENT CLASSIFICATION: DECLASSIFIED</div>
              <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.2em; color: #E4D7C5; text-transform: uppercase;">ZAMBIA UNTOLD &mdash; HISTORICAL RECORD</h1>
            </div>
            <div style="font-family: monospace; color: rgba(228, 215, 197, 0.5); font-size: 12px; text-align: right;">
              <div>FILE REF: ZU-${marker.id.toUpperCase()}</div>
              <div>DATE: ${dateStr}</div>
            </div>
          </div>

          <!-- Body Grid -->
          <div style="display: flex; gap: 30px;">
            
            <!-- Left Column: Thumbnail & Meta -->
            <div style="width: 300px; flex-shrink: 0;">
              ${
                globeDataUrl
                  ? `<div style="width: 100%; height: 220px; background-image: url('${globeDataUrl}'); background-size: cover; background-position: center; border: 1px solid rgba(184, 115, 51, 0.3); margin-bottom: 15px;"></div>`
                  : `<div style="width: 100%; height: 220px; background-color: #1a1512; border: 1px solid rgba(184, 115, 51, 0.3); margin-bottom: 15px; display: flex; align-items: center; justify-content: center; font-family: monospace; color: rgba(184, 115, 51, 0.5);">[ VISUAL ORBIT DATA ]</div>`
              }
              <div style="font-family: monospace; font-size: 11px; color: rgba(228, 215, 197, 0.7); line-height: 1.6;">
                <div><strong>COORDINATES:</strong> <br/>${marker.coordinates.lat.toFixed(4)}&deg; LAT, ${marker.coordinates.lng.toFixed(4)}&deg; LNG</div>
                <div style="margin-top: 10px;"><strong>ELEVATION:</strong> <br/>${marker.coordinates.alt}M AMSL</div>
                <div style="margin-top: 10px;"><strong>EPOCH:</strong> <br/>${marker.epochLabel.toUpperCase()}</div>
                <div style="margin-top: 10px;"><strong>CLASSIFICATION:</strong> <br/>${marker.tag}</div>
              </div>
            </div>

            <!-- Right Column: Narrative -->
            <div style="flex-grow: 1;">
              <h2 style="font-family: serif; font-size: 32px; font-weight: 500; line-height: 1.2; margin: 0 0 15px 0; color: #E4D7C5;">
                ${escapeHtml(marker.headline)}
              </h2>
              <div style="font-family: sans-serif; font-size: 16px; color: #B8A58F; font-style: italic; margin-bottom: 25px; line-height: 1.4;">
                ${escapeHtml(marker.subhead)}
              </div>
              
              <div style="height: 1px; background-color: rgba(184, 115, 51, 0.3); margin-bottom: 25px;"></div>
              
              <div style="font-size: 15px; color: #D0C1AD; line-height: 1.7;">
                ${escapeHtml(narrativeBodyText(narrative).split("\n\n")[0] ?? "")}
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid rgba(184, 115, 51, 0.3); margin-top: 40px; padding-top: 15px; display: flex; justify-content: space-between; font-family: monospace; font-size: 10px; color: rgba(228, 215, 197, 0.4); letter-spacing: 0.1em;">
            <div>ZAMBIA UNTOLD &middot; SOVEREIGN ARCHIVE INITIATIVE</div>
            <div>ZAMBIAUNTOLD.COM</div>
          </div>

        </div>
      `;

      document.body.appendChild(container);

      // Give images/fonts a tiny tick to paint
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvasResult = await html2canvas(container, {
        backgroundColor: "#0F0B08",
        scale: 2, // higher res for the exported image
        logging: false,
      });

      // Cleanup
      document.body.removeChild(container);

      // Trigger download
      const image = canvasResult.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `ZAMBIA_UNTOLD_BRIEF_${marker.id.toUpperCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error("Failed to generate brief export", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`flex items-center gap-2 rounded border border-copper/30 bg-copper/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-copper transition-colors duration-300 hover:bg-copper/15 disabled:opacity-50`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {isExporting ? "GENERATING..." : "EXPORT BRIEF"}
    </button>
  );
}
