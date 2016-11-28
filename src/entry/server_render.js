import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';

import configureStore from '../configureStore.js';
import Root from '../container/server_render';

import './reset.css';

export function handleRender(initialState){
    let store = configureStore(initialState);
    return (
        renderToString(
            <Provider store={ store }>
                <Root />
            </Provider>
        )
    )

}
