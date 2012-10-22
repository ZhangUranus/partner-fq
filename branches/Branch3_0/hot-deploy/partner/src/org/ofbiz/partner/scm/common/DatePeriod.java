package org.ofbiz.partner.scm.common;

import java.util.Date;

public class DatePeriod {
	public Date fromDate;
	public Date endDate;
	
	public DatePeriod(Date f,Date e){
		fromDate=f;
		endDate=e;
	}
	
	public DatePeriod(){
		
	}
	
}
