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

const circle = new Konva.Circle({
  x: stage.width() / 2,
  y: stage.height() / 2,
  radius: 50,
  fill: 'red',
  stroke: 'black',
  strokeWidth: 4,
});

layer.add(circle);
layer.draw();

document.getElementById('clear')?.addEventListener('click', () => {
  layer.destroyChildren();
  layer.draw();
});
