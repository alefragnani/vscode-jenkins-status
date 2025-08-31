import * as assert from 'assert';
import { colorToBuildStatus, colorToBuildStatusName, BuildStatus } from '../../Jenkins';

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