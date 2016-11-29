var NodeTree = (function(){
    var IndexDB = {}, counter = 0, root, Node = function(index, data){
        this.index = index;
        this.data = data;
        this.parent = null;
        this.firstChild = null;
        this.lastChild = null;
        this.next = null;
        this.prev = null;

        this.level = 0;//设置节点层级 
        this.length = 0;//设置子节点个数
    }

    Node.prototype = {
        add: function(index, data) {
            var node, index, level = this.level + 1;
            if(arguments.length == 1){
                data = index;
                index = ++counter;
            }
            this.length = this.length + 1;


            node = new Node(index, data);
            node.level = level;

            node.parent = this;
            if(this.lastChild){
                node.prev = this.lastChild;
                this.lastChild.next = node;
                this.lastChild = node;
            }else{
                this.firstChild = this.lastChild = node;
            }

            IndexDB[index] = node;

            return node;
        },
        remove: function(){
            var index = this.index, children = this.children();
            delete IndexDB[index];

            if(children.length) children.forEach(child => child.remove());
            this.parent.length -= 1;

            if(!this.prev) this.parent.firstChild = this.next;
            else this.prev.next = this.next;
            if(!this.next) this.parent.lastChild = this.prev;
            else this.next.prev = this.prev;

            this.next = this.prev = null;

            IndexDB.cursor = this.parent.index; 
            return this.parent;
        },
        insertBefore: function(data){
            let node = new Node(++counter, data);
            node.parent = this.parent;
            node.level = this.level;
            this.parent.length += 1;
            if(this.prev){
                node.prev = this.prev;
                this.prev.next = node;
            }else{
                this.parent.firstChild = node;
            }
            node.next = this;
            this.prev = node;

            IndexDB[counter] = node;

            return node;
        }, 
        insertAfter: function(data) {
            let node = new Node(++counter, data);
            node.parent = this.parent;
            node.level = this.level;
            this.parent.length -= 1;
            if(this.next){
                this.next.prev = node;
                node.next = this.next;
            }else{
                this.parent.lastChild = node;
            }
            node.prev = this;
            this.next = node;

            IndexDB[counter] = node;

            return node;
        },
        children: function(){
            let child = this.firstChild, children = [];
            while(child){
                children.push(child);
                child = child.next;
            }
            return children;
        }
    }

    return {
        init: function(index, data) {
            var root;
            if(arguments.length == 1){
                data = index;
                index = counter;
            }

            root = new Node(index, data);
            IndexDB[index] = root;
            IndexDB['cursor'] = index;
            return root;
        },
        select: function(index){
            return IndexDB[index];
        },
        cursor: function(index){
            IndexDB.cursor = index;
        },
        IndexDB: function(){
            return IndexDB;
        },
        move: function(from, to) {
            var nodeFrom = IndexDB[from], nodeTo = IndexDB[to];
            var changeLevel = function(node){
                var level = node.level;
                if(node.length){
                    node = node.firstChild;
                    while(node){
                        node.level = level + 1;
                        changeLevel(node);
                        node = node.next;
                    }
                }
            }

            if(!nodeFrom.prev) nodeFrom.parent.firstChild = nodeFrom.next;
            else nodeFrom.prev.next = nodeFrom.next;
            if(!nodeFrom.next) nodeFrom.parent.lastChild = nodeFrom.prev;
            else nodeFrom.next.prev = nodeFrom.prev;

            if(!nodeTo.prev) nodeTo.parent.firstChild = nodeFrom;
            else nodeTo.prev.next = nodeFrom;
            if(!nodeTo.next) nodeTo.parent.lastChild = nodeTo;
            nodeFrom.prev = nodeTo.prev;
            nodeFrom.next = nodeTo;
            nodeTo.prev = nodeFrom;


            if(nodeFrom.level != nodeTo.level){
                nodeFrom.parent.length = nodeFrom.parent.length - 1;
                nodeTo.parent.length = nodeTo.parent.length + 1;

                nodeFrom.level = nodeTo.level;
                changeLevel(nodeFrom)
            }
            nodeFrom.parent = nodeTo.parent;
        },
        toJSON: function(node){
            var cursor = node.firstChild,json = {
                index: node.index,
                data: node.data,
                children: []
            };
            while(cursor){
                json.children.push(this.toJSON(cursor));
                cursor = cursor.next;
            }

            return json;
        },
        toTree: function(json, node){
            if(!json) return null;
            var children = json.children || [], index;
            if(!root) root = IBTree.init(json.index, json.data); 
            node = node || root;
            index = parseInt(node.index);
            if(index > counter) counter = index;
            children.forEach((child) => {
                var index = child.index, data = child.data;
                if(child.children){
                    this.toTree(child, node.add(index, data))
                }
            })

            return root;
        }
    }
})();

export { NodeTree };
