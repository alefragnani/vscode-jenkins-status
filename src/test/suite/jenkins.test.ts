import * as assert from 'assert';
import { colorToBuildStatus, colorToBuildStatusName, BuildStatus, ConnectionStatus, Jenkins } from '../../Jenkins';

function fakeResponse(status: number, body: unknown): Response {
    return {
        status,
        text: async () => JSON.stringify(body)
    } as unknown as Response;
}

suite('Jenkins Status Tests', () => {
    test('colorToBuildStatus should return correct status for blue', () => {
        assert.strictEqual(colorToBuildStatus('blue'), BuildStatus.Success);
    });

    test('colorToBuildStatus should return correct status for red', () => {
        assert.strictEqual(colorToBuildStatus('red'), BuildStatus.Failed);
    });

    test('colorToBuildStatus should return InProgress for anime colors', () => {
        assert.strictEqual(colorToBuildStatus('blue_anime'), BuildStatus.InProgress);
        assert.strictEqual(colorToBuildStatus('red_anime'), BuildStatus.InProgress);
    });

    test('colorToBuildStatus should return Disabled for unknown colors', () => {
        assert.strictEqual(colorToBuildStatus('unknown'), BuildStatus.Disabled);
    });

    test('colorToBuildStatusName should return localized status names', () => {
        // These will be localized strings, so we just check they're not empty
        assert.ok(colorToBuildStatusName('blue').length > 0);
        assert.ok(colorToBuildStatusName('red').length > 0);
        assert.ok(colorToBuildStatusName('yellow').length > 0);
    });
});

suite('Jenkins.getStatus Tests', () => {
    const originalFetch = global.fetch;

    teardown(() => {
        global.fetch = originalFetch;
    });

    test('resolves Connected status on 200 response', async () => {
        global.fetch = (async () => fakeResponse(200, {
            displayName: 'myJob',
            url: 'http://localhost:8080/job/myJob/',
            color: 'blue',
            lastBuild: { number: 42 }
        })) as typeof fetch;

        const jenkins = new Jenkins();
        const result = await jenkins.getStatus('http://localhost:8080/job/myJob', '', '');

        assert.strictEqual(result.connectionStatus, ConnectionStatus.Connected);
        assert.strictEqual(result.jobName, 'myJob');
        assert.strictEqual(result.status, BuildStatus.Success);
        assert.strictEqual(result.buildNr, 42);
    });

    test('appends "(in progress)" suffix for anime colors', async () => {
        global.fetch = (async () => fakeResponse(200, {
            displayName: 'myJob',
            url: 'http://localhost:8080/job/myJob/',
            color: 'blue_anime',
            lastBuild: { number: 42 }
        })) as typeof fetch;

        const jenkins = new Jenkins();
        const result = await jenkins.getStatus('http://localhost:8080/job/myJob', '', '');

        assert.strictEqual(result.status, BuildStatus.InProgress);
        assert.ok(result.statusName.includes('in progress'));
    });

    test('resolves AuthenticationRequired on 401/403 response', async () => {
        for (const statusCode of [401, 403]) {
            global.fetch = (async () => fakeResponse(statusCode, {})) as typeof fetch;

            const jenkins = new Jenkins();
            const result = await jenkins.getStatus('http://localhost:8080/job/myJob', '', '');

            assert.strictEqual(result.connectionStatus, ConnectionStatus.AuthenticationRequired);
            assert.strictEqual(result.jobName, 'AUTHENTICATION NEEDED');
            assert.strictEqual(result.code, statusCode);
        }
    });

    test('resolves InvalidAddress on unexpected status codes', async () => {
        global.fetch = (async () => fakeResponse(404, {})) as typeof fetch;

        const jenkins = new Jenkins();
        const result = await jenkins.getStatus('http://localhost:8080/job/myJob', '', '');

        assert.strictEqual(result.connectionStatus, ConnectionStatus.InvalidAddress);
        assert.strictEqual(result.jobName, 'Invalid URL');
        assert.strictEqual(result.code, 404);
    });

    test('resolves Error connectionStatus when fetch rejects', async () => {
        global.fetch = (async () => {
            throw new Error('network down');
        }) as typeof fetch;

        const jenkins = new Jenkins();
        const result = await jenkins.getStatus('http://localhost:8080/job/myJob', '', '');

        assert.strictEqual(result.connectionStatus, ConnectionStatus.Error);
        assert.ok(result.jobName.includes('network down'));
    });

    test('sends Authorization Basic header when username/password provided', async () => {
        let capturedHeaders: Record<string, string> | undefined;
        global.fetch = (async (_url: string, init?: RequestInit) => {
            capturedHeaders = init?.headers as Record<string, string>;
            return fakeResponse(200, { displayName: 'myJob', url: '', color: 'blue', lastBuild: { number: 1 } });
        }) as typeof fetch;

        const jenkins = new Jenkins();
        await jenkins.getStatus('http://localhost:8080/job/myJob', 'user', 'pass');

        const expected = 'Basic ' + Buffer.from('user:pass').toString('base64');
        assert.strictEqual(capturedHeaders?.['Authorization'], expected);
    });

    test('omits Authorization header when no username provided', async () => {
        let capturedHeaders: Record<string, string> | undefined;
        global.fetch = (async (_url: string, init?: RequestInit) => {
            capturedHeaders = init?.headers as Record<string, string>;
            return fakeResponse(200, { displayName: 'myJob', url: '', color: 'blue', lastBuild: { number: 1 } });
        }) as typeof fetch;

        const jenkins = new Jenkins();
        await jenkins.getStatus('http://localhost:8080/job/myJob', '', '');

        assert.strictEqual(capturedHeaders?.['Authorization'], undefined);
    });
});