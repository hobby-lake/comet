// --- エントリーポイント ---

import './utils/coloredLog'
import {
	launch
} from './core/bot';
import { initSchema } from './db/schema';

initSchema();
launch();