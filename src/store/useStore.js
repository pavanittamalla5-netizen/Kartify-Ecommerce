
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set, get) => ({
      // KARTIFY DATA
      cart: [],
      wishlist: [],
      coins: 0,
      location: "Hyderabad 500001",

      // USER AUTHENTICATION
      users: [],
      currentUser: null,

      // ORDER HISTORY
      orders: [],

      // REGISTER USER
      register: (name, email, password) => {
        const users = get().users || [];
        const cleanEmail = email.toLowerCase().trim();

        const existingUser = users.find(
          (user) => user.email === cleanEmail
        );

        if (existingUser) {
          return {
            success: false,
            message: "Account already exists. Please login.",
          };
        }

        const newUser = {
          id: Date.now(),
          name: name.trim(),
          email: cleanEmail,
          password: password,
          address: null,
        };

        set({
          users: [...users, newUser],
          currentUser: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            address: null,
          },
        });

        return {
          success: true,
          message: "Account created successfully!",
        };
      },

      // LOGIN USER
      login: (email, password) => {
        const users = get().users || [];
        const cleanEmail = email.toLowerCase().trim();

        const user = users.find(
          (item) =>
            item.email === cleanEmail &&
            item.password === password
        );

        if (!user) {
          return {
            success: false,
            message: "Invalid email or password.",
          };
        }

        set({
          currentUser: {
            id: user.id,
            name: user.name,
            email: user.email,
            address: user.address || null,
          },
        });

        return {
          success: true,
          message: "Login successful!",
        };
      },

      // LOGOUT USER
      logout: () => {
        set({ currentUser: null });
      },

      // UPDATE PROFILE
      updateProfile: (updatedDetails) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        const updatedUser = {
          ...currentUser,
          ...updatedDetails,
        };

        set({
          currentUser: updatedUser,
          users: get().users.map((user) =>
            user.id === currentUser.id
              ? { ...user, ...updatedDetails }
              : user
          ),
        });
      },

      // SAVE DELIVERY ADDRESS
      saveAddress: (address) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        const updatedUser = {
          ...currentUser,
          address: { ...address },
        };

        set({
          currentUser: updatedUser,
          users: get().users.map((user) =>
            user.id === currentUser.id
              ? { ...user, address: { ...address } }
              : user
          ),
        });
      },

      // GET SAVED ADDRESS
      getSavedAddress: () => {
        return get().currentUser?.address || null;
      },

      // ADD PRODUCT TO CART
      addToCart: (product) =>
        set((state) => {
          const found = state.cart.find(
            (item) => item.id === product.id
          );

          return {
            cart: found
              ? state.cart.map((item) =>
                  item.id === product.id
                    ? { ...item, qty: item.qty + 1 }
                    : item
                )
              : [...state.cart, { ...product, qty: 1 }],
          };
        }),

      // CHANGE PRODUCT QUANTITY
      changeQty: (id, delta) =>
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item.id === id
                ? { ...item, qty: item.qty + delta }
                : item
            )
            .filter((item) => item.qty > 0),
        })),

      // REMOVE PRODUCT FROM CART
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) => item.id !== id
          ),
        })),

      // CLEAR CART
      clearCart: () => set({ cart: [] }),

      // WISHLIST
      toggleWishlist: (product) =>
        set((state) => ({
          wishlist: state.wishlist.some(
            (item) => item.id === product.id
          )
            ? state.wishlist.filter(
                (item) => item.id !== product.id
              )
            : [...state.wishlist, product],
        })),

      // PLACE ORDER
      placeOrder: (order) =>
        set((state) => ({
          orders: [...state.orders, order],
          cart: [],
        })),

      // GET CURRENT USER ORDERS
      getUserOrders: () => {
        const currentUser = get().currentUser;
        if (!currentUser) return [];

        return get().orders.filter(
          (order) => order.userId === currentUser.id
        );
      },
    }),

    {
      name: "kartify-store",
    }
  )
);
