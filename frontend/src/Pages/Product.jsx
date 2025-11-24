
import React, { useState, useEffect } from "react";
import { useCart } from '../Context/CartContext';
import { useParams } from "react-router-dom";
import { getLocalImage } from '../utils/imageMapper';

const sizes = ["S", "M", "L", "XL", "XXL"];

const Product = () => {
		const { productId } = useParams();
		const [product, setProduct] = useState(null);
		const [selectedSize, setSelectedSize] = useState("");
		const { addToCart } = useCart();

		useEffect(() => {
			const load = async () => {
				try {
					const res = await fetch(`/api/products/${productId}`);
					if (!res.ok) return setProduct(null);
					const data = await res.json();
					setProduct(data);
				} catch (e) {
					console.error('Failed to load product', e);
					setProduct(null);
				}
			};
			load();
		}, [productId]);

		if (!product) return <div style={{padding:40}}>Product not found.</div>;

		// Dummy gallery: gunakan gambar yang sama untuk contoh
		const localImage = getLocalImage(product);
		const gallery = [localImage, localImage, localImage, localImage];

	const handleAddToCart = () => {
		if (!product || (product.stock !== undefined && Number(product.stock) <= 0)) {
			alert('Product is out of stock');
			return;
		}
		if (selectedSize) {
			addToCart(product.id, selectedSize, 1);
		}
	};

	return (
		<div style={{display:'flex',gap:40,alignItems:'flex-start',padding:'40px 0',maxWidth:1200,margin:'0 auto'}}>
			{/* Gallery */}
			<div style={{display:'flex',flexDirection:'column',gap:16}}>
				{gallery.map((img, i) => (
					<img key={i} src={img} alt={product.name} style={{width:70,height:90,objectFit:'cover',borderRadius:8,border:'1px solid #eee'}} />
				))}
			</div>
			{/* Main Image */}
			<img src={localImage} alt={product.name} style={{width:340,height:400,objectFit:'cover',borderRadius:16,boxShadow:'0 2px 12px rgba(0,0,0,0.08)'}} />
			{/* Info */}
			<div style={{flex:1}}>
				<h2 style={{fontSize:'2rem',marginBottom:12}}>{product.name}</h2>
				<div style={{display:'flex',alignItems:'center',gap:16,marginBottom:8}}>
					<span style={{color:'#c41717',fontWeight:'bold',fontSize:'1.2rem'}}>${product.new_price}</span>
					<span style={{color:'#888',textDecoration:'line-through',fontSize:'1rem'}}>${product.old_price}</span>
					<span style={{color:'#f5a623',fontWeight:'bold'}}>★★★★★</span>
					<span style={{color:'#888',fontSize:'0.95rem'}}>(122)</span>
				</div>
				<div style={{marginBottom:8,fontWeight:'600'}}>Stok: {product.stock ?? 0}</div>
				<p style={{color:'#555',marginBottom:18}}>A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.</p>
				<div style={{marginBottom:18}}>
					<span style={{fontWeight:'bold'}}>Select Size</span>
					<div style={{display:'flex',gap:12,marginTop:8}}>
						{sizes.map(size => (
							<button key={size} onClick={()=>setSelectedSize(size)} style={{padding:'8px 18px',border:'1px solid #ccc',borderRadius:6,background:selectedSize===size?'#e63e3e':'#fff',color:selectedSize===size?'#fff':'#222',fontWeight:'bold',cursor:'pointer'}}>{size}</button>
						))}
					</div>
				</div>
				<button onClick={handleAddToCart} disabled={!selectedSize || (product && product.stock !== undefined && Number(product.stock) <= 0)} style={{padding:'14px 0',width:220,background:(!selectedSize || (product && product.stock !== undefined && Number(product.stock) <= 0))? '#ccc':'#e63e3e',color:'#fff',border:'none',borderRadius:6,fontWeight:'bold',fontSize:'1rem',cursor:(!selectedSize || (product && product.stock !== undefined && Number(product.stock) <= 0))?'not-allowed':'pointer',marginBottom:18}}>
				{(product && product.stock !== undefined && Number(product.stock) <= 0) ? 'OUT OF STOCK' : (selectedSize ? 'ADD TO CART' : 'SELECT SIZE')}
				</button>
				<div style={{marginBottom:8}}><b>Category:</b> {product.category === 'men' ? 'Men' : product.category === 'women' ? 'Women' : 'Kids'}, T-Shirt, Crop Top</div>
				<div><b>Tags:</b> modern, latest</div>
			</div>
		</div>
	);
};

export default Product;
