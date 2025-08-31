# Jenkins Status VS Code Extension

Jenkins Status is a TypeScript VS Code extension that displays Jenkins build status in the VS Code status bar. It activates when `.jenkins` or `.jenkinsrc.js` files are present in the workspace.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Dependencies
- Install Node.js version 14.17.27 or higher
- Clone repository: `git clone https://github.com/alefragnani/vscode-jenkins-status.git`
- Initialize git submodules: `git submodule init && git submodule update` -- takes under 1 second. Required for vscode-whats-new dependency.
- Install dependencies: `npm install` -- takes 3-5 seconds. May show deprecation warnings which are expected.

### Build Commands
- Development build: `npm run build` -- takes 3-4 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
- Production build: `npm run vscode:prepublish` -- takes 7 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
- TypeScript compilation: `npm run compile` -- takes 3 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
- Watch mode for development: `npm run watch` -- runs continuously, compiles on file changes

### Testing and Validation
- Lint code: `npm run lint` -- takes 2 seconds. Always run before committing.
- Run tests: `npm run test` -- WARNING: Tests may fail due to network connectivity to VS Code servers. This is expected in restricted environments.
- Pretest (compile + lint): `npm run pretest` -- takes 5 seconds total

## Extension Development Workflow

### Testing the Extension in VS Code
1. Open the extension project in VS Code
2. Run `npm run build` to compile the extension
3. Press F5 or use "Launch Extension" debug configuration to open Extension Development Host
4. In the new VS Code window, open a folder and create a `.jenkins` file to test activation
5. Verify the Jenkins status appears in the status bar

### Debugging
- Use "Launch Extension" configuration in VS Code debugger
- Extension activates when `.jenkins` or `.jenkinsrc.js` files are detected
- Check VS Code Developer Console (Help > Toggle Developer Tools) for error messages

## Validation Scenarios

### Always Test After Changes
1. **Extension Activation**: Create test workspace with `.jenkins` file containing `{"url": "http://localhost:8080/job/test/", "name": "Test Build"}` and verify extension activates
2. **Commands Available**: Check that Jenkins commands appear in Command Palette (Ctrl+Shift+P):
   - "Jenkins: Update Status"
   - "Jenkins: Open in Jenkins" 
   - "Jenkins: Open in Jenkins (Console Output)"
3. **Status Bar Display**: Verify Jenkins status indicator appears in VS Code status bar when extension is active
4. **Multi-root Support**: Test with multiple workspace folders, each with their own `.jenkins` configuration

### Manual Testing Workflow
```bash
# Create test workspace
mkdir test-workspace && cd test-workspace
echo '{"url": "http://localhost:8080/job/test/", "name": "Test Build"}' > .jenkins

# Open in VS Code extension development host
# 1. Press F5 from extension project
# 2. In new window, open the test-workspace folder
# 3. Verify Jenkins status appears in status bar
# 4. Test commands from Command Palette
```

### Configuration File Testing
Test both supported configuration formats:

**.jenkins file (JSON)**:
```json
{
    "url": "http://127.0.0.1:8080/job/myproject/",
    "name": "Jenkins Build",
    "username": "jenkins_user",
    "password": "jenkins_password_or_token"
}
```

**.jenkinsrc.js file (JavaScript)**:
```js
module.exports = [{
    "url": "http://127.0.0.1:8080/job/myproject/",
    "name": "Jenkins Build",
    "username": "jenkins_user",
    "password": "jenkins_password_or_token"
}];
```

## Build Timing and Expectations

- **git submodule init && git submodule update**: Under 1 second
- **npm install**: 3-5 seconds on first run
- **npm run build**: 3-4 seconds (development webpack build)
- **npm run vscode:prepublish**: 7 seconds (production webpack build with minification)
- **npm run compile**: 3 seconds (TypeScript compilation)
- **npm run lint**: 1-2 seconds
- **npm run test**: May fail due to network restrictions - this is expected

**CRITICAL**: NEVER CANCEL any build command. Always set timeouts to at least 30 seconds for any build operation.

## Key Repository Structure

### Important Files
- `src/extension.ts` - Main extension entry point and activation logic
- `src/JenkinsIndicator.ts` - Status bar indicator implementation
- `src/Jenkins.ts` - Jenkins API communication logic
- `package.json` - Extension manifest and npm scripts
- `.vscode/launch.json` - Debug configurations for testing extension
- `webpack.config.js` - Build configuration for bundling

### Output Directories
- `dist/` - Webpack bundled extension output (used in production)
- `out/` - TypeScript compiled output (used in development/testing)

## CI/Build Pipeline
The extension builds on Windows, macOS, and Linux using GitHub Actions (`.github/workflows/main.yml`). The CI runs:
1. `npm install`
2. `npm test` (includes lint and compile steps)

## Known Issues and Limitations

### Network Dependencies
- Tests require internet access to download VS Code for testing
- Jenkins status updates require network access to Jenkins servers
- In restricted network environments, focus on build/compile validation rather than runtime testing

### Development Notes
- Extension supports VS Code 1.74.0+
- Uses deprecated `request` library (planned for future update)
- ESLint shows warnings for TypeScript `any` types - these are acceptable for VS Code API compatibility
- Uses webpack for bundling to reduce extension size

## Common Tasks Reference

### First-time Setup
```bash
git clone https://github.com/alefragnani/vscode-jenkins-status.git
cd vscode-jenkins-status
git submodule init && git submodule update
npm install
npm run build
```

### Development Cycle
```bash
npm run lint          # Check code style
npm run build         # Build for development
# Test in VS Code Extension Development Host
npm run lint          # Final check before commit
```

### Production Build
```bash
npm run vscode:prepublish  # Creates optimized build for publishing
```

Always run `npm run lint` before committing changes as the CI pipeline will fail on linting errors.