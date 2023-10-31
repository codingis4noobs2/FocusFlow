# FocusFlow for VSCode

![FocusFlow Logo](./icon.png)

FocusFlow is a productivity-boosting VSCode extension designed for developers who aim to optimize their coding sessions and manage tasks with precision. Seamlessly integrate the Pomodoro technique with an in-built Kanban board, right within your VSCode workspace.

## Features

1. **Pomodoro Timer:** Stay focused with integrated Pomodoro sessions. Easily start, pause, or stop without leaving your editor.
2. **Kanban Board:** Visual task management at your fingertips. Categorize tasks as 'To-Do', 'In Progress', and 'Done' to streamline your workflow.
3. **Seamless UI Integration:** Designed to effortlessly blend into the VSCode interface for an intuitive user experience.

## Usage

1. **Starting a Pomodoro Session:** Use the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and select "Start Pomodoro".
2. **Pausing/Stopping a Session:** Similarly, use the command palette to select "Pause Pomodoro" or "Stop Pomodoro".
3. **Managing Tasks:** Navigate to the FocusFlow Kanban in the Explorer sidebar to add, edit, or move tasks between columns.

## Local Setup

If you're looking to contribute or test the extension locally, follow these steps:

1. **Prerequisites:** Ensure you have Node.js installed.
   
2. **Clone the Repository:** 
   ```bash
   git clone https://github.com/your-repo-link/focusflow.git
   ```
3. **Navigate to Directory:**
   ```bash
   cd focusflow
   ```
4. **Install Dependencies:**
   ```bash
   npm install
   ```
5. **Compile:**
   ```bash
   npm run compile
   ```

Open in VSCode: Launch VSCode, and use the File -> Open Folder option to open the focusflow directory.

Run the Extension: Press F5 or navigate to the debugging section and click the "Run" button. This action will launch a new VSCode window with the FocusFlow extension loaded.
