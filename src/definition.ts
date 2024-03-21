/**
 * 跳转到定义示例，本示例支持package.json中dependencies、devDependencies跳转到对应依赖包。
 */
import path from 'path';
import fs from 'fs';
import {ExtensionContext, Position, TextDocument} from 'vscode';
import vscode from 'vscode';

/**
 * 查找文件定义的provider，匹配到了就return一个location，否则不做处理
 * 最终效果是，当按住Ctrl键时，如果return了一个location，字符串就会变成一个可以点击的链接，否则无任何效果
 * @param {*} document
 * @param {*} position
 * @param {*} token
 */
function provideDefinition(document: TextDocument, position: Position) {
  const fileName = document.fileName;
  const workDir = path.dirname(fileName);
  const line = document.lineAt(position);
  const [, destPath] = line.text.split(':');
  const targetFilePath = path.resolve(
    workDir,
    destPath.trim().replace(/\"|\'|\,/g, '')
  );
  const tsFilePath = `${targetFilePath}.ts`;
  const jsFilePath = `${targetFilePath}.js`;
  const wxmlFilePath = `${targetFilePath}.wxml`;
  if (fs.existsSync(tsFilePath)) {
    return new vscode.Location(
      vscode.Uri.file(tsFilePath),
      new vscode.Position(0, 0)
    );
  } else if (fs.existsSync(jsFilePath)) {
    return new vscode.Location(
      vscode.Uri.file(jsFilePath),
      new vscode.Position(0, 0)
    );
  } else if (fs.existsSync(wxmlFilePath)) {
    return new vscode.Location(
      vscode.Uri.file(wxmlFilePath),
      new vscode.Position(0, 0)
    );
  }
}

export default function (context: ExtensionContext) {
  // 注册如何实现跳转到定义，第一个参数表示仅对json文件生效
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(['json', 'json5'], {
      provideDefinition
    })
  );
}
