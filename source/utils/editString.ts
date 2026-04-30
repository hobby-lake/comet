// --- 文字列操作用の一般式 ---

export function fullToHalf(str:string){
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
        // 文字コードを取得し、差分を計算して半角に変換
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
}