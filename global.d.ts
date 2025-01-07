declare module "*.json" {
  const value: {
    items: { id: string; name: string; category: string }[];
    recipes: {
      id: string;
      name: string;
      time: number;
      producers: string[];
      in: Record<string, number>;
      out: Record<string, number>;
    }[];
  };
  export default value;
}
