import 'babel-polyfill';
import 'es5-shim';
import 'es5-shim/es5-sham';
import 'console-polyfill';

import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

import Root from '../container/client_render';
import configureStore from '../configureStore';

import './reset.css';

const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState);

render(
    <Provider store={ store }>
        <Root />
    </Provider>,
    document.getElementById('wrapper')
)
