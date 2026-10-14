'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { render } = require('../markdown');

test('headings', () => {
  assert.strictEqual(render('# Hi'), '<h1>Hi</h1>');
  assert.strictEqual(render('### Three'), '<h3>Three</h3>');
});

test('inline formatting', () => {
  assert.strictEqual(render('**b** and *i* and `c`'), '<p><strong>b</strong> and <em>i</em> and <code>c</code></p>');
});

test('links and images only allow http(s)', () => {
  assert.match(render('[x](https://a.com)'), /<a href="https:\/\/a.com"/);
  assert.doesNotMatch(render('[x](javascript:alert(1))'), /<a /);
  assert.match(render('![alt](https://a.com/i.png)'), /<img alt="alt" src="https:\/\/a.com\/i.png">/);
});

test('escapes HTML to prevent XSS', () => {
  assert.strictEqual(render('<script>alert(1)</script>'), '<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>');
});

test('lists', () => {
  assert.strictEqual(render('- a\n- b'), '<ul><li>a</li><li>b</li></ul>');
  assert.strictEqual(render('1. a\n2. b'), '<ol><li>a</li><li>b</li></ol>');
});

test('fenced code is escaped and not formatted', () => {
  assert.strictEqual(render('```js\n<b>*x*</b>\n```'), '<pre><code class="language-js">&lt;b&gt;*x*&lt;/b&gt;</code></pre>');
});

test('blockquote, hr and paragraph joining', () => {
  assert.strictEqual(render('> quote'), '<blockquote><p>quote</p></blockquote>');
  assert.strictEqual(render('---'), '<hr>');
  assert.strictEqual(render('one\ntwo\n\nthree'), '<p>one two</p>\n<p>three</p>');
});
