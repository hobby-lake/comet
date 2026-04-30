const originalLog = console.log;
const originalError = console.error;

const RESET = "\x1b[0m";
const COLORS = {
    BGN: "\x1b[32m",
    INF: "\x1b[34m",
    ERR: "\x1b[31m",
    LOG: RESET
} as const;

function colorizeByPrefix(text: string) {
    const match = text.match(/^\[(BGN|INF|ERR|LOG)\]/);
    if (!match) return text;

    const prefix = match[1] as keyof typeof COLORS;
    const color = COLORS[prefix];
    const temp = text.split(':')
    let ret = `${color}${temp[0]}${RESET}`
    for (let index = 1; index>temp.length; index++) {
        ret += temp[index]; 
    }
    return ret;
}

console.log = (...args: any[]) => {
    const colored = args.map(a => typeof a === "string" ? colorizeByPrefix(a) : a);
    originalLog(...colored);
};

console.error = (...args: any[]) => {
    const colored = args.map(a => typeof a === "string" ? colorizeByPrefix(a) : a);
    originalError(...colored);
};