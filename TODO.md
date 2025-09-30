# TODO: Implement Session Storage Auth Protection

- [x] Modify frontend/src/Pages/AdminPanel.jsx:
  - Add useEffect to check sessionStorage for 'isLoggedIn' on component mount.
  - If sessionStorage.getItem('isLoggedIn') !== 'true', navigate to '/login'.

# TODO: Implement User Authentication

- [x] Modify frontend/src/Pages/LoginSignUp.jsx:
  - Change from admin login to user login/signup.
  - Add signup functionality with form for username, password.
  - Store user data in localStorage.
  - Add login check for users.
- [x] Update Navbar.jsx:
  - Change login button to show user name if logged in, or login/signup.
  - Add logout functionality for users.
- [ ] Add route protection for user-specific pages if needed.

# TODO: Implement Product Management

- [x] Update frontend/src/Pages/AddProduct.jsx:
  - Implement actual product addition logic (e.g., add to a products array or API call).
  - Validate inputs.
- [x] Update frontend/src/Pages/ProductList.jsx:
  - Display list of products from data source.
  - Add edit and delete functionality.
- [ ] Update product data source (e.g., all_product.js or API).

# TODO: Implement Discount System

- [x] Update frontend/src/Pages/AddDiscount.jsx:
  - Implement adding discounts to products.
- [x] Update frontend/src/Pages/DiscountList.jsx:
  - Display and manage discounts.

# TODO: Implement Cart Functionality

- [x] Update frontend/src/Pages/Cart.jsx:
  - Ensure cart items are displayed correctly.
  - Implement remove items, update quantities.
- [x] Update CartContext.js:
  - Ensure add to cart, remove, etc., work properly.

# TODO: Implement Shop and Product Pages

- [x] Update frontend/src/Pages/Shop.jsx:
  - Display products from data.
- [x] Update frontend/src/Pages/ShopCategory.jsx:
  - Filter products by category.
- [x] Update frontend/src/Pages/Product.jsx:
  - Display product details.

# TODO: Implement Backend

- [ ] Set up backend server (e.g., Node.js/Express or Python/Flask).
- [ ] Implement API endpoints for products, users, cart, etc.
- [ ] Connect frontend to backend APIs.
