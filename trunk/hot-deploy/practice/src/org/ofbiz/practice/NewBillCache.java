package org.ofbiz.practice;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import org.ofbiz.entity.GenericValue;

/**
 * ��������ʱ�����ݻ���,session ��Ч
 * ��󱣴�50���ݻ���,������50���ݺ󣬰����Ƚ��ȳ��滻
 * @author Mark
 *
 */
public class NewBillCache {

	/**
	 * ���浥��id
	 */
	private LinkedList<String> billIdList=new LinkedList<String>();
	
	/**
	 * ���浥�ݼ���
	 */
	private Map<String ,Object> billValue=new HashMap<String, Object>(50);
	
	
	/**
	 * ���ݵ���id��ȡ����value
	 * @param billKey
	 * @return
	 */
	public Map<String,Object> getBillValue(String billKey){
		return (Map<String, Object>) billValue.get(billKey);
	}
	
	/**
	 * ��ӵ��ݵ�����
	 * @param billKey
	 * @param bill
	 * @return
	 */
	public void put(String billKey ,Map<String,Object> bill){
		billIdList.addFirst(billKey);
		billValue.put(billKey, bill);
	}
	
	/**
	 * ������ɾ������
	 * @param billKey
	 */
	public void remove(String billKey){
		billIdList.remove(billKey);
		billValue.remove(billKey);
	}
	/**
	 * �����Ƿ���ĳ����
	 * @param billKey
	 * @return
	 */
	public boolean contain(String billKey){
		return billValue.containsKey(billKey);
	}
	
}
