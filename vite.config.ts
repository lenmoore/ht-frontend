import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // server: {
  //   https: {
  //     key: "key.pem",
  //     cert: "cert.pem",
  //   },
  // },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
                @import "src/styles/_variables.scss"; 
                @import "src/styles/neubrut.scss";
                @import "src/styles/paddings.scss"; 
                @import "src/styles/custom.scss"; 
                `,
      },
    },
  },
});
