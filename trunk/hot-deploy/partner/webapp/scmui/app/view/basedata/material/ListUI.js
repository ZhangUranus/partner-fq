/*
 * 定义物料列表界面
 * Mark
 */
Ext.define('SCM.view.basedata.material.ListUI' ,{
    extend: 'Ext.container.Container',
    alias : 'widget.materialinfomaintaince',

    title : '物料',
	height: 497,
    width: 718,
    layout: {
        type: 'border'
    },

    initComponent: function() {
        var me = this;

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
                    xtype: 'treepanel',
                    width: 180,
                    title: '',
                    region: 'west',
					rootVisible: false,
                    split: true,
					store:'basedata.MaterialTypeTreeStore',
                    viewConfig: {

                    }
                },
                {
                    xtype: 'gridpanel',
                    title: '',
                    region: 'center',
					store:'basedata.MaterialStore',
                    columns: [
						{
                            xtype: 'gridcolumn',
                            dataIndex: 'materialTypeId',
                            text: 'id',
							hidden:true
                        },
						{
                            xtype: 'gridcolumn',
                            dataIndex: 'materialTypeName',
                            text: '物料类别'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'id',
                            text: 'id',
							hidden:true
                        },
						{
                            xtype: 'gridcolumn',
                            dataIndex: 'number',
                            text: '编码'
                        },
						{
                            xtype: 'gridcolumn',
                            dataIndex: 'name',
                            text: '名称'
                        },
						{
                            xtype: 'gridcolumn',
                            dataIndex: 'model',
                            text: '规格型号'
                        },
                        {
                            xtype: 'numbercolumn',
                            dataIndex: 'defaultPrice',
                            text: '默认单价'
                        },
						{
                            xtype: 'gridcolumn',
                            dataIndex: 'defaultSupplier',
                            text: '默认供应商'
                        },
						{
                            xtype: 'numbercolumn',
                            dataIndex: 'safeStock',
                            text: '安全库存'
                        },
						{
                            xtype: 'gridcolumn',
                            dataIndex: 'defaultUnitId',
                            text: '默认计量单位id',
							hidden:true
                        },
						{
                            xtype: 'gridcolumn',
                            dataIndex: 'defaultUnitName',
                            text: '默认计量单位'
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
