'use client';

import { useStoreModal } from '@/hooks/use-store-modal';

const Home = () => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  // useEffect(() => {
  //   if (!isOpen) {
  //     onOpen();
  //   }
  // }, [isOpen, onOpen]);

  return <div id="home">
    <h1 className="font-bold underline mb-10">Hello world!</h1>
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      type="button"
      onClick={() => {
        onOpen();
      }}
    >
      Create Indexer
    </button>
  </div>;
};

export default Home;
