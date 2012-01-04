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
                name:'username',
                id:'username',
                allowBlank: false,
                width:240
            },{
                xtype: 'textfield',
                fieldLabel: '密   码',
                allowBlank: false,
                blankText : '密码不能为空',
                name:'password',
                id:'password',
                width:240,
                inputType : 'password' 
            },{
		        xtype: 'label',
		        text: '用户：admin',
                style: {
		            color: 'red'
		        }
		    },{
                xtype: 'label',
                text: '密码：123',
                style: {
                    color: 'red'
                }
            }],
            buttons:[{
                text:'登录',
                handler:this.login
            }]
        })
        Ext.apply(this,{
            height: 160,
            width: 280,
            title: '用户登陆',
            closeAction: 'hide',
            closable : false, 
            iconCls: 'win',
            layout: 'fit',
            modal : true, 
            plain : true,
            resizable: false,
            items:form
        });
        var nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
            scope : this,
            enter : this.login
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
                                win.hide();
                                Ext.getCmp('main-tree').show();
                                Ext.getCmp('main-content').show();
                            },
                            failure: function(form, action) {
                                Ext.MessageBox.show({
                                    width:150,
                                    title:"登录失败",
                                    buttons: Ext.MessageBox.OK,
                                    msg:action.result.msg
                                })
                            }
                        });
                    }
                }
});