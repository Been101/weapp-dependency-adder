import {globSync} from 'glob';
import path from 'path';
import vscode from 'vscode';

export default {
  /**
   * 获取当前所在工程根目录，有3种使用方法：<br>
   * getProjectPath(uri) uri 表示工程内某个文件的路径<br>
   * getProjectPath(document) document 表示当前被打开的文件document对象<br>
   * getProjectPath() 会自动从 activeTextEditor 拿document对象，如果没有拿到则报错
   * @param {*} document
   */
  getProjectPath() {
    // 获取当前打开的文档
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      // 获取当前文档的 URI
      const documentUri = activeEditor.document.uri;

      // 获取包含当前文档的工作区文件夹
      const workspaceFolder = vscode.workspace.getWorkspaceFolder(documentUri);
      if (workspaceFolder) {
        // 获取工作区文件夹的根目录
        const rootPath = workspaceFolder.uri.fsPath;
        console.log('当前文件所在的根目录:', rootPath);

        return rootPath;
      } else {
        console.log('当前文件不在工作区中。');
      }
    } else {
      console.log('未打开文档。');
    }
  },
  async getFolderNames(rootPath: string, directory: string) {
    // 定义匹配模式，匹配项目下所有 components 文件夹下的所有文件夹
    const pattern = `${rootPath}/**/${directory}/**/*.wxml`;
    const dirs = globSync(pattern, {
      ignore: [
        `${rootPath}/**/demo/**/${directory}/**/*.wxml`,
        `${rootPath}/**/weapp/**/${directory}/**/*.wxml`,
        `${rootPath}/**/alipay/**/${directory}/**/*.wxml`
      ]
    });

    return dirs.map((d) => ({
      name: path.basename(path.dirname(d)),
      path: d.replace(path.extname(d), '')
    }));
    // 执行匹配
  },
  getRelativePath(targetDirectoryPath: string) {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      // 获取当前文档的 URI
      const currentFilePath = activeEditor.document.uri;
      // 获取当前文件与目标文件目录的相对路径
      const relativePath = path.relative(
        path.dirname(currentFilePath.fsPath),
        targetDirectoryPath
      );
      if (!relativePath.startsWith('.')) {
        return `./${relativePath}`;
      }
      return relativePath;
    }
    return targetDirectoryPath;
  }
};
