export type PostRow = {
  username: string;
  post_date_label: string;
  query_zh: string;
  query_en: string;
  query_key: string;
  likes: number;
  replies: number;
  reposts: number;
  shares: number;
  institutional: boolean;
};

export type StatsPayload = {
  n_rows_unique: number;
  likes: { sum: number; median: number; mean: number };
  concentration: {
    gini_likes: number;
    top10_share_of_likes: number;
  };
  press_concentration?: {
    institutional_share_of_total_likes: number;
  };
};
