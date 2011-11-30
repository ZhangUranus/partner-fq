/*
 * 定义列表界面
 * Mark
 */
Ext.define('SCM.view.basedata.customer.ListUI' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.custinfomaintaince',

    title : '客户资料',
    
    store: 'basedata.CustomerStore',
    
    initComponent: function() {
        this.initColumns();
        this.initToolBar();
        //this.initStore();
        this.callParent(arguments);
        this.store.load();
    },

	//初始化列
	initColumns: function(){
    	 this.columns = [
    	                 {header: 'id',  dataIndex: 'id', width:200,hidden:true},
    	                 {header: '编码',  dataIndex: 'number', width:200},
    	                 {header: '名称', dataIndex: 'name', width:200},
    	                 {header: '地址', dataIndex: 'address', width:200},
    	                 {header: '联系人', dataIndex: 'contact', width:200},
    	                 {header: '电话', dataIndex: 'phone', width:200},
    	                 {header: '传真', dataIndex: 'fax', width:200},
    	                 {header: '邮政编码', dataIndex: 'postCode', width:200}
    	 ];
    },
    //初始化工具栏
    initToolBar: function(){
    	this.dockedItems=[
    	   {xtype:'toolbar',
    		items:[{text:'新增',cls:'x-btn-text-icon',icon:'/scmui/images/icons/add.png',action:'addNew'},
    		       {text:'修改',cls:'x-btn-text-icon',icon:'/scmui/images/icons/edit.png',action:'modify'},
    		       {text:'删除',cls:'x-btn-text-icon',icon:'/scmui/images/icons/delete.png',action:'delete'},
    		       {text:'刷新',cls:'x-btn-text-icon',icon:'/scmui/images/icons/refresh.png',action:'refresh'},
    		       '->',{xtype:'textfield'},{text:'查询'}]}
    	];
    },
    //初始化数据
    initStore: function(){
    	
    }
});
