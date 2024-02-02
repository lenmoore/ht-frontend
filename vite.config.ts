import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import basicSsl from '@vitejs/plugin-basic-ssl';


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        basicSsl(),
    ],
    server: {
        https: {
            key: 'key.pem',
            cert: 'cert.pem',
        },
        // proxy: {
        //     '/api': {
        //         target: 'https://localhost',
        //         changeOrigin: true,
        //         secure: true,
        //         ws: true,
        //     },
        // },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "src/styles/_variables.scss"; @import "src/styles/neubrut.scss";@import "src/styles/paddings.scss"; `,
            },
        },
    },

});
