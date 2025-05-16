
import { NextApiRequest, NextApiResponse } from 'next';
import { updateProductStock } from '@/data/products/product/services/productStockService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow PUT requests
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const { stockQuantity, colorVariant } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    if (stockQuantity === undefined || typeof stockQuantity !== 'number') {
      return res.status(400).json({ error: 'Valid stock quantity is required' });
    }

    // Update the product stock
    const success = await updateProductStock(
      id,
      stockQuantity,
      colorVariant || undefined
    );

    if (success) {
      return res.status(200).json({ 
        success: true,
        message: 'Stock updated successfully',
        stockQuantity
      });
    } else {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to update stock' 
      });
    }
    
  } catch (error) {
    console.error('Error updating product stock:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
}
