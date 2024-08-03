export function parseArrayAsList(arr: string[]) {
	if (arr.length > 1) return "· " + arr.join("\n\n· ");
	if (arr.length > 0) return arr.join(" and ");
}
