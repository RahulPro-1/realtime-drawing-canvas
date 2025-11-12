# 🎨 Real-Time Collaborative Drawing Canvas

A **multi-user drawing application** built with **Vanilla JavaScript, HTML5 Canvas, Node.js, and WebSockets**, enabling **real-time collaborative drawing** with **undo/redo**, **user indicators**, and **global synchronization**.

---

## 🚀 Overview

This project demonstrates **real-time synchronization**, **canvas mastery**, and **state management** using only **core web technologies** — **no frontend frameworks or drawing libraries**.  
Multiple users can draw on a shared canvas and see updates **live**, including brush movements, erasing, and undo/redo actions.

---

## 🧠 Features

### ✏️ Drawing Tools
- Brush and eraser modes  
- Adjustable stroke width and color picker  
- Smooth and responsive strokes  

### 🔄 Real-Time Collaboration
- Live updates for all connected users via WebSockets  
- Cursor tracking to show where other users are drawing  
- Conflict-free state synchronization  

### 🧍 User Management
- Each user assigned a unique color  
- Online user list updates dynamically  

### ⏪ Undo/Redo
- Global undo/redo system shared across users  
- Operation-based history maintained on the server  

### ⚡ Performance Optimizations
- Event throttling for mouse movements  
- Batching of stroke data before network transmission  
- Efficient canvas re-rendering strategies  

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Vanilla JavaScript / TypeScript, HTML5 Canvas, CSS |
| **Backend** | Node.js, Express.js, WebSocket (Socket.io) |
| **Communication** | Event-based real-time updates using WebSockets |
| **Data Format** | JSON-based event serialization |

---

## 📁 Project Structure

```
collaborative-canvas/
├── client/
│   ├── index.html           # Main UI
│   ├── style.css            # Styling for the interface
│   ├── canvas.js/ts         # Canvas rendering and drawing logic
│   ├── websocket.js/ts      # WebSocket client handling
│   └── main.js/ts           # Application initialization and event binding
├── server/
│   ├── server.js/ts         # Node.js + WebSocket server setup
│   ├── rooms.js/ts          # User and room management
│   └── drawing-state.js/ts  # Server-side drawing state and undo/redo history
├── package.json
├── README.md
└── ARCHITECTURE.md          # System design and implementation documentation
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/collaborative-canvas.git
cd collaborative-canvas
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Server
```bash
npm start
```

The server will start on **http://localhost:3000**

### 4. Open Multiple Clients
- Open `http://localhost:3000` in multiple browser windows/tabs  
- Start drawing to see **real-time collaboration in action**

---

## 🧪 How to Test with Multiple Users

1. Run the server locally or deploy it (e.g., Render, Vercel, or Heroku).  
2. Open the deployed link or `localhost:3000` in **two or more browsers**.  
3. Choose different brush colors and start drawing.  
4. You should see drawings from all connected users in real-time.  
5. Try using **Undo (Ctrl+Z)** and **Redo (Ctrl+Y)** to see global updates.

---

## 🧰 Core Concepts

| Concept | Description |
|----------|-------------|
| **Real-Time Sync** | Uses WebSocket events like `draw`, `erase`, `undo`, and `redo` to broadcast updates. |
| **Serialization** | Stroke data (coordinates, color, width, tool) is serialized into JSON packets. |
| **Conflict Resolution** | Server maintains a unified operation log and rebroadcasts the canonical canvas state. |
| **Global Undo/Redo** | All strokes are stored as discrete actions; undo removes the last action globally. |
| **Prediction Handling** | Client-side buffering smooths strokes while awaiting server confirmation. |

---

## 🧮 Example WebSocket Events

| Event | Direction | Payload Example |
|--------|------------|----------------|
| `user-join` | Server → Client | `{ id: "u123", color: "#3498db" }` |
| `draw` | Client → Server | `{ path: [[x1, y1], [x2, y2]], color: "#000", width: 3 }` |
| `erase` | Client → Server | `{ path: [[x1, y1], [x2, y2]] }` |
| `undo` | Client ↔ Server | `{ actionId: "a56" }` |
| `redo` | Client ↔ Server | `{ actionId: "a57" }` |
| `cursor-move` | Client → Server | `{ x: 120, y: 340 }` |

---

## 🧱 Known Limitations

- Global undo/redo may lag slightly under very high user counts  
- Cursor updates throttled for performance (may feel slightly delayed)  
- No persistence layer (canvas resets on server restart)  
- Works best on desktop (mobile touch support optional)

---

## ⏰ Time Spent

| Task | Approx. Duration |
|-------|------------------|
| Canvas Drawing System | 6 hrs |
| WebSocket Integration | 5 hrs |
| Undo/Redo Logic | 4 hrs |
| User Management + UI | 3 hrs |
| Documentation + Testing | 2 hrs |
| **Total** | **~20 hours** |

---

## 💡 Future Improvements (Optional/Bonus)

- [ ] Mobile touch support (multi-touch drawing)  
- [ ] Persistent drawing storage (MongoDB or Redis)  
- [ ] Room-based collaboration system  
- [ ] FPS counter and latency monitor  
- [ ] Shape tools (rectangle, circle, text)  

---

## 🧔 Author

**Rahul Kumar**  
B.Tech CSE | MANIT Bhopal  
📧 [Your Email Here]  
💻 Passionate about Web Development, AI & Real-Time Systems  

---

## 🧾 License

This project is licensed under the **MIT License**.  
Feel free to fork and improve it — contributions are welcome!
