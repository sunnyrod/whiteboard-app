import './style.css';
import Konva from 'konva';

// Constants
const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 500;

// Initialize Stage and Layer
const stage = createStage('board', DEFAULT_WIDTH, DEFAULT_HEIGHT);
const layer = new Konva.Layer();
stage.add(layer);

// Utility Functions
function createStage(containerId: string, width: number, height: number): Konva.Stage {
  return new Konva.Stage({
    container: containerId,
    width: document.getElementById(containerId)?.clientWidth || width,
    height: document.getElementById(containerId)?.clientHeight || height,
  });
}

function clearWhiteboard(): void {
  layer.destroyChildren();
  layer.draw();
}

function deleteLine(e: Konva.KonvaEventObject<MouseEvent>): void {
  e.currentTarget.destroy();
  layer.draw();
}

// Drawing Logic
function startDrawing(e: Konva.KonvaEventObject<MouseEvent>): void {
  if (e.evt.button !== 0) return; // Only left mouse button
  if (e.target !== stage) return; // Ignore clicks outside of whiteboard
  if (isDrawing) return; // Prevent multiple lines being drawn at once 

  isDrawing = true;
  const pos = stage.getPointerPosition();
  if (!pos) return;

  currentLine = new Konva.Line({
    points: [pos.x, pos.y, pos.x, pos.y], // repeat so that clicks draw points
    stroke: 'black',
    strokeWidth: 2,
    lineCap: 'round',
    lineJoin: 'round',
    hitStrokeWidth: 10, // make the lines easier to click
  });
  currentLine.on('click', deleteLine);
  layer.add(currentLine);
}

function continueDrawing(e: Konva.KonvaEventObject<MouseEvent>): void {
  if (!isDrawing) return; // Only draw when mouse is down
  if (e.evt.button !== 0) return; // Only left mouse button
  if (e.target !== stage) return; // Only draw on the whiteboard

  const pos = stage.getPointerPosition();
  if (!pos || !currentLine) return;

  const newPoints = currentLine.points().concat([pos.x, pos.y]);
  currentLine.points(newPoints);
  layer.batchDraw();
}

function stopDrawing(): void {
  isDrawing = false;
  currentLine = null;
}

// Event Listeners
function setupEventListeners(): void {
  document.getElementById('clear')?.addEventListener('click', clearWhiteboard);

  stage.on('mousedown', startDrawing);
  stage.on('mousemove', continueDrawing);
  stage.on('mouseup mouseleave', stopDrawing);
}

// Main
let isDrawing = false;
let currentLine: Konva.Line | null = null;

setupEventListeners();
