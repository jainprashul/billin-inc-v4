
import { useState } from 'react'
import { Invoices, Product } from '../../services/database/model';


const useInvoiceForm = (invoice : Invoices | undefined) => {
    const [date, setDate] = useState<Date | null>(new Date())
    const [products, setProducts] = useState<Product[]>(invoice?.products || []);
  
    const onAddProduct = (product: Product) => {
      setProducts([...products, product])
    }
  
    const onDeleteProduct = (product: Product) => {
      setProducts(products.filter(p => p.id !== product.id))
    }
  
    return {
        date, setDate,
        products, setProducts,
        onAddProduct,
        onDeleteProduct,
    }
}


export default useInvoiceForm;