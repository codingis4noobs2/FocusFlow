"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = __importStar(require("vscode"));
class KanbanItem extends vscode.TreeItem {
    label;
    collapsibleState;
    constructor(label, collapsibleState) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
    }
}
class KanbanDataProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    tasks = [];
    timer = "25:00";
    timerRunning = false;
    startTimer() {
        this.timerRunning = true;
    }
    pauseTimer() {
        this.timerRunning = false;
    }
    stopTimer() {
        this.timerRunning = false;
        this.timer = "25:00";
        this._onDidChangeTreeData.fire();
    }
    constructor() {
        setInterval(() => {
            if (!this.timerRunning)
                return;
            const parts = this.timer.split(":");
            let minutes = parseInt(parts[0]);
            let seconds = parseInt(parts[1]);
            if (seconds > 0) {
                seconds -= 1;
            }
            else if (minutes > 0) {
                minutes -= 1;
                seconds = 59;
            }
            this.timer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            this._onDidChangeTreeData.fire();
        }, 1000);
    }
    addTask(task) {
        this.tasks.push(task);
        this._onDidChangeTreeData.fire();
    }
    editTask(oldTask, newTask) {
        const index = this.tasks.indexOf(oldTask);
        if (index !== -1) {
            this.tasks[index] = newTask;
        }
        this._onDidChangeTreeData.fire();
    }
    removeTask(task) {
        const index = this.tasks.indexOf(task);
        if (index !== -1) {
            this.tasks.splice(index, 1);
        }
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            const timerItem = new KanbanItem(this.timer, vscode.TreeItemCollapsibleState.None);
            const taskItems = this.tasks.map(task => new KanbanItem(task, vscode.TreeItemCollapsibleState.None));
            return Promise.resolve([timerItem, ...taskItems]);
        }
        return Promise.resolve([]);
    }
}
function activate(context) {
    const treeDataProvider = new KanbanDataProvider();
    vscode.window.registerTreeDataProvider('focusflow.kanban', treeDataProvider);
    vscode.commands.registerCommand('focusflow.addTask', async () => {
        const taskName = await vscode.window.showInputBox({ prompt: 'Enter the task name' });
        if (taskName) {
            treeDataProvider.addTask(taskName);
        }
    });
    vscode.commands.registerCommand('focusflow.editTask', async (item) => {
        const newName = await vscode.window.showInputBox({ prompt: 'Edit the task name', value: item.label });
        if (newName) {
            treeDataProvider.editTask(item.label, newName);
        }
    });
    vscode.commands.registerCommand('focusflow.removeTask', (item) => {
        treeDataProvider.removeTask(item.label);
    });
    vscode.commands.registerCommand('focusflow.startPomodoro', () => {
        treeDataProvider.startTimer();
    });
    vscode.commands.registerCommand('focusflow.pausePomodoro', () => {
        treeDataProvider.pauseTimer();
    });
    vscode.commands.registerCommand('focusflow.stopPomodoro', () => {
        treeDataProvider.stopTimer();
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map