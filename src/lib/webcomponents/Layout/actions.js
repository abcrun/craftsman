import { createAction } from 'redux-actions';
import * as T from './actionTypes.js';

export const add = createAction(T.ADD);
export const remove = createAction(T.DELETE);
export const insertBefore = createAction(T.INSERTBEFORE);
export const insertAfter = createAction(T.INSERTAFTER);
export const move = createAction(T.MOVE);
export const setCursor = createAction(T.SETCURSOR);
export const updateStyles = createAction(T.UPDATESTYLES);
export const addComponent = createAction(T.ADDCOMPONENT);
export const removeComponent = createAction(T.REMOVECOMPONENT);
export const setComponent = createAction(T.SETCOMPONENT);
