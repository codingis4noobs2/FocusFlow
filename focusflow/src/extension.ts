import * as vscode from 'vscode';

class KanbanItem extends vscode.TreeItem {
    constructor(public readonly label: string, public collapsibleState: vscode.TreeItemCollapsibleState) {
        super(label, collapsibleState);
    }
}

class KanbanDataProvider implements vscode.TreeDataProvider<KanbanItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<KanbanItem | undefined | null | void> = new vscode.EventEmitter<KanbanItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<KanbanItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private tasks: string[] = [];
    private timer: string = "25:00";
    private timerRunning: boolean = false;

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
            if (!this.timerRunning) return;

            const parts = this.timer.split(":");
            let minutes = parseInt(parts[0]);
            let seconds = parseInt(parts[1]);

            if (seconds > 0) {
                seconds -= 1;
            } else if (minutes > 0) {
                minutes -= 1;
                seconds = 59;
            }
            this.timer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            this._onDidChangeTreeData.fire();
        }, 1000);
    }

    addTask(task: string) {
        this.tasks.push(task);
        this._onDidChangeTreeData.fire();
    }

    editTask(oldTask: string, newTask: string) {
        const index = this.tasks.indexOf(oldTask);
        if (index !== -1) {
            this.tasks[index] = newTask;
        }
        this._onDidChangeTreeData.fire();
    }

    removeTask(task: string) {
        const index = this.tasks.indexOf(task);
        if (index !== -1) {
            this.tasks.splice(index, 1);
        }
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: KanbanItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: KanbanItem): Thenable<KanbanItem[]> {
        if (!element) {
            const timerItem = new KanbanItem(this.timer, vscode.TreeItemCollapsibleState.None);
            const taskItems = this.tasks.map(task => new KanbanItem(task, vscode.TreeItemCollapsibleState.None));
            return Promise.resolve([timerItem, ...taskItems]);
        }
        return Promise.resolve([]);
    }
}

export function activate(context: vscode.ExtensionContext) {
    const treeDataProvider = new KanbanDataProvider();
    vscode.window.registerTreeDataProvider('focusflow.kanban', treeDataProvider);

    vscode.commands.registerCommand('focusflow.addTask', async () => {
        const taskName = await vscode.window.showInputBox({ prompt: 'Enter the task name' });
        if (taskName) {
            treeDataProvider.addTask(taskName);
        }
    });

    vscode.commands.registerCommand('focusflow.editTask', async (item: KanbanItem) => {
        const newName = await vscode.window.showInputBox({ prompt: 'Edit the task name', value: item.label });
        if (newName) {
            treeDataProvider.editTask(item.label, newName);
        }
    });

    vscode.commands.registerCommand('focusflow.removeTask', (item: KanbanItem) => {
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
