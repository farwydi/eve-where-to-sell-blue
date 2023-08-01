import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import init from "eve-where-to-sell-blue";
// @ts-ignore
import wasm from 'eve-where-to-sell-blue/eve_where_to_sell_blue_bg.wasm?url';

await init(wasm);


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
)