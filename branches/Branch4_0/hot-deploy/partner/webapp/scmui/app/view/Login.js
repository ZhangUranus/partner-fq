Ext.define('SCM.view.Login',{
    extend:'Ext.window.Window',
    alias: 'widget.loginForm',
    requires: ['Ext.form.*'],
    id : 'login-window',
    initComponent:function(){
        var form = Ext.widget('form',{
            id : 'login-form',
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'left',
                labelWidth: 55,
                labelStyle: 'font-weight:bold'
            },
            defaults: {
                margins: '0 0 10 0'
            },
            items:[{
                xtype: 'textfield',
                fieldLabel: '用户名',
                blankText : '用户名不能为空',
                name:'USERNAME',
                id:'USERNAME',
                allowBlank: false,
                width:240
            },{
                xtype: 'textfield',
                fieldLabel: '密   码',
                allowBlank: false,
                blankText : '密码不能为空',
                name:'PASSWORD',
                id:'PASSWORD',
                width:240,
                inputType : 'password' 
            }],
            buttons:[{
                text:'登录',
                handler:this.login
            }]
        })
        Ext.apply(this,{
            height: 132,
            width: 280,
            title: '用户登陆',
            closeAction: 'hide',
            closable : false, 
            iconCls: 'tree-user',
            layout: 'fit',
            modal : true, 
            plain : true,
            resizable: false,
            items:form
        });
        
        this.callParent(arguments);
    },
    login : function(){
                    var form = Ext.getCmp('login-form').getForm();
                    var win = Ext.getCmp('login-window');
                    if(form.isValid()){
                        form.submit({
                            clientValidation: true,
                            waitMsg:'请稍后',
                            waitTitle:'正在验证登录',
                            url:'../scm/control/checkLogin',
                            success: function(form, action) {
                            	Ext.getCmp("current-user-label").setText(action.result.currentUser.userName);
                            	Ext.getCmp("current-date-label").setText(action.result.currentYear+"年"+action.result.currentMonth+"月");
                                SCM.SystemMonthlyYear = action.result.currentYear;
	                			SCM.SystemMonthlyMonth = action.result.currentMonth;
	                			SCM.CurrentUser = action.result.currentUser;
                                win.hide();
                                Ext.getCmp('main-tree').show();
                                Ext.getCmp('main-content').show();
                            },
                            failure: function(form, action) {
                            	Ext.getCmp("current-user-label").setText("未登录");
                            	var result = Ext.decode(action.response.responseText)
                				showError(result.message);
                            }
                        });
                    }
                }
});