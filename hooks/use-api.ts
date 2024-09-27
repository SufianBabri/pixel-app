import { useCallback, useEffect, useState } from "react";
import type { Models } from "react-native-appwrite";

type ApiResponse<T extends Models.Document> =
	| { data: T[]; error?: string }
	| { data?: T[]; error: string };
type ApiFunction<T extends Models.Document> = () => Promise<ApiResponse<T>>;

export default function useApi<T extends Models.Document>(fn: ApiFunction<T>) {
	const [response, setResponse] = useState<ApiResponse<T>>();
	const [loading, setLoading] = useState(false);
	const [refetching, setRefetching] = useState(false);

	const fetchData = useCallback(async () => {
		setLoading(true);
		const res = await fn();
		setResponse(res);
		setLoading(false);
	}, [fn]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const refetch = useCallback(async () => {
		setRefetching(true);
		const res = await fn();
		setResponse(res);
		setRefetching(false);
	}, [fn]);

	const handlePostDeleted = useCallback(
		(postId: string) => {
			const updated = response?.data?.filter(item => item.$id !== postId) ?? [];
			setResponse({ data: updated });
		},
		[response]
	);

	return { response, loading, refetch, refetching, handlePostDeleted };
}
