Ext.define('SCM.view.Tree',{
    extend: 'Ext.tree.Panel',
    alias: 'widget.treePanel',
    margins : '0 0 -1 1',
    border : false,
    enableDD : false,
    split: true,
    width : 212,
    minSize : 130,
    maxSize : 300,
    rootVisible: false,
    autoScroll: false,
    store : {
	    model : 'SCM.model.Children',
	    root: { 
	        expanded: true 
	    }
	},
    initComponent : function(){
        this.callParent(arguments);
    }
})