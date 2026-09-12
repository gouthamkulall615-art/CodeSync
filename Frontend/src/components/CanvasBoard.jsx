// src/components/CanvasBoard.jsx
import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Transformer } from "react-konva";
import "./CanvasBoard.css";

let idCounter = 0;
const nextId = () => `shape-${idCounter++}`;

export default function CanvasBoard() {
  const [shapes, setShapes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const stageRef = useRef(null);
  const transformerRef = useRef(null);
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // Size the canvas to fill its parent container, not the whole browser window
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Attach the transformer (resize handles) to whichever shape is selected
  useEffect(() => {
    if (!transformerRef.current) return;
    const stage = stageRef.current;
    const selectedNode = selectedId ? stage.findOne(`#${selectedId}`) : null;

    if (selectedNode) {
      transformerRef.current.nodes([selectedNode]);
    } else {
      transformerRef.current.nodes([]);
    }
    transformerRef.current.getLayer().batchDraw();
  }, [selectedId, shapes]);

  const addRectangle = () => {
    const id = nextId();
    setShapes((prev) => [
      ...prev,
      {
        id,
        type: "rect",
        x: 80 + Math.random() * 200,
        y: 80 + Math.random() * 150,
        width: 120,
        height: 80,
        fill: "#4f7cff",
      },
    ]);
    setSelectedId(id);
  };

  const addCircle = () => {
    const id = nextId();
    setShapes((prev) => [
      ...prev,
      {
        id,
        type: "circle",
        x: 150 + Math.random() * 200,
        y: 150 + Math.random() * 150,
        radius: 50,
        fill: "#ff7a59",
      },
    ]);
    setSelectedId(id);
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setShapes((prev) => prev.filter((s) => s.id !== selectedId));
    setSelectedId(null);
  };

  // Click on empty canvas area deselects everything
  const handleStageMouseDown = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  const updateShapePosition = (id, x, y) => {
    setShapes((prev) => prev.map((s) => (s.id === id ? { ...s, x, y } : s)));
  };

  const updateShapeTransform = (id, node) => {
    // On resize, Konva scales the node rather than changing width/height directly.
    // We read the scale, apply it to width/height, then reset scale to 1.
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    setShapes((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        if (s.type === "rect") {
          return {
            ...s,
            x: node.x(),
            y: node.y(),
            width: Math.max(20, node.width() * scaleX),
            height: Math.max(20, node.height() * scaleY),
          };
        }
        if (s.type === "circle") {
          return {
            ...s,
            x: node.x(),
            y: node.y(),
            radius: Math.max(10, node.radius() * scaleX),
          };
        }
        return s;
      }),
    );
  };

  // Delete key removes the currently selected shape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        // Avoid hijacking Backspace while typing in an input elsewhere on the page
        if (document.activeElement.tagName === "INPUT") return;
        deleteSelected();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  return (
    <div className="canvas-board">
      <div className="canvas-toolbar">
        <button onClick={addRectangle}>Add Rectangle</button>
        <button onClick={addCircle}>Add Circle</button>
        <button onClick={deleteSelected} disabled={!selectedId}>
          Delete Selected
        </button>
      </div>

      <div ref={containerRef} className="canvas-container">
        {size.width > 0 && (
          <Stage
            ref={stageRef}
            width={size.width}
            height={size.height}
            onMouseDown={handleStageMouseDown}
            style={{ background: "#f5f6fa" }}
          >
            <Layer>
              {shapes.map((shape) => {
                const commonProps = {
                  id: shape.id,
                  x: shape.x,
                  y: shape.y,
                  fill: shape.fill,
                  draggable: true,
                  onClick: () => setSelectedId(shape.id),
                  onTap: () => setSelectedId(shape.id),
                  onDragEnd: (e) =>
                    updateShapePosition(shape.id, e.target.x(), e.target.y()),
                  onTransformEnd: (e) =>
                    updateShapeTransform(shape.id, e.target),
                  stroke: selectedId === shape.id ? "#222" : undefined,
                  strokeWidth: selectedId === shape.id ? 2 : 0,
                };

                if (shape.type === "rect") {
                  return (
                    <Rect
                      key={shape.id}
                      {...commonProps}
                      width={shape.width}
                      height={shape.height}
                    />
                  );
                }
                if (shape.type === "circle") {
                  return (
                    <Circle
                      key={shape.id}
                      {...commonProps}
                      radius={shape.radius}
                    />
                  );
                }
                return null;
              })}

              <Transformer
                ref={transformerRef}
                rotateEnabled={false}
                boundBoxFunc={(oldBox, newBox) => {
                  // Prevent shapes from being resized to nothing
                  if (newBox.width < 20 || newBox.height < 20) return oldBox;
                  return newBox;
                }}
              />
            </Layer>
          </Stage>
        )}
      </div>
    </div>
  );
}
