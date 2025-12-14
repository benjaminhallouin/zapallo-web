/**
 * Polyfills Setup
 *
 * Set up polyfills for Node.js test environment before any other imports.
 * This file is loaded before jest.setup.ts to ensure polyfills are available.
 */

// Text encoding polyfills
const { TextEncoder, TextDecoder } = require('util');
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

// Streams API polyfill
const { ReadableStream, WritableStream, TransformStream } = require('web-streams-polyfill');
globalThis.ReadableStream = ReadableStream;
globalThis.WritableStream = WritableStream;
globalThis.TransformStream = TransformStream;

// Fetch API polyfill
require('whatwg-fetch');
