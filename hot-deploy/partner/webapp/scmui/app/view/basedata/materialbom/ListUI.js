/*
 * 定义物料Bom列表界面
 * Mark
 */
Ext.define('SCM.view.basedata.materialbom.ListUI' ,{
    extend: 'Ext.container.Container',
    alias : 'widget.bombillinfomaintaince',

    title : '物料BOM',
	height: 497,
    width: 718,
    layout: {
        type: 'border'
    },

    initComponent: function() {
        var me = this;
	    var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
			groupHeaderTpl: 'BOM编码:{name}  (分录数量 {rows.length})',
			groupByText : '用本字段分组',   
			showGroupsText : '显示分组',    
			startCollapsed: false //设置初始分组是否收起  
		});
        Ext.applyIf(me, {
            items: [
                {
                   xtype:'toolbar',//工具栏
    				items:[
				   {text:'新增',cls:'x-btn-text-icon',icon:'/scmui/images/icons/add.png',action:'addNew'},
    		       {text:'修改',cls:'x-btn-text-icon',icon:'/scmui/images/icons/edit.png',action:'modify'},
    		       {text:'删除',cls:'x-btn-text-icon',icon:'/scmui/images/icons/delete.png',action:'delete'},
    		       {text:'刷新',cls:'x-btn-text-icon',icon:'/scmui/images/icons/refresh.png',action:'refresh'}],
					region:'north'
                },
                {
                    xtype: 'gridpanel',
                    title: '',
                    region: 'center',
					store:'basedata.MaterialBomStore',
					features: [groupingFeature],
                    columns: [
						{
                            xtype: 'gridcolumn',
                            dataIndex: 'id',
                            text: 'id',
							hidden:true
                        },
						{
                            xtype: 'gridcolumn',
                            dataIndex: 'number',
							width:150,
                            text: 'BOM编码'
                        },
						{
                            xtype: 'gridcolumn',
                            dataIndex: 'materialName',
							width:150,
							groupable: false,
                            text: '物料名称'
                        },
						{
                            xtype: 'gridcolumn',
                            dataIndex: 'bomMaterialNum',
							width:150,
							groupable: false,
                            text: 'BOM物料名称'
                        },
						{
                            xtype: 'gridcolumn',
                            dataIndex: 'bomMaterialModel',
							width:150,
							groupable: false,
                            text: 'BOM物料规格型号'
                        },
						{
                            xtype: 'numbercolumn',
                            dataIndex: 'volume',
							groupable: false,
                            text: '数量'
                        },
						{
                            xtype: 'gridcolumn',
                            dataIndex: 'unitName',
							groupable: false,
                            text: '计量单位'
                        }
							
                    ],
                    viewConfig: {

                    }
                }
            ]
        });
        me.callParent(arguments);

		me.down('gridpanel').store.load();
    }
});
