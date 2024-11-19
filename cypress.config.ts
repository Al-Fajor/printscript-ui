import { defineConfig } from "cypress";
import dotenv from 'dotenv'
// import {FRONTEND_URL} from "./src/utils/constants";
dotenv.config()

export default defineConfig({
  e2e: {
    setupNodeEvents(_, config) {
      config.env = process.env
      return config
    },
    experimentalStudio: true,
    baseUrl: process.env.FRONTEND_URL ?? "__FRONTEND_URL__",
    chromeWebSecurity: false //?
  },
});
