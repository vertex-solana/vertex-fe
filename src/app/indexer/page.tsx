'use client';

import { useStoreModal } from '@/hooks/use-store-modal';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Indexer = () => {
	const onOpen = useStoreModal((state) => state.onOpen);
	const isOpen = useStoreModal((state) => state.isOpen);
	const [indexers, setIndexers] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchIndexers = async () => {
			try {
				const response = await axios.get(
					'http://localhost:3001/edas-account/api/indexer',
					{
						headers: {
							Authorization: `Bearer YOUR_AUTH_TOKEN`,
						},
					}
				);

				const data = response?.data?.data;
				if (data.length === 0) {
					onOpen();
				} else {
					setIndexers(data || []);
				}
			} catch (error) {
				console.error('Error fetching indexers:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchIndexers();
	}, [onOpen]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="h-screen flex flex-col items-center justify-center">
			{indexers.length === 0 ? (
				<div>No indexers found. Please create one.</div>
			) : (
				<ul className="space-y-4">
					{indexers?.map((indexer) => (
						<li
							key={indexer.id}
							className="p-4 border rounded shadow bg-slate-800"
						>
							<h3 className="font-bold">{indexer.name}</h3>
							<p>ID: {indexer.id}</p>
							<p>Program ID: {indexer.programId}</p>
							<p>Version: {indexer.version}</p>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Indexer;
