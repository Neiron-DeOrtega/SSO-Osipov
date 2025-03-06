// src/index.ts
import { createServer } from './app';
import { Config } from './types';

export function startSSOServer(config: Config) {
    const app = createServer(config);
    app.listen(process.env.PORT, () => {
        console.log(`Server started on http://localhost:${process.env.PORT}`);
    });
}
