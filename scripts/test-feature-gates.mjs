import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const result=spawnSync(process.execPath,[fileURLToPath(new URL('../tests/ui-flow.test.mjs',import.meta.url))],{env:{...process.env,FEATURE_GATE_TEST:'1'},stdio:'inherit'});process.exit(result.status??1);
