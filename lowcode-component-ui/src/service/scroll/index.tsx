import { useState, useEffect, useRef } from "react";

function InfiniteScrollList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  const lastItemRef = useRef();

  useEffect(() => {
    loadItems();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
    );

    if (lastItemRef.current) {
      observer.observe(lastItemRef.current);
    }

    return () => {
      if (lastItemRef.current) {
        observer.unobserve(lastItemRef.current);
      }
    };
  }, [hasMore, loading]);

  async function loadItems() {
    setLoading(true);
    try {
      const response = await fetch(`/api/items?page=${page}`);
      const newItems = await response.json();
      setItems((prev) => [...prev, ...newItems]);
      setHasMore(newItems.length > 0);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {items.map((item, index) => (
        <div
          key={item.id}
          ref={index === items.length - 1 ? lastItemRef : null}
        >
          {item.content}
        </div>
      ))}
      {loading && <div>加载中...</div>}
      {!hasMore && <div>没有更多内容了</div>}
    </div>
  );
}
