import axios from "axios";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const App = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: false,
  });

  const fetchData = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `https://dummyjson.com/products?limit=20&skip=${(page - 1) * 20}`
      );
      const products = res.data.products;
      if (products.length === 0) {
        setHasMore(false);
      } else {
        setData((prev) => [...prev, ...products]);
        setPage((prev) => prev + 1);
      }
      // setData(data.data.products);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inView) {
      fetchData();
    }
  }, [inView]);

  return (
    <>
      <div className="grid grid-cols-6 gap-3 p-2">
        {data.map((user, index) => {
          return (
            <div
              key={index}
              className="shadow-sm rounded duration-100 hover:shadow-md cursor-pointer"
            >
              <img
                className="w-[200px] h-[200px]"
                src={user.thumbnail}
                alt={user.title}
              />
            </div>
          );
        })}

        {hasMore && (
          <div ref={ref} className="text-center py-4">
            {loading ? "Loading..." : "Loading again..."}
          </div>
        )}

        {!hasMore && (
          <p className="text-center text-gray-500 mt-4">Any products left</p>
        )}
      </div>
    </>
  );
};

export default App;
