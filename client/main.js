import { WebSocketManager } from './websocket.js';
import { CanvasManager } from './canvas.js';

class DrawingApp {
  constructor() {
    this.wsManager = new WebSocketManager();
    this.canvasManager = null;
    this.currentUserId = null;
    this.users = new Map();
    this.cursors = new Map();
    this.currentColor = '#2E7D32';

    this.initializeElements();
    this.attachEventListeners();
  }

  initializeElements() {
    this.joinScreen = document.getElementById('join-screen');
    this.canvasScreen = document.getElementById('canvas-screen');
    this.joinForm = document.getElementById('join-form');
    this.roomNameInput = document.getElementById('room-name');
    this.usernameInput = document.getElementById('username');
    this.currentRoomSpan = document.getElementById('current-room');
    this.usersList = document.getElementById('users-list');
    this.canvas = document.getElementById('drawing-canvas');
    this.cursorsContainer = document.getElementById('cursors-container');

    this.brushBtn = document.getElementById('brush-tool');
    this.eraserBtn = document.getElementById('eraser-tool');
    this.strokeWidthInput = document.getElementById('stroke-width');
    this.strokeWidthValue = document.getElementById('stroke-width-value');
    this.undoBtn = document.getElementById('undo-btn');
    this.redoBtn = document.getElementById('redo-btn');
    this.clearBtn = document.getElementById('clear-btn');
    this.leaveBtn = document.getElementById('leave-btn');
  }

  attachEventListeners() {
    this.joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.joinRoom();
    });

    this.brushBtn.addEventListener('click', () => this.selectTool('brush'));
    this.eraserBtn.addEventListener('click', () => this.selectTool('eraser'));

    // 🎨 Color palette
    const swatches = document.querySelectorAll('.color-swatch');
    swatches.forEach((swatch) => {
      swatch.addEventListener('click', () => {
        swatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        this.currentColor = swatch.dataset.color;
        if (this.canvasManager) this.canvasManager.setColor(this.currentColor);
      });
    });

    this.strokeWidthInput.addEventListener('input', (e) => {
      this.strokeWidthValue.textContent = e.target.value;
      if (this.canvasManager) this.canvasManager.setStrokeWidth(parseInt(e.target.value));
    });

    this.undoBtn.addEventListener('click', () => this.canvasManager?.undo());
    this.redoBtn.addEventListener('click', () => this.canvasManager?.redo());

    this.clearBtn.addEventListener('click', () => {
      if (confirm('Clear the entire canvas?')) this.wsManager.emit('clear-canvas');
    });

    this.leaveBtn.addEventListener('click', () => this.leaveRoom());
  }

  joinRoom() {
    const room = this.roomNameInput.value.trim();
    const user = this.usernameInput.value.trim();
    if (!room || !user) return;

    this.wsManager.connect();
    this.wsManager.joinRoom(room, user);

    this.wsManager.on('room-joined', (data) => {
      this.currentUserId = data.userId;
      this.currentRoomSpan.textContent = room;

      this.joinScreen.classList.remove('active');
      this.canvasScreen.classList.add('active');

      this.canvasManager = new CanvasManager(this.canvas, this.wsManager);
      this.canvasManager.setColor(this.currentColor);
      this.canvasManager.setStrokeWidth(parseInt(this.strokeWidthInput.value));

      if (data.drawingState) this.canvasManager.loadDrawingState(data.drawingState);

      this.updateUsersList(data.users);
      this.setupSocketListeners();
    });
  }

  setupSocketListeners() {
    this.wsManager.on('user-joined', (user) => {
      this.users.set(user.id, user);
      this.updateUsersList(Array.from(this.users.values()));
    });

    this.wsManager.on('user-left', (id) => {
      this.users.delete(id);
      this.removeCursor(id);
      this.updateUsersList(Array.from(this.users.values()));
    });

    this.wsManager.on('draw', (stroke) => this.canvasManager.handleRemoteDraw(stroke));
    this.wsManager.on('cursor-update', (d) => this.updateCursor(d.userId, d.x, d.y));
    this.wsManager.on('undo', (d) => this.canvasManager.handleRemoteUndo(d));
    this.wsManager.on('redo', (d) => this.canvasManager.handleRemoteRedo(d));
    this.wsManager.on('clear-canvas', () => this.canvasManager.clear());
  }

  updateUsersList(users) {
    users.forEach(u => this.users.set(u.id, u));
    this.usersList.innerHTML = '';
    users.forEach(u => {
      const item = document.createElement('div');
      item.className = 'user-item';
      item.innerHTML = `
        <div class="user-color" style="background:${u.color}"></div>
        <div class="user-name">${u.username}${u.id === this.currentUserId ? ' (You)' : ''}</div>`;
      this.usersList.appendChild(item);
    });
  }

  updateCursor(userId, x, y) {
    const user = this.users.get(userId);
    if (!user) return;
    let cursor = this.cursors.get(userId);
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.className = 'cursor';
      cursor.innerHTML = `<div class="cursor-dot" style="background:${user.color}"></div>
                          <div class="cursor-label">${user.username}</div>`;
      this.cursorsContainer.appendChild(cursor);
      this.cursors.set(userId, cursor);
    }
    const rect = this.canvas.getBoundingClientRect();
    cursor.style.left = rect.left + x + 'px';
    cursor.style.top = rect.top + y + 'px';
  }

  selectTool(tool) {
    if (tool === 'brush') {
      this.brushBtn.classList.add('active');
      this.eraserBtn.classList.remove('active');
    } else {
      this.eraserBtn.classList.add('active');
      this.brushBtn.classList.remove('active');
    }
    this.canvasManager?.setTool(tool);
  }

  leaveRoom() {
    if (confirm('Leave the room?')) {
      this.wsManager.disconnect();
      this.canvasScreen.classList.remove('active');
      this.joinScreen.classList.add('active');
      this.users.clear();
      this.cursors.forEach(c => c.remove());
      this.cursors.clear();
      this.canvasManager = null;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new DrawingApp());
