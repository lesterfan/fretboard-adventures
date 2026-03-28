import React from "react";

export interface FretboardMarker {
  stringNum: number; // 1 (high E) to 6 (low E)
  fretNum: number; // 1 to 12
  label?: string; // optional text inside the dot
}

interface FretboardDiagramProps {
  markers?: FretboardMarker[];
  startFret?: number; // explicit start fret (default 1)
  numFretsToShow?: number; // default 5
  highlightedStrings?: number[]; // string numbers (1-6) to draw in accent color
}

const STRING_LABELS = ["E", "A", "D", "G", "B", "E"]; // low to high, left to right

const FretboardDiagram: React.FC<FretboardDiagramProps> = ({
  markers = [],
  startFret = 1,
  numFretsToShow = 5,
  highlightedStrings = [],
}) => {
  const endFret = Math.min(12, startFret + numFretsToShow - 1);
  const fretsToShow = endFret - startFret + 1;
  const showNut = startFret === 1;

  // Layout constants
  const stringSpacing = 30;
  const fretSpacing = 50;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 20;
  const numStrings = 6;

  const fretboardWidth = (numStrings - 1) * stringSpacing;
  const fretboardHeight = fretsToShow * fretSpacing;
  const svgWidth = paddingLeft + fretboardWidth + paddingRight;
  const svgHeight = paddingTop + fretboardHeight + paddingBottom;

  const getMarkerPosition = (stringNum: number, fretNum: number) => {
    const diagramCol = 6 - stringNum;
    const fretIndex = fretNum - startFret;
    return {
      x: paddingLeft + diagramCol * stringSpacing,
      y: paddingTop + fretIndex * fretSpacing + fretSpacing / 2,
    };
  };

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      style={{ maxWidth: "100%" }}
    >
      {/* String labels at top */}
      {STRING_LABELS.map((label, i) => (
        <text
          key={`label-${i}`}
          x={paddingLeft + i * stringSpacing}
          y={paddingTop - 12}
          textAnchor="middle"
          fontSize="13"
          fontFamily="sans-serif"
          fill="#333"
        >
          {label}
        </text>
      ))}

      {/* Nut or top fret line */}
      {showNut ? (
        <rect
          x={paddingLeft - stringSpacing / 4}
          y={paddingTop - 3}
          width={fretboardWidth + stringSpacing / 2}
          height={6}
          fill="#333"
          rx={1}
        />
      ) : (
        <line
          x1={paddingLeft}
          y1={paddingTop}
          x2={paddingLeft + fretboardWidth}
          y2={paddingTop}
          stroke="#333"
          strokeWidth={1}
        />
      )}

      {/* Fret lines */}
      {Array.from({ length: fretsToShow }, (_, i) => {
        const y = paddingTop + (i + 1) * fretSpacing;
        return (
          <line
            key={`fret-${i}`}
            x1={paddingLeft}
            y1={y}
            x2={paddingLeft + fretboardWidth}
            y2={y}
            stroke="#555"
            strokeWidth={0.75}
          />
        );
      })}

      {/* Fret numbers on the left */}
      {Array.from({ length: fretsToShow }, (_, i) => {
        const y = paddingTop + i * fretSpacing + fretSpacing / 2;
        return (
          <text
            key={`fretnum-${i}`}
            x={paddingLeft - 20}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="12"
            fontFamily="sans-serif"
            fill="#888"
          >
            {startFret + i}
          </text>
        );
      })}

      {/* Fret inlay dots */}
      {Array.from({ length: fretsToShow }, (_, i) => {
        const fret = startFret + i;
        const centerY = paddingTop + i * fretSpacing + fretSpacing / 2;
        const centerX = paddingLeft + fretboardWidth / 2;
        const dotRadius = 4;
        const isSingleDot = [3, 5, 7, 9].includes(fret);
        const isDoubleDot = fret === 12;

        if (isSingleDot) {
          return <circle key={`inlay-${i}`} cx={centerX} cy={centerY} r={dotRadius} fill="#ccc" />;
        }
        if (isDoubleDot) {
          const offset = stringSpacing;
          return (
            <React.Fragment key={`inlay-${i}`}>
              <circle cx={centerX - offset} cy={centerY} r={dotRadius} fill="#ccc" />
              <circle cx={centerX + offset} cy={centerY} r={dotRadius} fill="#ccc" />
            </React.Fragment>
          );
        }
        return null;
      })}

      {/* Strings (vertical lines) */}
      {Array.from({ length: numStrings }, (_, i) => {
        const x = paddingLeft + i * stringSpacing;
        // Column i (left to right) corresponds to string number 6-i (low E=6 on left, high E=1 on right)
        const appStringNum = 6 - i;
        const isHighlighted = highlightedStrings.includes(appStringNum);
        return (
          <line
            key={`string-${i}`}
            x1={x}
            y1={paddingTop}
            x2={x}
            y2={paddingTop + fretboardHeight}
            stroke={isHighlighted ? "#1976d2" : "#555"}
            strokeWidth={isHighlighted ? 2.5 : 1.5}
          />
        );
      })}

      {/* Markers */}
      {markers.map((marker, i) => {
        const { x, y } = getMarkerPosition(marker.stringNum, marker.fretNum);
        return (
          <React.Fragment key={`marker-${i}`}>
            <circle cx={x} cy={y} r={11} fill="#1976d2" />
            {marker.label && (
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="7"
                // fontWeight="bold"
                fill="white"
              >
                {marker.label}
              </text>
            )}
          </React.Fragment>
        );
      })}
    </svg>
  );
};

export default FretboardDiagram;
