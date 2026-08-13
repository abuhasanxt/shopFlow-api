export interface ProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  imageUrl: string;
  isActive?: boolean;
}



export interface ProductQuery {
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  q?: string;
  sort?: "price" | "createdAt";
  order?: "asc" | "desc";
  page?: string;
  limit?: string;
}

export interface ProductUpdate{
    name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  imageUrl?: string;
  isActive?: boolean;
    
}
