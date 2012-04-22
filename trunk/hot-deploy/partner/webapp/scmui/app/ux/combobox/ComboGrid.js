/**
 * @Purpose 下拉表格控件
 * @author jeff-liu
 * @Date 2012-01-16
 */
Ext.define('SCM.ux.combobox.ComboGrid', {
			extend : 'Ext.form.ComboBox',
			requires : ['SCM.ux.combobox.BoundGrid', 'SCM.ux.combobox.BoundGridKeyNav'],
			alias : ['widget.combogrid'],
			queryMode : 'remote',
			minChars : 1,
			typeAhead : true,
			forceSelection : true,
			autoSelect : true,//暂时没有实现自动选中功能该值不允许为true;

			/**
			 * @private
			 * If the autoSelect config is true, and the picker is open, highlights the first item.
			 */
			doAutoSelect : function() {
				var me = this, picker = me.picker, lastSelected, itemNode;
				if (picker && me.autoSelect && me.store.getCount() > 0) {
					// Highlight the last selected item and scroll it into view
					lastSelected = picker.getSelectionModel().lastSelected;
					itemNode = picker.getNode(lastSelected || 0);
					if (itemNode) {
						picker.highlightItem(itemNode);
						//picker.listEl.scrollChildIntoView(itemNode, false);	//暂时没有实现自动选中功能
					}
				}
			},

			// copied from ComboBox 
			createPicker : function() {
				var me = this, picker, menuCls = Ext.baseCSSPrefix + 'menu', opts = Ext.apply({
							selModel : {
								mode : me.multiSelect ? 'SIMPLE' : 'SINGLE'
							},
							floating : true,
							hidden : true,
							ownerCt : me.ownerCt,
							cls : me.el.up('.' + menuCls) ? menuCls : '',
							store : me.store,
							displayField : me.displayField,
							focusOnToFront : false,
							pageSize : me.pageSize
						}, me.listConfig, me.defaultListConfig);

				picker = me.picker = Ext.create('SCM.ux.combobox.BoundGrid', opts);

				me.mon(picker, {
							itemclick : me.onItemClick,
							refresh : me.onListRefresh,
							scope : me
						});

				me.mon(picker.getSelectionModel(), {
							selectionChange : me.onListSelectionChange,
							scope : me
						});

				return picker;
			},

			onExpand : function() {
				var me = this, keyNav = me.listKeyNav, selectOnTab = me.selectOnTab, picker = me.getPicker();

				if (keyNav) {
					keyNav.enable();
				} else {
					keyNav = me.listKeyNav = Ext.create('SCM.ux.combobox.BoundGridKeyNav', this.inputEl, {
								boundList : picker,
								forceKeyDown : true,
								tab : function(e) {
									if (selectOnTab) {
										this.selectHighlighted(e);
										me.triggerBlur();
									}

									return true;
								}
							});
				}

				if (selectOnTab) {
					me.ignoreMonitorTab = true;
				}

				Ext.defer(keyNav.enable, 1, keyNav);
				me.inputEl.focus();
			}
		});