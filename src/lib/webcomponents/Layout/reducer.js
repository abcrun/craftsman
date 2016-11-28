import { handleActions } from 'redux-actions';
import * as T from './actionTypes';
import { IBTree } from '../../utils/IBTree';

let chooseBgColor = (p, prev) => {
    let themes = ['#FF6138', '#FFFF9D', '#BEEB9F', '#79BD8F', '#00A388'],
        pColor = p.data.styles.background || '', prevColor = prev ? prev.data.styles.background : '';
    return themes.filter((theme) => {
        return theme != pColor && theme != prevColor;
    })[parseInt(Math.random() * 3)];
}

let initData = {
    styles: {},
    components: []
}

IBTree.init(initData);
let initialState = IBTree.IndexDB();

export default handleActions({
    [T.ADD]: (state, action) => { 
        let { index } = action.payload, node = IBTree.select(index);
        node.add(initData);
        return Object.assign({}, IBTree.IndexDB());
    },

    [T.DELETE]: (state, action) => { 
        let { index } = action.payload;
        IBTree.select(index).remove();

        return Object.assign({}, IBTree.IndexDB());
    },

    [T.INSERTBEFORE]: (state, action) => { 
        let { index } = action.payload, node = IBTree.select(index);
        node.insertBefore(initData);

        return Object.assign({}, IBTree.IndexDB());
    },

    [T.INSERTAFTER]: (state, action) => { 
        let { index } = action.payload, node = IBTree.select(index);
        node.insertAfter(initData);

        return Object.assign({}, IBTree.IndexDB());
    },

    [T.MOVE]: (state, action) => { 
        let { from, to } = action.payload;
        IBTree.move(from, to);

        return Object.assign({}, IBTree.IndexDB());
    },

    [T.SETCURSOR]: (state, action) => { 
        let { index } = action.payload;
        IBTree.cursor(index);

        return Object.assign({}, IBTree.IndexDB());
    },

    [T.UPDATESTYLES]: (state, action) => { 
        let { index, styles } = action.payload;
        IBTree.select(index).data.styles = styles;

        return Object.assign({}, IBTree.IndexDB());
    },

    [T.ADDCOMPONENT]: (state, action) => { 
        let { node, name } = action.payload;
        node.data.components.push({ name })

        return Object.assign({}, IBTree.IndexDB());
    },

    [T.REMOVECOMPONENT]: (state, action) => { 
        let { i, index } = action.payload;
        IBTree.select(index).data.components.splice(i, 1);

        return Object.assign({}, IBTree.IndexDB());
    },

    [T.SETCOMPONENT]: (state, action) => { 
        let { index, i, data } = action.payload;
        IBTree.select(index).data.components[i].data = data; 

        return Object.assign({}, IBTree.IndexDB());
    }

}, initialState);
