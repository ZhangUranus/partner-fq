package org.ofbiz.practice;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import org.ofbiz.entity.GenericValue;

/**
 * 新增单据时，单据缓存,session 有效
 * 最大保存50单据缓存,当大于50单据后，按照先进先出替换
 * @author Mark
 *
 */
public class NewBillCache {

	/**
	 * 保存单据id
	 */
	private LinkedList<String> billIdList=new LinkedList<String>();
	
	/**
	 * 保存单据集合
	 */
	private Map<String ,Object> billValue=new HashMap<String, Object>(50);
	
	
	/**
	 * 根据单据id获取单据value
	 * @param billKey
	 * @return
	 */
	public Map<String,Object> getBillValue(String billKey){
		return (Map<String, Object>) billValue.get(billKey);
	}
	
	/**
	 * 添加单据到缓存
	 * @param billKey
	 * @param bill
	 * @return
	 */
	public void put(String billKey ,Map<String,Object> bill){
		billIdList.addFirst(billKey);
		billValue.put(billKey, bill);
	}
	
	/**
	 * 缓存中删除单据
	 * @param billKey
	 */
	public void remove(String billKey){
		billIdList.remove(billKey);
		billValue.remove(billKey);
	}
	/**
	 * 缓存是否有某单据
	 * @param billKey
	 * @return
	 */
	public boolean contain(String billKey){
		return billValue.containsKey(billKey);
	}
	
}
