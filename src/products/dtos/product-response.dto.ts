export class ProductResponseDTO {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  createdAt: string | null;
}
