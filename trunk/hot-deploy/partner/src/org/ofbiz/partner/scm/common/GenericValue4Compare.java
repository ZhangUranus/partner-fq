package org.ofbiz.partner.scm.common;

import java.sql.Timestamp;
import java.util.Date;

import org.ofbiz.entity.GenericValue;

/**
 * 
 * 封装GenericValue 可以进行日期对比
 * @author mark
 *
 */
public class GenericValue4Compare implements Comparable<GenericValue4Compare>{

	/**
	 * 
	 */
	private static final long serialVersionUID = 3976257052042981611L;

	private GenericValue value;
	
	private String compareField;

	public GenericValue4Compare(GenericValue value ,String compareField) throws Exception {
		super();
		if(value==null||compareField==null){
			throw new Exception("arguments is null");
		}
		if(value.get(compareField)==null||!(value.get(compareField) instanceof Date)){
			throw new Exception("compare value is error");
		}
		this.compareField = compareField;
		this.value = value;
	}

	public int compareTo(GenericValue4Compare o) {
		if(o!=null&&o.getCompareDate()!=null){
			return getCompareDate().compareTo(o.getCompareDate());
		}
		return -1;
	}

	public Timestamp getCompareDate(){
		return value.getTimestamp(compareField);
	}
	
	public GenericValue getValue(){
		return value;
	}
}
