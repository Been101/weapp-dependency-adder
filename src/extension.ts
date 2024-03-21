// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import completion from './completion';
import definition from './definition';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  completion(context); // 自动补全
  definition(context); // 跳转到定义
}

// This method is called when your extension is deactivated
export function deactivate() {}
