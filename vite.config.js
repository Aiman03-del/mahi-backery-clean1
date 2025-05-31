import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // বড় লাইব্রেরিগুলোকে আলাদা chunk এ ভাগ করুন
          react: ["react", "react-dom"],
          firebase: ["firebase/app", "firebase/firestore"],
          // আপনার অন্যান্য বড় ডিপেন্ডেন্সি
        },
      },
    },
    // Warning limit বাড়াতে পারেন (যদি প্রয়োজন হয়)
    chunkSizeWarningLimit: 1000,
  },
  plugins: [react(), tailwindcss()],
  server: { historyApiFallback: true },
});
