import { useState, useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Transformer,
  Group,
  Path,
  Text,
  Label,
  Tag,
} from "react-konva";
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

export default function CanvasBoard({ shapesMap, awareness }) {
  const [shapes, setShapes] = useState([]);
  const [remoteUsers, setRemoteUsers] = useState([]);
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

  // Sync Remote Cursors from Awareness
  useEffect(() => {
    if (!awareness) return;

    const updateCursors = () => {
      const states = Array.from(awareness.getStates().entries());

      // CRITICAL FIX: Use the document's underlying client ID
      const localClientId = awareness.doc.clientID;

      const others = states
        .filter(([clientId, state]) => {
          // Force string comparison to safely filter out your own local cursor
          return (
            String(clientId) !== String(localClientId) && state?.user?.cursor
          );
        })
        .map(([clientId, state]) => ({
          clientId,
          ...state.user,
        }));

      setRemoteUsers(others);
    };

    awareness.on("change", updateCursors);
    return () => awareness.off("change", updateCursors);
  }, [awareness]);

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

  // CRITICAL FIX: Extract X/Y integers so the WebSocket can stringify the JSON
  const handleMouseMove = (e) => {
    if (!awareness) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const state = awareness.getLocalState();

    if (state?.user && point) {
      awareness.setLocalStateField("user", {
        ...state.user,
        cursor: { x: point.x, y: point.y },
      });
    }
  };

  const handleMouseLeave = () => {
    if (!awareness) return;
    const state = awareness.getLocalState();
    if (state?.user) {
      awareness.setLocalStateField("user", { ...state.user, cursor: null });
    }
  };

  const handleStageMouseDown = (e) => {
    if (e.target === e.target.getStage()) setSelectedId(null);
  };

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

  const updateShapeColor = (newColor) => {
    if (!selectedId) return;
    const existing = shapesMap.get(selectedId);
    if (existing) {
      shapesMap.set(selectedId, { ...existing, fill: newColor });
    }
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
                  (color) => {
                    // Find the currently selected shape to highlight its active color
                    const currentShape = shapes.find(
                      (s) => s.id === selectedId,
                    );
                    const isActive = currentShape?.fill === color;

                    return (
                      <button
                        key={color}
                        onClick={() => updateShapeColor(color)}
                        className={`w-6 h-6 rounded-md border transition-all hover:scale-110 ${
                          isActive
                            ? "scale-110 border-white shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                            : "border-zinc-700/50"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    );
                  },
                )}
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

      <div
        ref={containerRef}
        className="canvas-container"
        onMouseLeave={handleMouseLeave}
      >
        {size.width > 0 && (
          <Stage
            ref={stageRef}
            width={size.width}
            height={size.height}
            onMouseDown={handleStageMouseDown}
            onMouseMove={handleMouseMove}
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

              {/* Render Remote Cursors */}
              {remoteUsers.map((u) => (
                <Group key={u.clientId} x={u.cursor.x} y={u.cursor.y}>
                  <Path
                    data="M5.65376 21.0846L1.51408 1.83151C1.29524 0.813636 2.37894 -0.0152912 3.32746 0.446824L21.3653 9.23961C22.3783 9.73351 22.3023 11.2057 21.2384 11.6027L14.0722 14.2755C13.8262 14.3673 13.626 14.5428 13.5042 14.7744L10.3707 20.7388C9.88298 21.667 8.52041 21.7828 7.89246 20.9501Z"
                    fill={u.color}
                    stroke="#ffffff"
                    strokeWidth={2}
                    scale={{ x: 0.7, y: 0.7 }}
                  />
                  <Label x={15} y={15}>
                    <Tag
                      fill={u.color}
                      cornerRadius={4}
                      shadowColor="black"
                      shadowBlur={4}
                      shadowOpacity={0.2}
                    />
                    <Text
                      text={u.username}
                      fill="#fff"
                      padding={4}
                      fontSize={11}
                      fontStyle="bold"
                    />
                  </Label>
                </Group>
              ))}
            </Layer>
          </Stage>
        )}
      </div>
    </div>
  );
}
