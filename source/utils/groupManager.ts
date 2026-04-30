// --- グループマネージャ ---



// === 分解と組み立て ===
export function stringParser():void{

}

export function stringBuilder():void{

}

// === 編集 ===



// === 判定 ===
export function isFull(group:string[], maxThreshold:number):boolean{
    if (group.length === maxThreshold) return true;
    return false;
}

export function isEnough(group:string[], minThreshold:number):boolean{
    if (group.length === minThreshold) return true;
    return false;
}

export function isIn(group:string[], target:string):boolean{
    // targetはメンション 
    return group.includes(target);
}