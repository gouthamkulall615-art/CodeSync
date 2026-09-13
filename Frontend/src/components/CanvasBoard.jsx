import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Transformer } from "react-konva";
import {
  FiMousePointer,
  FiSquare,
  FiCircle,
  FiTrash2,
  FiMoreVertical,
} from "react-icons/fi";
import "./CanvasBoard.css";

let idCounter = 0;
const nextId = () => `shape-${Date.now()}-${idCounter++}`;

export default function CanvasBoard({ shapesMap }) {
  const [shapes, setShapes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const stageRef = useRef(null);
  const transformerRef = useRef(null);
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

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

  useEffect(() => {
    if (!shapesMap) return;
    const syncFromMap = () => {
      const arr = [];
      shapesMap.forEach((value, key) => arr.push({ ...value, id: key }));
      setShapes(arr);
    };
    syncFromMap();
    shapesMap.observe(syncFromMap);
    return () => shapesMap.unobserve(syncFromMap);
  }, [shapesMap]);

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
    shapesMap.set(id, {
      type: "rect",
      x: 300,
      y: 200,
      width: 120,
      height: 120,
      fill: "#3b82f6",
    });
    setSelectedId(id);
  };

  const addCircle = () => {
    const id = nextId();
    shapesMap.set(id, {
      type: "circle",
      x: 450,
      y: 250,
      radius: 60,
      fill: "#ef4444",
    });
    setSelectedId(id);
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    shapesMap.delete(selectedId);
    setSelectedId(null);
  };

  const handleStageMouseDown = (e) => {
    if (e.target === e.target.getStage()) setSelectedId(null);
  };

  const updateShapePosition = (id, x, y) => {
    const existing = shapesMap.get(id);
    if (existing) shapesMap.set(id, { ...existing, x, y });
  };

  const updateShapeTransform = (id, node) => {
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    const existing = shapesMap.get(id);
    if (!existing) return;

    if (existing.type === "rect") {
      shapesMap.set(id, {
        ...existing,
        x: node.x(),
        y: node.y(),
        width: Math.max(20, node.width() * scaleX),
        height: Math.max(20, node.height() * scaleY),
      });
    } else if (existing.type === "circle") {
      shapesMap.set(id, {
        ...existing,
        x: node.x(),
        y: node.y(),
        radius: Math.max(10, node.radius() * scaleX),
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        document.activeElement.tagName !== "INPUT"
      ) {
        deleteSelected();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  return (
    <div className="canvas-board relative w-full h-full">
      {/* Top-Center Floating Toolbar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-[#1a1d24]/95 backdrop-blur-md border border-zinc-800/80 rounded-full px-2 py-2 flex items-center gap-1 shadow-2xl">
        <button
          className="p-2.5 text-blue-400 bg-blue-500/10 rounded-full hover:bg-blue-500/20 transition-colors"
          title="Select"
        >
          <FiMousePointer size={18} />
        </button>
        <div className="w-px h-6 bg-zinc-700/50 mx-1"></div>
        <button
          onClick={addRectangle}
          className="p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
          title="Rectangle"
        >
          <FiSquare size={18} />
        </button>
        <button
          onClick={addCircle}
          className="p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
          title="Circle"
        >
          <FiCircle size={18} />
        </button>
      </div>

      {/* Right-Side Properties Panel (Contextual) */}
      {selectedId && (
        <div className="absolute right-6 top-24 z-50 bg-[#1a1d24]/95 backdrop-blur-md border border-zinc-800/80 rounded-xl p-5 w-64 shadow-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Inspect Shape
            </h3>
            <FiMoreVertical className="text-zinc-500" />
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-2">
                Fill Color
              </p>
              <div className="flex gap-2">
                {["#ef4444", "#3b82f6", "#8b5cf6", "#f59e0b", "#10b981"].map(
                  (color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded-md border border-zinc-700/50 transition-transform hover:scale-110"
                      style={{ backgroundColor: color }}
                    />
                  ),
                )}
              </div>
            </div>

            <div>
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-2">
                Stroke Width
              </p>
              <div className="flex bg-[#0e1116] rounded-lg p-1 border border-zinc-800">
                <button className="flex-1 py-1.5 text-xs text-zinc-400 hover:text-white rounded-md">
                  Thin
                </button>
                <button className="flex-1 py-1.5 text-xs bg-zinc-800 text-white rounded-md shadow-sm">
                  Medium
                </button>
                <button className="flex-1 py-1.5 text-xs text-zinc-400 hover:text-white rounded-md">
                  Bold
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80">
              <button
                onClick={deleteSelected}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                Remove element
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Konva Canvas */}
      <div ref={containerRef} className="canvas-container cursor-crosshair">
        {size.width > 0 && (
          <Stage
            ref={stageRef}
            width={size.width}
            height={size.height}
            onMouseDown={handleStageMouseDown}
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
                };

                return shape.type === "rect" ? (
                  <Rect
                    key={shape.id}
                    {...commonProps}
                    width={shape.width}
                    height={shape.height}
                    cornerRadius={4}
                  />
                ) : shape.type === "circle" ? (
                  <Circle
                    key={shape.id}
                    {...commonProps}
                    radius={shape.radius}
                  />
                ) : null;
              })}

              <Transformer
                ref={transformerRef}
                rotateEnabled={false}
                anchorSize={10}
                anchorCornerRadius={5}
                anchorStroke="#3b82f6"
                anchorFill="#ffffff"
                borderStroke="#3b82f6"
                borderStrokeWidth={1.5}
                keepRatio={false}
                boundBoxFunc={(oldBox, newBox) =>
                  newBox.width < 20 || newBox.height < 20 ? oldBox : newBox
                }
              />
            </Layer>
          </Stage>
        )}
      </div>
    </div>
  );
}
