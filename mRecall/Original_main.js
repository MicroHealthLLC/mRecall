function search(){
	var keyword = $("#search-text").val();
	keyword=keyword.replace(/ /g,"+");
	var startDate = $("#start-date").val();
	var endDate = $("#end-date").val();
	var site = "http://api.usa.gov/recalls/search.json?query="+keyword+"&start_date="+encodeURIComponent(startDate)+"&end_date="+encodeURIComponent(endDate)+"&per_page=50";
	$("#busy-holder").show()
	
	console.log(site);
	var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from json where url="' + site + '"') + '&format=json&callback=?';
	$.getJSON(yql, callback);

	//$.ajax({"url":site,"type":"GET","dataType":"jsonp"}).done(function(res){callback(res)}).fail(function(a,b,c){alert('fail');console.log(a,b,c);});
}

function callback(jsonres){
	console.log(jsonres)
	var res = jsonres['query']['results'];
	$("#busy-holder").hide();
	var resStr='';
	if(res['success']==undefined || res['success']['total']==0){
		resStr="<li><p> No Matching Result(s) </p></li>";
	}else{
		var results = res['success']['results'];
		var len = results.length;
		for(i=0;i<len;i++){
			var manufacture = 'No Manufature';
			if(results[i]['manufacturers']){
				manufacture = results[i]['manufacturers'];
			}
			var ptype = 'No product type';
			if(results[i]['product_types']){
				manufacture = results[i]['product_types'];
			}
			var descriptions='No value',hazards='No value',recall_number='No value',recall_date='No value',countries='No value',organization='No value';
			if(results[i]['descriptions']){
				descriptions = results[i]['descriptions'];
			}
			if(results[i]['hazards']){
				hazards = results[i]['hazards'];
			}
			if(results[i]['recall_number']){
				recall_number = results[i]['recall_number'];
			}
			if(results[i]['recall_date']){
				recall_date = results[i]['recall_date'];
			}
			if(results[i]['countries']){
				countries = results[i]['countries'];
			}
			if(results[i]['organization']){
				organization = results[i]['organization'];
			}
			resStr+="<li><h5><div class='open_box' tabindex='-1'></div>";
			resStr+="<a href='"+results[i]['recall_url']+"' target='_blank'>"+manufacture+"("+ptype+")</a>";
			resStr+="</h5><div class='contentBlog' style='display:none'>";
			//resStr+=$(this).find("content[name=FullSummary]").text();
			resStr+="<b>Descriptions:</b>  "+descriptions+"<br/><br/>";
			resStr+="<b>Hazards:</b>  "+hazards+"<br/><br/>";
			resStr+="<b>Recall Number:</b>  "+recall_number+"<br/><br/>";
			resStr+="<b>Recall Date:</b>  "+recall_date+"<br/><br/>";
			resStr+="<b>Countries:</b>  "+countries+"<br/><br/>";
			resStr+="<b>Organization:</b>  "+organization+"<br/>";
			resStr+="</div></li>"
		}
	}
	$("#main-result").html(resStr);

	$('#results').pajinate({
		items_per_page : 10,
		nav_label_first : '<<',
		nav_label_last : '>>',
		nav_label_prev : '<',
		nav_label_next : '>'	
	});

	$("#results").show().find(".ellipse").hide();
	$("#search-text").focus();
}

$( document ).ready(function() {
	$("#find").on("click",function(){
		search();
	});

	$("#results").on("click",".open_box",function(){
		var thisObj = $(this);
        var contentBlog = thisObj.parent().next(".contentBlog");
        if(contentBlog.is(":visible")){
          thisObj.parent().removeClass('opened');
        	contentBlog.slideUp('slow');
        }else{
          thisObj.parent().addClass('opened')
          contentBlog.slideDown('slow');
        }
	})

	$("#search-text").on("keyup",function(e){
		var keycode = e.keyCode;
		if(keycode==13)
			search();
	})

	var date = new Date();
	var currYear = date.getFullYear();
	var newDate = new Date();
	newDate.setFullYear(parseInt(currYear)-1)

	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = dd+'-'+mm+'-'+yyyy;
	var newDate =  dd+'-'+mm+'-'+(parseInt(yyyy)-1);

	$("#start-date").datepicker({
		 changeMonth: true,
		 changeYear: true,
		 dateFormat:"dd-mm-yy",
		  onClose: function( selectedDate ) {
			$( "#end-date" ).datepicker( "option", "minDate", selectedDate );
		  }
	}).val(newDate)

	$("#end-date").datepicker({
		 changeMonth: true,
		 changeYear: true,
		 dateFormat:"dd-mm-yy",
		  onClose: function( selectedDate ) {
			$( "#start-date" ).datepicker( "option", "maxDate", selectedDate );
		  }
	}).val(today)
});