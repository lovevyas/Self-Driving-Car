# 🚗 Self-Driving Car – Neural Network Simulation (From Scratch)

🔗 **Live Demo:** [Click Here to Play](https://self-driving-car-kappa.vercel.app)

A browser-based self-driving car simulation built entirely from scratch using pure JavaScript, HTML, and CSS — **no external libraries**. The project demonstrates the fundamentals of autonomous driving logic, training mechanisms, and real-time visualization without abstraction layers.

---

## 📌 Key Features

- **Custom Neural Network:** Full implementation without TensorFlow or other ML libraries.
- **Evolutionary Training:** Mutation-based strategy to improve driving behavior over generations.
- **Virtual Sensors:** Ray-casting implementation for real-time obstacle detection.
- **Physics Engine:** Custom collision detection and vehicle dynamics.
- **3 Driving Modes:** Manual Control, AI Training, and Autonomous.
- **Live Visualization:** Real-time rendering of the neural network's decision process.
- **Persistence:** Automatically saves the best-performing AI "brain" to local storage.

---

## 🎮 Driving Modes

### Manual Mode
Drive the car yourself using keyboard (Arrow Keys) or touch controls to understand the physics.

### AI Trainer Mode
Train multiple AI cars simultaneously using mutation and selection. The system identifies the fittest car based on distance traveled.

### Autonomous Mode
Run the best-trained model (saved from Trainer Mode) for fully autonomous driving.

---

## 🧠 System Overview

1.  **Sensing:** The car uses geometric ray-casting to gather distance data from road borders and traffic.
2.  **Processing:** Sensor readings are fed into the input layer of the custom neural network.
3.  **Decision:** The network propagates signals through hidden layers to output control commands (Steer Left, Right, Forward, Reverse).
4.  **Learning:** Collision status and distance traveled are used to score performance and evolve the network.

---

## 🛠️ Technologies Used

- **Language:** JavaScript (ES6+)
- **Rendering:** HTML5 Canvas
- **Styling:** CSS3
- **Dependencies:** None (0 External Libraries)

---

## 📂 Project Structure

```text
├── Car_image/        # Assets for car graphics
├── bestBrain.js      # Stored AI brain data (persisted model)
├── car.js            # Vehicle physics and control logic
├── controls.js       # Keyboard & touch input handling
├── index.html        # UI structure and canvas setup
├── intro.js          # Introduction sequence logic
├── main.js           # Core game loop and mode handler
├── network.js        # Neural network architecture and mutation logic
├── road.js           # Road generation and lane system
├── sensor.js         # Ray-casting sensor implementation
├── style.css         # UI and canvas styling
├── utils.js          # Math (Lerp) & geometry intersection helpers
└── visualizer.js     # Renders the neural network state
```

## 🎯 Purpose & Learning

This project focuses on understanding **how an autonomous driving system works at the core**, not on using third-party libraries. Everything from sensing to decision-making is implemented manually, showcasing:

- Strong fundamentals in **algorithms and system design**
- Geometry and physics simulation skills
- Custom AI implementation and training logic

---

## 🚀 Future Enhancements (Optional)

- Improved training fitness scoring  
- Adjustable sensor resolution  
- Smarter traffic generation  
- More advanced activation functions  
- Performance optimizations

---

## 👤 Author

**Love Vyas**  
B.Tech Computer Science  
Exchange Student – Finland
