import { useEffect, useState } from "react";

type ApiResponse<T> = { data: T; error?: string } | { data?: T; error: string };
type ApiFunction<T> = () => Promise<ApiResponse<T>>;

export default function useApi<T>(fn: ApiFunction<T>) {
	const [response, setResponse] = useState<ApiResponse<T>>();
	const [loading, setLoading] = useState(false);
	const [refetching, setRefetching] = useState(false);

	const fetchData = async () => {
		setLoading(true);
		const res = await fn();

		setResponse(res);
		setLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, []);

	async function refetch() {
		setRefetching(true);
		const res = await fn();

		setResponse(res);
		setRefetching(false);
	}

	return { response, loading, refetch, refetching };
}
