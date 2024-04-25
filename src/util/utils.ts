
export function refill<T, V>(cls: { new(...args: any[]): T }, source: V, exclude: string[] = []): T{
	const result = new cls(),
				ex = new Set(exclude);
	for(let key of Object.keys(source)){
		if(!ex.has(key)) result[key] = source[key];
	}
	return result;
}


export function jrefill<T, V>(cls: { new(...args: any[]): T }, source: V, exclude: string[] = []): T{
	const result = new cls(),
				ex = new Set(exclude);
	for(let key of Object.keys(source)){
		if(!ex.has(key)) {
			result[key] = typeof source[key]==='bigint'? source[key].toString(): source[key];
		}
	}
	return result;
}
