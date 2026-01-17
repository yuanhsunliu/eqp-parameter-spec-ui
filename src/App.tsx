import { Toaster } from "@/components/ui/sonner";
import { ParameterSpecForm } from "@/components/forms/ParameterSpecForm";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { TestApiConsumer } from "@/components/TestApiConsumer";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 360, y: 40 });
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragRef.current) return;
    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;
    setPosition({
      x: dragRef.current.initialX + deltaX,
      y: dragRef.current.initialY + deltaY,
    });
  };

  const handleMouseUp = () => {
    dragRef.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const isFormPage = window.location.pathname === "/form";
  const isTestPage = window.location.pathname === "/test";

  if (isFormPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-2">
        <ParameterSpecForm />
        <Toaster position="top-center" richColors />
      </div>
    );
  }

  if (isTestPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <TestApiConsumer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-6 relative">
      <h1 className="text-2xl font-bold text-gray-800">
        機台參數規格管理系統
      </h1>
      <p className="text-gray-600">點擊下方連結開啟參數規格輸入表單</p>
      <Button
        onClick={() => setShowForm(true)}
        data-testid="open-pip-button"
        className="text-lg px-6 py-3"
      >
        開啟表單
      </Button>

      {/* PiP-style draggable overlay panel */}
      {showForm && (
        <div
          className="fixed z-50 shadow-2xl rounded-lg overflow-hidden border border-gray-200"
          style={{ width: 340, height: 700, left: position.x, top: position.y }}
          data-testid="pip-panel"
        >
          <div
            className="bg-gray-100 px-3 py-1.5 flex justify-between items-center border-b cursor-move select-none"
            onMouseDown={handleMouseDown}
          >
            <span className="text-sm font-medium text-gray-700">機台參數規格</span>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-800 text-lg leading-none"
              data-testid="close-pip-button"
            >
              ✕
            </button>
          </div>
          <div className="bg-gray-50 h-full overflow-auto p-2">
            <ParameterSpecForm />
          </div>
        </div>
      )}

      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
