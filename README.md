# 💻 Collaborative Code Editor

A real-time collaborative code editor that allows multiple users to write, edit, and share code simultaneously. Built with a Spring Boot backend, a modern JavaScript frontend, and a Dockerized database for easy setup.

---

## 🚀 Features

- 🧑‍💻 Real-time collaborative editing
- 🔄 Live updates across multiple users
- 🔐 Backend powered by Spring Boot
- 🗄️ Containerized database using Docker
- ⚡ Fast frontend with modern tooling

---

## 🛠️ Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Backend   | Java, Spring Boot        |
| Frontend  | React (Vite / npm) |
| Database  | Docker (via Docker Compose) |

---

## 📦 Prerequisites

Make sure you have the following installed:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js + npm](https://nodejs.org/)
- [Java JDK 17+](https://adoptium.net/)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/RLinV1/Collaborative-Code-Editor
cd Collaborative-Code-Editor
```

### 2. Start the Database (Docker)

Make sure Docker is running, then:

```bash
docker-compose up -d
```

This will start the database container required by the backend.

### 3. Run the Backend (Spring Boot)

Navigate to the backend directory and start the Spring Boot application:

```bash
./mvnw spring-boot:run
```

> Alternatively, open the project in your IDE and run the main Java class directly.

### 4. Run the Frontend

Navigate to the `code-editor-frontend` directory:

```bash
cd code-editor-frontend
npm install
npm run dev
```

This will start the frontend development server.

---

## 🌐 Usage

1. Open your browser and go to `http://localhost:<frontend-port>`
2. Create or join a collaborative coding session
3. Start coding in real-time with others 🚀

---

## 🧩 Project Structure

```
Collaborative-Code-Editor/
├── backend/                 # Spring Boot application
├── code-editor-frontend/    # Frontend (React)
└── docker/                  # Docker configuration for database
```

---

## ⚠️ Notes

- Ensure the backend is connected to the Dockerized database — check `application.properties` or `application.yml` for connection settings.
- Ports may vary depending on your local setup.
- The backend and frontend must be running **simultaneously** for full functionality.

---

## 📌 Future Improvements

- [ ] Authentication & user accounts
- [ ] Code execution support
- [ ] Syntax highlighting for more languages
- [ ] Full Docker deployment for all services

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and open a pull request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
