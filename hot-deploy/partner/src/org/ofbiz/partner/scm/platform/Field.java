package org.ofbiz.partner.scm.platform;

import java.util.HashMap;
import java.util.Map;

/**
 * 字段类型是string,int,float,date,boolean,entity
 * 字段类，记录一个字段的配置信息
 * @author Mark
 *
 */
public class Field {

	//字段名称，英文
	private String name ="name";
	
	//字段别名，中文 ，
	private String alias="alias";
	
	//字段类型默认字符串
	private String fieldType="string";
	
	//是否在列表显示
	private boolean isListVisible=true;
	//是否在编辑界面可见
	private boolean isHidden=false;
	//是否在编辑界面可以编辑
	private boolean isEditable=true;
	//是否保存到数据库
	private boolean isPersis=true;
	
	//当字段类型是entity时，该字段记录关联的实体名称
	private String relatedEntity=null;
	
	private Map<String, String> propertiesMap=new HashMap<String, String>();
	public Field(String name) {
		super();
		initField(name,name,"string",null);
	}

	public Field(String name, String alias) {
		super();
		this.initField(name, alias, "string",null);
	}

	public Field(String name, String alias, String fieldType) {
		super();
		this.initField(name, alias, fieldType,null);
	}
	public Field(String name, String alias, String fieldType,String relatedEntity) {
		super();
		this.initField(name, alias, fieldType,relatedEntity);
	}
	private void initField(String name, String alias, String fieldType,String relatedEntity){
		this.name = name;
		this.alias = alias;
		this.fieldType=fieldType;
		this.relatedEntity=relatedEntity;
		propertiesMap.put("name", this.name);
		propertiesMap.put("alias", this.alias);
		propertiesMap.put("type", this.fieldType);
		propertiesMap.put("isListVisible", String.valueOf(this.isListVisible));
		propertiesMap.put("isHidden", String.valueOf(this.isHidden));
		propertiesMap.put("isEditable", String.valueOf(this.isEditable));
		propertiesMap.put("isPersis", String.valueOf(this.isPersis));
		propertiesMap.put("entity", this.relatedEntity);
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
		propertiesMap.put("name", this.name);
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
		propertiesMap.put("alias", this.alias);
	}

	public String getFieldType() {
		return fieldType;
	}

	public void setFieldType(String fieldType) {
		this.fieldType = fieldType;
		propertiesMap.put("type", this.fieldType);
	}

	public boolean isListVisible() {
		return isListVisible;
	}

	public void setListVisible(boolean isListVisible) {
		this.isListVisible = isListVisible;
		propertiesMap.put("isListVisible", String.valueOf(this.isListVisible));
	}

	public boolean isHidden() {
		return isHidden;
	}

	public void setHidden(boolean isHidden) {
		this.isHidden = isHidden;
		propertiesMap.put("isHidden", String.valueOf(this.isHidden));
	}

	public boolean isEditable() {
		return isEditable;
	}

	public void setEditable(boolean isEditable) {
		this.isEditable = isEditable;
		propertiesMap.put("isEditable", String.valueOf(this.isEditable));
	}

	public boolean isPersis() {
		return isPersis;
	}

	public void setPersis(boolean isPersis) {
		this.isPersis = isPersis;
		propertiesMap.put("isPersis", String.valueOf(this.isPersis));
	}
	
	public Map<String, String> getMap(){
		return this.propertiesMap;
	}

	public String getRelatedEntity() {
		return relatedEntity;
	}

	public void setRelatedEntity(String relatedEntity) {
		this.relatedEntity = relatedEntity;
	}
	
}
