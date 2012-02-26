Ext.define('SCM.controller.${TemplateName}.${TemplateName}Controller', {
    extend: 'Ext.app.Controller',
    
	views: [
        '${TemplateName}.ListUI',
        '${TemplateName}.EditUI'
    ],
    stores:[
        '${TemplateName}.${TemplateName}Store'
    	,'${TemplateName}.${TemplateName}EditStore'
    ],
	
    /**
     * 初始化controller
     * 增加事件监控
     */
    init: function() {
		this.control({
	        '${TemplateName}list': {
	        	afterrender: this.initComponent,		//在界面完成初始化后调用
	    		itemdblclick: this.modifyRecord,		//双击列表，弹出编辑界面
                itemclick: this.changeComponentsState	//点击列表，改变修改、删除按钮状态
	        },
	        //列表新增按钮
	        '${TemplateName}list button[action=addNew]':{
	        	click: this.addNewRecord
	        },
	        //列表修改按钮
	        '${TemplateName}list button[action=modify]':{
	        	click: this.editRecord
	        },
	        //列表删除按钮
	        '${TemplateName}list button[action=delete]':{
	        	click: this.deleteRecord
	        },
	        //列表刷新按钮
	        '${TemplateName}list button[action=search]':{
	        	click: this.refreshRecord
	        },
	        //列表界面导出按钮
	        '${TemplateName}list button[action=export]':{
	        	click: this.exportExcel
	        },
	        //编辑界面保存
	        '${TemplateName}edit button[action=save]':{
	        	click: this.saveRecord
	        },
	        //监听各field值变动事件，只监听可见控件
	        '${TemplateName}edit form textfield{isVisible()}':{
                change: this.fieldChange
            }
            #foreach($headfield in $HeadFields)
			#if($headfield.isHidden==false&&$headfield.type=='entity')//\n
			//编辑界面${headfield.alias}字段选择界面确定
			,'#${TemplateName}form-${headfield.name}${headfield.entity}Id-selWin button[name=btnSure]':{
				click: this.select${headfield.name}${headfield.entity}
			}
			//编辑界面${headfield.alias}字段选择界面取消
			,'#${TemplateName}form-${headfield.name}${headfield.entity}Id-selWin button[name=btnCancel]':{
				click: cancelSelWin
			}
			#end
			#end
	    });
    },
    
    /**
     * 页面初始化方法
     * @param {} grid 事件触发控件
     */
    initComponent: function(grid){
        this.listPanel = grid;
        this.newButton = grid.down('button[action=addNew]');
        this.deleteButton = grid.down('button[action=delete]');
        this.editButton = grid.down('button[action=modify]');
        this.searchText = grid.down('textfield[id=keyWord]');
        this.init${TemplateName}edit();
        this.editForm = this.win.down('form');
        this.fields = this.editForm.query("{isVisible()}");			//取所以显示的field
        this.saveButton = this.win.down('button[action=save]');
        this.searchText.focus(true,true);			//设置界面初始焦点到搜索输入框
        this.listPanel.store.proxy.addListener('afterrequest',this.afterRequest,this);		//监听所有请求回调
        this.initButtonByPermission();
        this.changeComponentsState();
        var pageMap = new Ext.util.KeyMap(Ext.getDoc(), [//当前页面注册确定按钮事件
        	{
        		scope : this,
		        key: Ext.EventObject.ENTER,
		        fn: this.clickEnter
		    }
		]);
		var searchMap = new Ext.util.KeyMap(this.searchText.getEl(), [//搜索框需要单独注册确定按钮事件
        	{
        		scope : this,
		        key: Ext.EventObject.ENTER,
		        fn: this.clickEnter
		    }
		]);
    },
    
    /**
     * 初始化编辑框
     * 只初始化一次，关闭时候隐藏
     */
    init${TemplateName}edit: function(){
        if(!this.win){
            this.win = Ext.widget('${TemplateName}edit');
        }
    },
    
    /**
     * 捕捉提交后台的回调函数
     * @param {} request.action : read,create,update,destroy
     * @param {} success : true,false
     */
    afterRequest: function(request,success){
    	if(success && request.operation.success){
	    	if(request.action=='read'){
	    		
	    	}else if(request.action=='create'){
	    		this.refreshRecord();
	    	}else if(request.action=='update'){
	    		this.refreshRecord();
	    	}else if(request.action=='destroy'){
	    	}
	    	if(this.win.isVisible()){
	    		this.win.close();
	    	}
    	}else{
			//不需要处理，由服务器抛出异常即可
    	}
    },
    
    /**
     * 根据用户权限初始化按钮状态
     * 
     */
	initButtonByPermission: function(){
        if(this.listPanel.permission.add){
            this.newButton.setVisible(true);
        }else{
            this.newButton.setVisible(false);
        }
        if(this.listPanel.permission.edit ){
            this.editButton.setVisible(true);
        }else{
            this.editButton.setVisible(false);
        }
        if(this.listPanel.permission.remove ){
            this.deleteButton.setVisible(true);
        }else{
            this.deleteButton.setVisible(false);
        }
        
        
    },
    
    /**
     * 用户操作触发改变界面控件状态
     * 如：选中记录
     */
	changeComponentsState: function(){
        if(this.listPanel.getSelectionModel().hasSelection()){
            this.deleteButton.setDisabled(false);
            this.editButton.setDisabled(false);
        }else{
            this.deleteButton.setDisabled(true);
            this.editButton.setDisabled(true);
        }
        if(this.win.uiStatus=='AddNew'){
            this.saveButton.setVisible(true);
        }else{
            if(this.listPanel.permission.edit){
                this.saveButton.setVisible(true);
                Ext.each(this.fields,
                	function(item,index,length){
                		item.setReadOnly(false);
                	}
                )
            }else{
                this.saveButton.setVisible(false);
                Ext.each(this.fields,
                	function(item,index,length){
                		item.setReadOnly(true);
                	}
                )
            }
        }
    },
    
    /**
     * 页面Enter键事件捕捉
     */
    clickEnter: function(){
    	if(this.win.isVisible()){
    		this.saveRecord();
    	}else{
    		this.refreshRecord();
    	}
    },
    
    /**
     * 捕捉field控件的change事件，设置form的修改状态
     * @param {} textField	当前控件
     * @param {} newValue	新值
     * @param {} oldValue	旧值
     */
    fieldChange: function(textField,newValue,oldValue){
        if(this.win.inited && !this.win.modifyed){
            this.win.modifyed = true;
        }
    },
    
    /**
     * 弹出编辑框事件
     */
    showEdit: function(){
        this.win.show();
        this.changeComponentsState();
        this.win.inited = true;
        this.fields[0].focus(true,true);
    },
    
    /**
     * 编辑事件
     * @param {} grid	当前表格
     * @param {} record	选中记录
     */
    modifyRecord: function(grid, record){
        this.win.uiStatus='Modify';
    	this.editForm.loadRecord(record);
        this.showEdit();
    },
    
    /**
     * 点击修改按钮
     * @param {} button	按钮控件
     */
    editRecord: function(button){
    	sm=this.listPanel.getSelectionModel();
    	if(sm.hasSelection()){//判断是否选择行记录
    		record=sm.getLastSelected();
    		this.modifyRecord(this.listPanel,record);
    	}
    },
    /**
     * 点击新增按钮
     * @param {} button 按钮控件
     */
    addNewRecord: function(button){
    	newRecord=Ext.create('${TemplateName}EditModel');//新增记录
		newRecord.phantom = true;
    	this.win.uiStatus='AddNew';
    	this.editForm.loadRecord(newRecord);
    	this.showEdit();
    },
  	/**
  	 * 点击删除按钮
  	 * @param {} button	按钮控件
  	 */
    deleteRecord: function(button){
    	sm=this.listPanel.getSelectionModel();
    	if(sm.hasSelection()){//判断是否选择行记录
    		//删除选择的记录
    		records=sm.getSelection();
            Ext.Msg.confirm('提示','确定删除该记录？',confirmChange,this);
            function confirmChange(id){
                if(id=='yes'){
                    this.listPanel.store.remove(records);
                    Ext.Msg.alert("提示","删除成功");
                }
            }
    	}
    },
    /**
     * 刷新页面数据
     * @param {} button	刷新按钮
     */
    refreshRecord: function(button){
    	if(this.searchText.getValue()){
    		this.listPanel.store.getProxy().extraParams.whereStr = 'name like \'%'+this.searchText.getValue()+'%\'';
    	}else{
    		this.listPanel.store.getProxy().extraParams.whereStr = '';
    	}
    	this.listPanel.store.load();
    	this.changeComponentsState();
    },
    
    /**
     * 保存事件
     * @param {} button	保存按钮
     */
    saveRecord: function(button){
    	values=this.editForm.getValues();
    	if(!this.isValidate()){
    		return ;
    	}
    	if(this.win.uiStatus=='Modify' && !this.win.modifyed){//用户未做任何修改，直接关闭编辑框
    		this.win.close();
    		return ;
    	}
    	var record;
		if(this.win.uiStatus=='Modify'){//修改记录
		    record=this.editForm.getRecord();
		    record.set(values);
		}else if(this.win.uiStatus=='AddNew'){//新增记录
		    record=Ext.create('${TemplateName}EditModel');
			record.phantom = true;
		    record.set(values);
		    if(this.listPanel.store.indexOf(this.oldRecord) != -1){//避免重复添加
		    	this.listPanel.store.remove(this.oldRecord);
		    }
		    this.oldRecord = record;	
		    this.listPanel.store.add(record);
		    
		}
		this.changeComponentsState();
    },
    
    /**
     * 校验form所有field的输入值是否有效
     * @return true 有效,false 无效
     */
    isValidate: function(){
    	var valid = true;
    	Ext.each(this.fields,
    		function(item,index,length){
    			if(!item.isValid()){
    				valid = false;
    			}
    		}
    	)
    	return valid;
    },
    getParams: function(){
    	var tempheader = this.listPanel.headerCt.query('{isVisible()}');
    	var header = "";
    	var dataIndex = "";
    	Ext.each(tempheader,
    		function(column,index,length){
    			if(index!=0){
    				header +=",";
    				dataIndex +=",";
    			}
    			header += column.text;
    			dataIndex += column.dataIndex;
    		}
    	)
    	with(this.listPanel.store){
	    	var params  = {
	    		//Store参数
	    		limit: pageSize,
	    		page: currentPage,
	    		start: (currentPage - 1) * pageSize,
	    		sort: Ext.encode(getSorters()),
	    		filter : Ext.encode(filters.items),
	    		
	    		//页面参数
	    		entity: '${TemplateName}',				//导出实体名称，一般为视图名称。
		        title : '${TemplateName}',			//sheet页名称
		        header : header,			//表头
		        dataIndex : dataIndex,		//数据引用
		        type : 'EXCEL',
		        whereStr : getProxy().extraParams.whereStr
	    	}
	    	return params ;
    	}
    	
    },
    
    /**
     * 导出表格数据
     */
    exportExcel: function(){
    	Ext.Ajax.request({
            url:'../scm/control/export',
            params: this.getParams(),
		    
            success : function(response , option) {
            	var result = Ext.decode(response.responseText);
            	if(result.success){
	            	window.location.href = '../scm/control/download?type=EXCEL&filename='+result.filename;
            	}else{
            		Ext.Msg.alert("错误",result.message);
            	}
            }
        });
    	
    }
    #foreach($headfield in $HeadFields)
	#if($headfield.isHidden==false&&$headfield.type=='entity')//\n
	//表头${headfield.alias}选择框保存
	,select${headfield.name}${headfield.entity}:function(button){
		var edit=this.get${TemplateName}edit();
		var form=edit.down('form');
		selectValwin(button,'${headfield.name}${headfield.entity}Id',form);
	}
	#end
	#end//\n
});