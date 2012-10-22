package org.ofbiz.partner.scm.pojo;

public class FilterPojo {
	private String property;
	private String value;
	private String root;
	private String filter;
	private String filterFn;

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

	public String getRoot() {
		return root;
	}

	public void setRoot(String root) {
		this.root = root;
	}
	
	public String getFilter() {
		return filter;
	}

	public void setFilter(String filter) {
		this.filter = filter;
	}

	public String getFilterFn() {
		return filterFn;
	}

	public void setFilterFn(String filterFn) {
		this.filterFn = filterFn;
	}

	public String toString() {
		return "FilterPojo [property=" + property + ", value=" + value + "]";
	}
}
