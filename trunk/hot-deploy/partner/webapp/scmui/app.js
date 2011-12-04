/**
 * @Purpose 系统框架类
 * @author jeff-liu
 * @Date 2011-11-24
 */
Ext.Loader.setConfig({enabled : true});
Ext.application({
    name : 'SCM',
    appFolder : 'app',
    controllers : [// 载入系统controller
        'Main', 
        'basedata.UnitController', 
        'basedata.WarehouseTypeController', 
        'basedata.WarehouseController', 
        'basedata.CustomerController', 
		'basedata.DepartmentController',
        'system.SystemController'
    ],
    launch : function() {
        var viewport = Ext.create('SCM.view.Viewport');
        viewport.doLayout(); // 刷新布局
    }
});