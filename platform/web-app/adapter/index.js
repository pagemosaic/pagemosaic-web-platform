import { createRequestHandler } from 'web-adapter';
import * as build from '../build/index.js';
export const handler = createRequestHandler({build});
