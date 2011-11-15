<script type="text/javascript">
    Ext.require(['*']);

    Ext.onReady(function() {

        Ext.QuickTips.init();
        Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));

        var viewport = Ext.create('Ext.Viewport', {
            id: 'border-example',
            layout: 'border',
            items: [
            Ext.create('Ext.Component', {
                region: 'north',
                height: 32, 
                autoEl: {
                    tag: 'div',
                    html:'<p><font size="4" color="blue">富桥实业有限公司</font></p>'
                }
            }), {
                region: 'west',
                stateId: 'navigation-panel',
                id: 'west-panel', // see Ext.getCmp() below
                title: '仓库管理系统',
                split: true,
                width: 200,
                minWidth: 175,
                maxWidth: 400,
                collapsible: true,
                animCollapse: true,
                margins: '0 0 0 5',
                layout: 'accordion',
                items: [{
                    contentEl: 'west',
                    title: '仓库管理',
                    iconCls: 'nav'
                }, {
                    title: '基础设置',
                    iconCls: 'settings'
                }, {
                    title: '系统管理',
                    iconCls: 'info'
                }]
            },
            Ext.create('Ext.tab.Panel', {
                region: 'center',
                deferredRender: false,
                activeTab: 0,
                items: [{
                    contentEl: 'center2',
                    title: 'Center Panel',
                    autoScroll: true
                }]
            })]
        });
        Ext.get("hideit").on('click', function(){
            var w = Ext.getCmp('west-panel');
            w.collapsed ? w.expand() : w.collapse();
        });
    });
    </script>
    <div id="west" class="x-hide-display">
    </div>
    <div id="center2" class="x-hide-display">
        
    </div>
    <div id="center1" class="x-hide-display">
        
    </div>
    <div id="props-panel" class="x-hide-display" style="width:200px;height:200px;overflow:hidden;">
    </div>
    <div id="south" class="x-hide-display">
        
    </div>