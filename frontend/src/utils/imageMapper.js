// Import local product images
import p1 from '../Components/Assets/product_1.png';
import p2 from '../Components/Assets/product_2.png';
import p3 from '../Components/Assets/product_3.png';
import p4 from '../Components/Assets/product_4.png';
import p5 from '../Components/Assets/product_5.png';
import p6 from '../Components/Assets/product_6.png';
import p7 from '../Components/Assets/product_7.png';
import p8 from '../Components/Assets/product_8.png';
import p9 from '../Components/Assets/product_9.png';
import p10 from '../Components/Assets/product_10.png';
import p11 from '../Components/Assets/product_11.png';
import p12 from '../Components/Assets/product_12.png';
import p13 from '../Components/Assets/product_13.png';
import p14 from '../Components/Assets/product_14.png';
import p15 from '../Components/Assets/product_15.png';
import p16 from '../Components/Assets/product_16.png';
import p17 from '../Components/Assets/product_17.png';
import p18 from '../Components/Assets/product_18.png';
import p19 from '../Components/Assets/product_19.png';
import p20 from '../Components/Assets/product_20.png';
import p21 from '../Components/Assets/product_21.png';
import p22 from '../Components/Assets/product_22.png';
import p23 from '../Components/Assets/product_23.png';
import p24 from '../Components/Assets/product_24.png';
import p25 from '../Components/Assets/product_25.png';
import p26 from '../Components/Assets/product_26.png';
import p27 from '../Components/Assets/product_27.png';
import p28 from '../Components/Assets/product_28.png';
import p29 from '../Components/Assets/product_29.png';
import p30 from '../Components/Assets/product_30.png';
import p31 from '../Components/Assets/product_31.png';
import p32 from '../Components/Assets/product_32.png';
import p33 from '../Components/Assets/product_33.png';
import p34 from '../Components/Assets/product_34.png';
import p35 from '../Components/Assets/product_35.png';
import p36 from '../Components/Assets/product_36.png';

const imageMap = {
  1: p1, 2: p2, 3: p3, 4: p4, 5: p5, 6: p6, 7: p7, 8: p8, 9: p9, 10: p10,
  11: p11, 12: p12, 13: p13, 14: p14, 15: p15, 16: p16, 17: p17, 18: p18, 19: p19, 20: p20,
  21: p21, 22: p22, 23: p23, 24: p24, 25: p25, 26: p26, 27: p27, 28: p28, 29: p29, 30: p30,
  31: p31, 32: p32, 33: p33, 34: p34, 35: p35, 36: p36,
};

/**
 * Get local image for a product
 * Tries to extract product number from image URL or uses product ID
 * Falls back to first product image if not found
 */
export const getLocalImage = (product) => {
  if (!product) return p1;
  
  // Try to get from product ID first
  if (product.id && imageMap[product.id]) {
    return imageMap[product.id];
  }
  
  // Try to extract number from image URL if it exists
  if (product.image && typeof product.image === 'string') {
    const match = product.image.match(/product_?(\d+)/i);
    if (match) {
      const num = parseInt(match[1]);
      if (imageMap[num]) return imageMap[num];
    }
  }
  
  // Default fallback
  return p1;
};

export default imageMap;
