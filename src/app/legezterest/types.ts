export interface Image {
  id: string;
  url: string;
  title: string;
  author: string;
  likes: number;
  category: string;
  tags: string[];
  size: {
    width: number;
    height: number;
  };
}
