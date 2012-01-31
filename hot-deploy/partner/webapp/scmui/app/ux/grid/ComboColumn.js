/**
 * @Purpose 用于Editor为combobox或者combogrid类型的列，解决无法正确获取展现值的问题
 * @author jeff-liu
 * @Date 2012-01-16
 */
Ext.define('SCM.ux.grid.ComboColumn', {
			extend : 'Ext.grid.Column',
			alias : ['widget.combocolumn'],
			gridId : undefined,
			constructor : function(cfg) {
				this.callParent(arguments);
				this.renderer = (this.editor) ? this.comboBoxRenderer(this.editor, this.gridId) : function(value) {
					return value;
				};
			},
			comboBoxRenderer : function(combo, gridId) {
				var getValue = function(value) {
					var idx = combo.store.find(combo.valueField, value);
					var rec = combo.store.getAt(idx);
					if (rec) {
						return rec.get(combo.displayField);
					}
					return value;
				}

				return function(value) {
					//如果store没有值，载入后重新刷新页面
					var loadCount = 0;
					if (combo.store && combo.store.getCount() == 0 && gridId && loadCount==0) {
						loadCount ++;
						combo.store.load({
									callback : function() {
										var grid = Ext.getCmp(gridId);
										if (grid) {
											grid.getView().refresh();
										}
									}
								});
						return value;
					}

					return getValue(value);
				}
			}
		});