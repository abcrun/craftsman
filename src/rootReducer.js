import { combineReducers } from 'redux';
import Layout from './lib/webcomponents/Layout';

export default combineReducers({
    [Layout.constants.NAME] : Layout.reducer
})
