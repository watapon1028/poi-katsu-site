import { useEffect, useState } from 'react';
import { fetchArticles } from '../lib/getArticles';

export default function HomePage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles().then(data => setArticles(data));
  }, []);

  return (
    <div>
      <h1>人気記事</h1>
      <ul>
        {articles.map((article, index) => (
          <li key={index}>{article.title}</li>
        ))}
      </ul>
    </div>
  );
}
