Ext.define('SCM.ux.combobox.BoundGridKeyNav', {
    extend: 'Ext.util.KeyNav',
    requires: 'SCM.ux.combobox.BoundGrid',

    

    constructor: function(el, config) {
        var me = this;
        me.boundList = config.boundList;
        me.callParent([el, Ext.apply({}, config, me.defaultHandlers)]);
    },

    defaultHandlers: {
        up: function() {
//            var me = this,
//                boundList = me.boundList,
//                allItems = boundList.all,
//                oldItem = boundList.highlightedItem,
//                oldItemIdx = oldItem ? boundList.indexOf(oldItem) : -1,
//                newItemIdx = oldItemIdx > 0 ? oldItemIdx - 1 : allItems.getCount() - 1; 
//            me.highlightAt(newItemIdx);
        },

        down: function() {
//            var me = this,
//                boundList = me.boundList,
//                allItems = boundList.all,
//                oldItem = boundList.highlightedItem,
//                oldItemIdx = oldItem ? boundList.indexOf(oldItem) : -1,
//                newItemIdx = oldItemIdx < allItems.getCount() - 1 ? oldItemIdx + 1 : 0; 
//            me.highlightAt(newItemIdx);
        },

        pageup: function() {
            
        },

        pagedown: function() {
            
        },

        home: function() {
//            this.highlightAt(0);
        },

        end: function() {
//            var me = this;
//            me.highlightAt(me.boundList.all.getCount() - 1);
        },

        enter: function(e) {
//            this.selectHighlighted(e);
        }
    },

    
    highlightAt: function(index) {
//        var boundList = this.boundList,
//            item = boundList.all.item(index);
//        if (item) {
//            item = item.dom;
//            boundList.highlightItem(item);
//            boundList.getTargetEl().scrollChildIntoView(item, false);
//        }
    },

    
    selectHighlighted: function(e) {
//        var me = this,
//            boundList = me.boundList,
//            highlighted = boundList.highlightedItem,
//            selModel = boundList.getSelectionModel();
//        if (highlighted) {
//            selModel.selectWithEvent(boundList.getRecord(highlighted), e);
//        }
    }

});