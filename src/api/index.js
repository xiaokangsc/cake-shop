// API 封装
const BASE_URL = 'http://localhost:3000/api';

function request(url, options = {}) {
  const token = uni.getStorageSync('token');
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token || ''
      },
      success: (res) => {
        if (res.data.code === 0) {
          resolve(res.data.data);
        } else {
          uni.showToast({ title: res.data.msg || '请求失败', icon: 'none' });
          reject(res.data);
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络错误', icon: 'none' });
        reject(err);
      }
    });
  });
}

// 产品
export const getProducts = (params) => request('/products/list', { data: params });
export const getProductDetail = (id) => request(`/products/detail/${id}`);

// 分类
export const getCategories = () => request('/categories/list');

// 购物车
export const getCartList = () => request('/cart/list');
export const addToCart = (data) => request('/cart/add', { method: 'POST', data });
export const updateCart = (data) => request('/cart/update', { method: 'POST', data });
export const checkAllCart = (checked) => request('/cart/check-all', { method: 'POST', data: { checked } });
export const deleteCart = (ids) => request('/cart/delete', { method: 'POST', data: { ids } });
export const getCartCount = () => request('/cart/count');

// 订单
export const createOrder = (data) => request('/orders/create', { method: 'POST', data });
export const getOrders = (params) => request('/orders/list', { data: params });
export const getOrderDetail = (id) => request(`/orders/detail/${id}`);
export const cancelOrder = (id) => request(`/orders/cancel/${id}`, { method: 'POST' });
export const payOrder = (id) => request(`/orders/pay/${id}`, { method: 'POST' });
export const confirmOrder = (id) => request(`/orders/confirm/${id}`, { method: 'POST' });

// 用户
export const login = (data) => request('/users/login', { method: 'POST', data });
export const getUserInfo = () => request('/users/info');
export const updateUser = (data) => request('/users/update', { method: 'POST', data });
export const getAddresses = () => request('/users/addresses');
export const addAddress = (data) => request('/users/address/add', { method: 'POST', data });
export const updateAddress = (data) => request('/users/address/update', { method: 'POST', data });
export const deleteAddress = (id) => request('/users/address/delete', { method: 'POST', data: { id } });

// 店铺
export const getShopInfo = () => request('/shop/info');
export const getBanners = () => request('/shop/banners');

// 管理后台
export const getAdminProducts = () => request('/shop/admin/products');
export const saveProduct = (data) => request('/shop/admin/product/save', { method: 'POST', data });
export const deleteProduct = (id) => request('/shop/admin/product/delete', { method: 'POST', data: { id } });
export const updateProductStatus = (id, status) => request('/shop/admin/product/status', { method: 'POST', data: { id, status } });
export const getAdminOrders = (params) => request('/orders/admin/list', { data: params });
export const updateOrderStatus = (order_id, status) => request('/orders/admin/status', { method: 'POST', data: { order_id, status } });
export const getDashboard = () => request('/shop/admin/dashboard');
export const importDouyinProducts = (products) => request('/shop/admin/import-douyin', { method: 'POST', data: { products } });
