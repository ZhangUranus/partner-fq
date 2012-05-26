/**
 * @Purpose 树形model类
 * @author jeff-liu
 * @Date 2011-11-26
 */
Ext.define('SCM.model.MenuModel', {
	extend : 'Ext.data.Model',
	fields : [
        {name: 'text',   type: 'string'},
        {name: 'hyperlink', type: 'string', defaultValue: ''}
    ]
});