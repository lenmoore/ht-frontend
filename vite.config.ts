import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), basicSsl()],
  // server: {
  //   https: {
  //     key: "key.pem",
  //     cert: "cert.pem",
  //   },
  // },

  // server: {
  //   https: {
  //     key: fs.readFileSync(
  //       path.resolve(__dirname, "../certificates/server.key"),
  //     ),
  //     cert: fs.readFileSync(
  //       path.resolve(__dirname, "../certificates/server.cert"),
  //     ),
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
