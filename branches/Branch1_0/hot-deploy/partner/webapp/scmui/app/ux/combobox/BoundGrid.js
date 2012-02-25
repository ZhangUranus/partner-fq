/**
 * @Purpose 下拉表格
 * @author jeff-liu
 * @Date 2012-01-16
 */
Ext.define('SCM.ux.combobox.BoundGrid', {
			extend : 'Ext.grid.Panel',

			initComponent : function() {
				var me = this;
				me.callParent();
				me.all = me.getView().all;
				me.indexOf = me.getView().indexOf;
			},
			/**
			 * Highlights a given item in the DataView. This is called by the
			 * mouseover handler if {@link #overItemCls} and {@link #trackOver}
			 * are configured, but can also be called manually by other code,
			 * for instance to handle stepping through the list via keyboard
			 * navigation.
			 * 
			 * @param {HTMLElement}
			 *            item The item to highlight
			 */

			highlightItem : function(item) {
				var me = this;
				me.clearHighlight();
				me.highlightedItem = item;
				Ext.fly(item).addCls(me.overItemCls);
			},

			/**
			 * Un-highlights the currently highlighted item, if any.
			 */
			clearHighlight : function() {
				var me = this, highlighted = me.highlightedItem;

				if (highlighted) {
					Ext.fly(highlighted).removeCls(me.overItemCls);
					delete me.highlightedItem;
				}
			},

			refresh : function() {
				var me = this;
				me.clearHighlight();
				me.callParent(arguments);
				if (!me.isFixedHeight()) {
					me.doComponentLayout();
				}
			},
			getNode : function(record) {
				var me = this;
				return me.getView().getNode(record);
			}

		});