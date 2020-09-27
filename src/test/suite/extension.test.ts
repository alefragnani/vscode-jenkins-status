import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';

const timeout = async (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

suite('Extension Test Suite', () => {
	let extension: vscode.Extension<any>;
	vscode.window.showInformationMessage('Start all tests.');

	suiteSetup(() => {
		extension = vscode.extensions.getExtension('alefragnani.jenkins-status') as vscode.Extension<any>;
	});

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('Activation test', async () => {
		await extension.activate();
		assert.strictEqual(extension.isActive, true);
	});

	test('Extension loads in VSCode and is active', async () => {
		await timeout(1500);
		assert.strictEqual(extension.isActive, true);
    });
});
