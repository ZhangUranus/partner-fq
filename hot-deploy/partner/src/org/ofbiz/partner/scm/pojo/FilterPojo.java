package org.ofbiz.partner.scm.pojo;

public class FilterPojo {
	private String property;
	private String value;

	public String getProperty() {
		return property;
	}

	public void setProperty(String property) {
		this.property = property;
	}
	
	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String toString() {
		return "FilterPojo [property=" + property + ", value=" + value + "]";
	}
}
