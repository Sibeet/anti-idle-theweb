import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
for(const mode of ['BAR_INPUT_TEST','RENDER_BENCHMARK']){const result=spawnSync(process.execPath,[fileURLToPath(new URL('../tests/ui-flow.test.mjs',import.meta.url))],{env:{...process.env,[mode]:'1'},stdio:'inherit'});if(result.status!==0)process.exit(result.status??1);}
