const { nanoid } = require("nanoid");

class Node {
    constructor(data, address, depth) {
        this.data = data;
        this.children = [];
        this.address = address;
        this.depth = depth
    }

    setChild(data, address, depth) {
        let node = new Node(data,address,depth)
        this.children[address[address.length -1]] = node
        return node   
    }
}

class Tree {
    constructor(data) {
        this.root = data? new Node(data, [0], 0) : null
    }

    insertNode(data, address, depth) {
        if (this.root == null) {
            this.root = new Node(data, address, depth)
            return
        } 
        let currentNode = this.root;
        for (let i=1; i< depth; i++) 
            currentNode = currentNode.children[address[i]]
        currentNode.setChild(data, address,depth)
    }

    getTree() {
        return this.root
    }
}

module.exports = {
    Node,
    Tree
};
