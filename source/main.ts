// --- エントリーポイント ---

import './utils/coloredLog'
import {
	launch
} from './core/bot';
import { initSchema } from './db/schema';

// === 事前ロード ===
initSchema();

// === 立ち上げ ===
launch();