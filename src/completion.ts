import vscode from 'vscode';
import util from './utils';

export default function (context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      ['json', 'json5'],
      {
        provideCompletionItems,
        resolveCompletionItem
      },
      '"'
    )
  );
}

async function provideCompletionItems(
  document: vscode.TextDocument,
  position: vscode.Position
) {
  const line = document.lineAt(position);
  const projectPath = util.getProjectPath() || '';
  const folederNames = await util.getFolderNames(projectPath, 'components');

  // 只截取到光标位置为止，防止一些特殊情况
  const lineText = line.text.substring(0, position.character);
  const lineTextEnd = line.text.substring(0, position.character + 1);

  const hasBeforeQuote = lineText.endsWith('"');
  const hasAfterQuote =
    lineText === lineTextEnd ? false : lineTextEnd.endsWith('"');
  return folederNames.map((dep) => {
    // vscode.CompletionItemKind 表示提示的类型
    const completionItem = new vscode.CompletionItem(
      `${dep.name}`,
      vscode.CompletionItemKind.Field
    );
    completionItem.insertText = new vscode.SnippetString(
      `${hasBeforeQuote ? '' : '"'}${dep.name}": "${util.getRelativePath(
        dep.path
      )}${hasAfterQuote ? '' : '"'}`
    );
    completionItem.detail = dep.path;
    return completionItem;
  });
}

function resolveCompletionItem() {
  return null;
}
