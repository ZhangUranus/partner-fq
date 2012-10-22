package org.ofbiz.partner.scm.stock;


//业务标记，进仓,出仓,改板
enum ProductStockType{
	IN(1),OUT(2),CHG(3);
	
	ProductStockType(int v){
		this.value=v;
	}
	private int value;
	
	public int getValue(){
		return this.value;
	}
	
	/**
	 * 通过value 构建enum
	 * @param i
	 * @return
	 */
	public static ProductStockType valueOf(int i){
		switch(i){
		case(1):
			return IN;
		case(2):
			return OUT;
		case(3):
			return CHG;
		default:
			throw new IllegalArgumentException();
		}
	}
}