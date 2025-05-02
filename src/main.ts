import './style.css'
import Konva from 'konva'

const width = 800;
const height = 500;

const stage = new Konva.Stage({
  container: 'board',
  width: document.getElementById('board')?.clientWidth || width,
  height: document.getElementById('board')?.clientHeight || height,
});

const layer = new Konva.Layer();
stage.add(layer);


const clearWhiteboard = () => {
  layer.destroyChildren();
  layer.draw();
};
document.getElementById('clear')?.addEventListener('click', clearWhiteboard);

// Start drawing
let isDrawing = false;
let currentLine: Konva.Line | null = null;
const deleteLine = (e: Konva.KonvaEventObject<MouseEvent>) => {
  e.currentTarget.destroy();
  layer.draw();
};
stage.on('mousedown touchstart', (e) => {
  if (e.evt.button !== 0) return; // Only left mouse button
  if (e.target !== stage) return; // Only draw on the stage

  isDrawing = true;

  const pos = stage.getPointerPosition();
  if (!pos) return;
  currentLine = new Konva.Line({
    points: [pos.x, pos.y],
    stroke: 'black',
    strokeWidth: 2,
    lineCap: 'round',
    lineJoin: 'round',
  });
  currentLine.on('click', deleteLine);
  layer.add(currentLine);
});

// Continue drawing
stage.on('mousemove touchmove', (e) => {
  if (!isDrawing) return; // Only draw when mouse is down
  if (e.evt.button !== 0) return; // Only left mouse button
  if (e.target !== stage) return; // Only draw on the stage

  const pos = stage.getPointerPosition();
  if (!pos || !currentLine) return;

  const newPoints = currentLine.points().concat([pos.x, pos.y]);
  currentLine.points(newPoints);
  layer.batchDraw();
});

// Stop drawing
stage.on('mouseup touchend mouseleave touchleave', () => {
  isDrawing = false;
  currentLine = null;
});
