import React, { useRef, useEffect, useState } from 'react';
import useSocket from '../hooks/useSocket';
import { useParams } from 'react-router-dom';

const Whiteboard = () => {
  const socket = useSocket('http://localhost:5000');
  const { groupId } = useParams();
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000'); // black for better visibility on white
  const [brushSize, setBrushSize] = useState(3);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const width = 1280;
    const height = 720;

    canvas.width = width;
    canvas.height = height;
    canvas.style.background = '#ffffff'; // whiteboard background

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = brushSize;
    }
  }, [color, brushSize]);

  useEffect(() => {
    if (!socket || !groupId) return;

    const handleConnect = () => {
      console.log('✅ Connected:', socket.id);
      socket.emit('join-whiteboard-room', { groupId });
    };

    const handleWhiteboardDraw = (data) => {
      const { x0, y0, x1, y1, color, brushSize } = data;
      drawLine(x0, y0, x1, y1, color, brushSize, false);
    };

    const handleWhiteboardClear = () => {
      clearCanvas(false);
    };

    socket.on('connect', handleConnect);
    socket.on('whiteboardDraw', handleWhiteboardDraw);
    socket.on('whiteboardClear', handleWhiteboardClear);

    if (socket.connected) handleConnect();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('whiteboardDraw', handleWhiteboardDraw);
      socket.off('whiteboardClear', handleWhiteboardClear);
    };
  }, [socket, groupId]);

  const getOffset = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    const { x, y } = getOffset(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setLastPos({ x, y });
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getOffset(e);
    drawLine(lastPos.x, lastPos.y, x, y, color, brushSize, true);
    setLastPos({ x, y });
  };

  const stopDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const drawLine = (x0, y0, x1, y1, color, brushSize, emit) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();

    if (!emit || !socket) return;

    socket.emit('whiteboardDraw', {
      groupId,
      data: { x0, y0, x1, y1, color, brushSize },
    });
  };

  const clearCanvas = (emit = true) => {
    const canvas = canvasRef.current;
    if (!ctxRef.current || !canvas) return;

    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    if (emit && socket && groupId) {
      socket.emit('whiteboardClear', { groupId });
    }
  };

  return (
    <div className="relative w-full h-full flex justify-center items-center bg-gray-100">
      {/* Brush controls - centered top */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 p-4 rounded-xl shadow-lg flex gap-6 items-center z-10 border border-gray-300">
        <div>
          <label className="text-sm font-medium">Brush Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="ml-2 cursor-pointer"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Brush Size</label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="ml-2"
          />
        </div>

        <button
          onClick={() => clearCanvas(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md text-sm"
        >
          Clear
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="cursor-crosshair border border-gray-300 rounded-lg bg-white shadow-md"
        style={{ width: 1280, height: 720 }}
      />
    </div>
  );
};

export default Whiteboard;
