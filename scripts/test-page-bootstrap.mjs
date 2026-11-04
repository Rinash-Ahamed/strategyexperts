import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const text = await readFile(new URL('../lib/page-bootstrap.ts', import.meta.url), 'utf8');
const source = text.split('String.raw`')[1].split('`;')[0];
const classes = new Set();
// No timers, listeners, navigation or scrolling APIs: bootstrap must not need them.
vm.runInNewContext(source, {
  document: { documentElement: { classList: { add: name => classes.add(name) } } },
});
assert.deepEqual([...classes], ['js']);
console.log('PASS: reveal styles enabled without an opening screen, timers or scroll interception.');
