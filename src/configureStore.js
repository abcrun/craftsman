import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './rootReducer';
import thunk from 'redux-thunk';
import { NodeTree } from './lib/utils/NodeTree';
import createLogger from 'redux-logger';

const env = process.env.NODE_ENV;
const middleWares = env == 'development' ? applyMiddleware(thunk, createLogger()) : applyMiddleware(thunk);

const enhancer = compose(middleWares)

export default function configureStore(initialState) {
    if(initialState) initialState = NodeTree.toTree(initialState);
    return createStore(rootReducer, initialState, enhancer)
}
