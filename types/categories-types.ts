// Define the Category interface based on database schema with added items
export interface Category {
  id: number;
  name: string;
  description: string | null;
  parent_id: number | null;
  href?: string;
  image?: string;
  children?: Category[];
}
