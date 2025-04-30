export type Article = {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  slug: string;
  createdAt: string | null;
  totalViewCount?: number;
  monthlyViewCount?: number;
  yearlyViewCount?: number;
  viewCount?: number; // 人気情報用に必要
};
