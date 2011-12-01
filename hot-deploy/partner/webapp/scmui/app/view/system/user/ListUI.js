/*
 * 仓库列表界面
 * Mark
 */
Ext.define('SCM.view.system.user.ListUI' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.usermanagement',//对应菜单link

    title : '用户管理',
    
    store: 'system.UserStore',
    
    initComponent: function() {
        this.initColumns();
        this.initToolBar();
        this.callParent(arguments);
        this.store.load();
    },

	//初始化列
	initColumns: function(){
    	 this.columns = [
    	                 {header: '登录名',  dataIndex: 'userId', width:100},
    	                 {header: '用户名',  dataIndex: 'userName', width:100},
    	                 {header: '性别',  dataIndex: 'sex', renderer: Ext.partner.basiccode.sexRenderer, width:100},
    	                 {header: '部门',  dataIndex: 'departmentName', width:100},
    	                 {header: '职位',  dataIndex: 'position', width:100},
    	                 {header: '手机号码', dataIndex: 'phoneNumber', width:120},
    	                 {header: '邮箱', dataIndex: 'email', width:150},
    	                 {header: '是否有效', dataIndex: 'valid', renderer: Ext.partner.basiccode.validRenderer, width:100}
    	 ];
    },
    //初始化工具栏
    initToolBar: function(){
    	this.dockedItems=[
    	   {xtype:'toolbar',
    		items:[{text:'新增',cls:'x-btn-text-icon',icon:'/scmui/images/icons/add.png',action:'addNew'},
    		       {text:'修改',cls:'x-btn-text-icon',icon:'/scmui/images/icons/edit.png',action:'modify'},
    		       {text:'删除',cls:'x-btn-text-icon',icon:'/scmui/images/icons/delete.png',action:'delete'},
    		       {text:'刷新',cls:'x-btn-text-icon',icon:'/scmui/images/icons/refresh.png',action:'refresh'}
    		       ]}
    	];
    },
    //初始化数据缓存，定义数据格式
    initStore: function(){

    }
});
