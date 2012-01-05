/**
 * @Purpose 树形model类
 * @author jeff-liu
 * @Date 2011-11-26
 */
Ext.define('SCM.model.system.UserTreeModel', {
    extend : 'Ext.data.Model',
    alias:'UserTreeModel',
    fields : [
        {name: 'id',   type: 'string'},
        {name: 'text',   type: 'string'},
        {name: 'iconCls',   type: 'string'},
        {name: 'leaf',   type: 'boolean', defaultValue: true},
        {name: 'isUser',   type: 'boolean', defaultValue: true}
    ],
    
    proxy: {
        type: 'jsonajax',
        api: {
            read: '../../scm/control/getUserTreeToJson'
        },
        reader: {
			root: 'children'
		}
    }
});