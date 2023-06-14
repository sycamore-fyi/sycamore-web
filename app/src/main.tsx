import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import '@fontsource-variable/jost';
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import * as amplitude from "@amplitude/analytics-browser"
import { config } from "./lib/config";
import { getEnvironment } from "./lib/getEnvironment";
import { Environment } from "@sycamore-fyi/shared";
import Smartlook from 'smartlook-client'

if (getEnvironment() !== Environment.LOCAL) {
  amplitude.init(config().AMPLITUDE_API_KEY)
  Smartlook.init(config().SMARTLOOK_KEY)
}

const root = document.getElementById('root') as HTMLElement

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
