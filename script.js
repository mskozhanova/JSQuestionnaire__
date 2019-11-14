	function JSQuestionnaire (LANGUAGE_ID, ITEMS, CHECKLIST_COLUMNS, ROOT_ID, QUESTION_CLASS, phrases) {
		var $curapp = this;

		$curapp.LANGUAGE_ID = LANGUAGE_ID;
		$curapp.ITEMS = ITEMS;
		$curapp.CHECKLIST_COLUMNS = CHECKLIST_COLUMNS;
		$curapp.ROOT_ID = ROOT_ID;
		$curapp.QUESTION_CLASS = QUESTION_CLASS;
		$curapp.TITLE_TAG = "small";

		$curapp.QUESTIONS = [];

		$curapp.PHRASES = phrases;

		$curapp.GPA = 5.0;

		$curapp.CRITERIAS = {
			"EXCELLENT" : {MIN: 5, PASSED: true},
			"GOOD" :  {MIN: 4.5, PASSED: true},
			"SATISFY" :  {MIN: 3.9, PASSED: true, ERRORS: {serious: "many", important: 1}},
		}

	}



	function JSQuestion(INDEX, CODE, NAME, LIST, H2, POINT_SHOW) {
		var $curapp = this;

		$curapp.INDEX = INDEX;
		$curapp.CODE = CODE;
		$curapp.NAME = NAME;
		$curapp.CHECKLIST = new JSCheckList(LIST, INDEX);
		$curapp.POINT = 5;
		$curapp.FULL_POINT = 5;
		$curapp.PASSED = true;

		$curapp.H2 = H2;
		$curapp.POINT_SHOW = POINT_SHOW;

	}

	function JSCheckList(LIST, QINDEX) {
		var $curapp = this;

		$curapp.REMARKS = [];
		$curapp.QINDEX = QINDEX;

		var i=0;

		LIST.forEach(function(l) {
			var remark = new JSRemark(i, QINDEX, l.text, l.point, l.type, true, false);
			$curapp.REMARKS.push(remark);
			i++;
		})
		$curapp.REMARKS.push(new JSRemark(i, QINDEX, "", 0, "other", false, false));

	}

 	

	function JSRemark(INDEX, QINDEX, COMMENT, POINT, TYPE, STANDART, CHECKED) {
		var $curapp = this;

		$curapp.COMMENT = COMMENT;
		$curapp.POINT = parseFloat(POINT) != 'NaN' ? parseFloat(POINT) : 0;
		$curapp.INDEX = INDEX;
		$curapp.TYPE = TYPE;
		$curapp.QINDEX = QINDEX;

		if(STANDART == null || STANDART == false)
			$curapp.STANDART = false;
		else
			$curapp.STANDART = true;		

		if(CHECKED == null || CHECKED == false)
			$curapp.CHECKED = false;
		else
			$curapp.CHECKED = true;

	}

	JSQuestionnaire.prototype.getPhrase = function(code, replace) {
		var $curapp = this;
		var str = ($curapp.PHRASES[code] != null) ? $curapp.PHRASES[code] : "---";
		if(replace != null) { console.log(replace);
			for(var key in replace) {
				str = str.replace("#"+key+"#", replace[key]);
			}
		}
		return str;
	}	

	JSQuestionnaire.prototype.getErrorName = function(code) {
		var $curapp = this;
		var name = $app.getPhrase("OTHER");

		$curapp.CHECKLIST_COLUMNS.forEach(function(element) { 
			if(element.NAME == "type") {
				element.VALUES.forEach(function(e) {
					if(e.VALUE == code) {
						name = e.LANG[$curapp.LANGUAGE_ID] 
						return name;
					}
				})
			}
		})

		return name;
	}



	BX.ready(function(){  	 


		JSRemark.prototype.setRemark = function(checked) {
			var $curapp = this;

			if($curapp.STANDART == false) {
				$curapp.COMMENT = BX("add-c-"+$curapp.QINDEX).value;
				var pp = BX("add-p-"+$curapp.QINDEX).value;
				$curapp.POINT = parseFloat(pp) != 'NaN' ? parseFloat(pp) : 0;;	

				if(checked == true) {
					if($curapp.COMMENT.length ==0){
						alert($app.getPhrase("OTHER_ENTER_COMMENT"));
						BX("item-"+$curapp.QINDEX+"-"+$curapp.INDEX).checked = false;
						checked = false;
					} else {
						BX("add-c-"+$curapp.QINDEX).disabled = true;
						BX("add-p-"+$curapp.QINDEX).disabled = true;
					}
				} else {
					BX("add-c-"+$curapp.QINDEX).disabled = false;
					BX("add-p-"+$curapp.QINDEX).disabled = false;
				}				
			}

			$curapp.CHECKED = checked;
			//console.dir($curapp);
			//var question = $app.QUESTIONS[$curapp.QINDEX]; 
			$app.getAnswer();
		}


		JSRemark.prototype.buildChecklistPosition = function() {
			var $curapp = this;
 
			var j = $curapp.QINDEX;
			var k = $curapp.INDEX;

					var chtds = [
						BX.create(
							'td', 
							{								
								children: [
									BX.create(
										'input',
										{
											props: {},
											attrs: {
												id: "item-"+j+"-"+k,
												type: "checkbox"
											},
											events:{
												click: BX.proxy(
													function(e) { 
														//console.log(j +" - "+k); logHelper(l); 
															if(e.target.checked) {
																$curapp.setRemark(true); 
															} else {
																$curapp.setRemark(false); 
															}														
													}, 
													this
												)
											}
										}
									)
								]
							}
						),
						BX.create(
							'td',
							{
								html: $app.getErrorName($curapp.TYPE)
							}
						),						
						BX.create(
							'td',
							{
								html: $curapp.STANDART == true ? "<label for=\"item-"+j+"-"+k+"\" >"+$curapp.COMMENT+"</label><br /><i>"+$app.getPhrase("SCREENS")+"</i>:<br /><textarea id=\"screen-"+j+"-"+k+"\" cols=80 rows=3></textarea>" : "",
								children: $curapp.STANDART == false ? [ BX.create('textarea', { attrs: {id: "add-c-"+$curapp.QINDEX, name: "additional-comment", cols: 80, rows: 10 }})] : [] 
							}
						),
						BX.create(  
							'td',
							{
								html: $curapp.STANDART == true ? $curapp.POINT : "",
								children: $curapp.STANDART == false ? [BX.create('input', { events: {change: BX.proxy(function(e){e.target.value =  parseInt(e.target.value)+'' != 'NaN' ?  parseInt(e.target.value) : 0; }, this)}, attrs: {id: "add-p-"+$curapp.QINDEX, type: "text", name: "add-point", value: "0"}})] : []
								 
							}
						),						
					]; 
					var chrow = BX.create(
						'tr',
						{
							attrs: {
								className: $curapp.TYPE,
							},
							children: chtds
						}
					)

					return chrow;
		}

		

		JSQuestion.prototype.buildChecklist = function() {
			var $curapp = this;
 
			var checklist = $curapp.CHECKLIST;
			var j = $curapp.INDEX;

			element = BX("question-check-list-"+j);

			var chtable = BX.create(
				'table',
				{
					attrs: {
						className: "grain-tables-table-view",
						cellpadding: 0,
						cellspacing: 0
					}
				}
			);

			var chcolumns = [
				BX.create('td')
			];

			$app.CHECKLIST_COLUMNS.forEach(
				function(c) {
					chcolumns.push(
						BX.create('td', { html: c.LANG[$app.LANGUAGE_ID].NAME + ( c.LANG[$app.LANGUAGE_ID].TOOLTIP != null  ? "<div class=\"grain-tables-table-view-tooltip\">"+c.LANG[$app.LANGUAGE_ID].TOOLTIP+"</div>" : "" ) } )
					);
				}
			)

			BX.append(
				BX.create(
					'thead',
					{
						children:  [
							BX.create(
								'tr',
								{
									children: chcolumns
								}
							)
						]
					}
				),
				chtable
			)

			var chrows = [];

			var k=0;

			checklist.REMARKS.forEach(
				function(r) {
					var chrow = r.buildChecklistPosition();
					chrows.push(chrow);
					k++;
				}
			)


			BX.append(
				BX.create(
					'tbody',
					{
						children:  chrows
					}
				),
				chtable
			)			

			BX.append(chtable, element);
		}		



		JSQuestion.prototype.buildCtrls = function() {
			var $curapp = this;

			element = $curapp.H2;  
			j=$curapp.INDEX;
				
				BX.append(BX.create(
						'a', {
							attrs: {
								className: 'skiptonext ctrls',
								href: "#",
								title: $app.getPhrase("SKIP")
							},
							text: $app.getPhrase("SKIP"),
							events: {
								click: BX.proxy(function(e) {   e.preventDefault(); BX.scrollToNode(BX("q"+($curapp.INDEX+1))); }, this)
							}
						}
					), element); 
				BX.append(BX.create(
						'a', {
							attrs: {
								className: 'toggle ctrls',
								href: "#",
								title: $app.getPhrase("TOGGLE")
							},
							text: $app.getPhrase("TOGGLE"),
							events: {
								click: BX.proxy(function(e) {   e.preventDefault(); BX.toggle(BX("q-ch-"+$curapp.INDEX)); }, this)
							}
						}
					), element); 
				BX.append(BX.create(
						'input', {
							attrs: {
								type: "checkbox",
								className: 'not',
								id: "chck-"+j
							},
							events: {
								click:  BX.proxy(
											function(e) { 
												//console.log(j +" - "+k); logHelper(l); 
												if(e.target.checked) {
													$curapp.setPassed(false); 
												} else {
													$curapp.setPassed(true); 
												}														
										}, 
										this
									)
							}
						}
					), element); 
				BX.append(BX.create(
						'label', {
							attrs: {								
								for: "chck-"+j
							},
							text: $app.getPhrase("NOT_COUNT"),

						}
					), element);  		

		}	


			

		JSQuestionnaire.prototype.build = function(){
			var $curapp = this;

			$curapp.ROOT = BX($curapp.ROOT_ID); 

			var j=0;

			$curapp.ITEMS.forEach(
				function(element) {
					
					var question_div = BX.create(
						'div',
						{
							attrs: {
								className: $curapp.QUESTION_CLASS,	
								id: "q"+j	
							}					
						}
					);

					BX.append(question_div, $curapp.ROOT);

					var question_content = [
						BX.create('h2', {attrs:{id: "h2"+j}, html: $app.getPhrase("TASK")+" "+(j+1)+" ("+element.CODE+") <small class=\"dop-links\"></small>"}),
						BX.create('div', {attrs:  {id: "q-ch-"+j}, children: [
							BX.create('div', {html:  element.PREVIEW_TEXT}),						
							BX.create('h3', {text: $app.getPhrase("CHECKLIST")} ),
							BX.create('div', {attrs:{id: "question-check-list-"+j} }),
							BX.create('p', {children: [BX.create('b', {text: $app.getPhrase("MARK")+": "}), BX.create('span', {attrs: {id: "point-"+j}})] 	 }),							
						] }),

					];

					question_content.forEach(function(c){
						BX.append(c, question_div);
					});

					var question = new JSQuestion(j, element.NAME, element.PREVIEW_TEXT, element.CHECKLIST_RESULT, BX("h2"+j), BX("point-"+j));
					$curapp.QUESTIONS.push(question);

					question.buildCtrls();					

					question.buildChecklist();

					j++;

				}
			);

			var questions_itog = [
				BX.create(
					'h2',
					{
						attrs: {
							className: $curapp.QUESTION_CLASS,		
						},
						text: $app.getPhrase("ITOG")			
					}
				),
				BX.create(
					'p',
					{
						html: "<b>"+$app.getPhrase("RESULT") +":</b> <span id=\"result\" class=\"yes\"></span>"			
					}
				),	
				BX.create(
					'p',
					{
						html: "<b>"+$app.getPhrase("TYPE") +":</b> <span id=\"answerType\"></span></span>"			
					}
				),	
				BX.create(
					'p',
					{
						html: "<b>"+$app.getPhrase("BALLS") +":</b> <span id=\"all-points\"></span></span>"			
					}
				),	
				BX.create(
					'p',
					{
						html: "<b>"+$app.getPhrase("BALL_M") +":</b> <span id=\"gpa\"></span></span>"			
					}
				),	
				BX.create(
					'p',
					{
						html: "<b>"+$app.getPhrase("COMMENT") +":</b> "			
					}
				),	
				BX.create(
					'textarea',
					{
						attrs: {
							name: "answer",
							id: "answer",
							cols: 98,
							rows: 30
						}		
					}
				),
			];

			questions_itog.forEach(function(it){
				BX.append(it, $curapp.ROOT);
			}); 

			$curapp.buildGoogleSheetsCtrls();
		}	

		JSQuestionnaire.prototype.googleSheetsHandler = function(e){
			var $curapp = this;

			var sheetID = "1AWyR4mcDpzcoJNCkpYt8s0wKxiZiGvE1-SZmo8lFa28";
			var sheetURL = "https://docs.google.com/spreadsheets/d/1AWyR4mcDpzcoJNCkpYt8s0wKxiZiGvE1-SZmo8lFa28/edit#gid=0";

			console.log(e); 

		}	

		JSQuestionnaire.prototype.buildGoogleSheetsCtrls = function() {
			var $curapp = this;

			var g_buttons = [
				BX.create(
					'h2',
					{						
						text: $app.getPhrase("SEND_TO_GOOGLE")			
					}
				),
				BX.create(
					'div',
					{
						children: [
							BX.create(
								'span',
								{
									html:  $app.getPhrase("SEND_TO_GOOGLE_ID")	+": &nbsp; "			
								}
							),	
							BX.create(
								'input',
								{
									name:  "exam_id",
									size: 20,
									id:   "exam_id",
								}
							),												
							BX.create(
								'button',
								{
									text:  $app.getPhrase("SEND_TO_GOOGLE_GO"),
									events: {
										click: BX.proxy($app.googleSheetsHandler, this)
									}				
								}
							)
						]
					}
				),

			];

			g_buttons.forEach(function(it){
				BX.append(it, $curapp.ROOT);
			}); 			

		}		 	

		JSQuestionnaire.prototype.getAnswer = function() {
			var $curapp = this;

			var link = ""; //console.log(BX('link').value)
			if(BX('link') && BX('link').value.length > 0)
				link = $app.getPhrase("TEXT_RESULT_FAILED_LINK")+ BX('link').value;

			var textheader = $app.getPhrase("TEXT_HEADER");
			if(BX('textheader'))
				textheader = BX('textheader').value;

			var text = textheader+"\n\n";

			text += $app.getPhrase("TEXT_ITOG")+"\n\n";

			var allPoint = [];
			var nonstandard = [];
			var sum = 0;

			$curapp.QUESTIONS.forEach(function(element, i) {
				text += $app.getPhrase("TASK")+" "+(i+1)+"\n";
				text += element.NAME+"\n";

				var res = element.recalculatePoint();
				sum += element.POINT;

				allPoint.push("<td>"+element.POINT +"</td>");

				if(res.COMPLETED == false) {
					text +=  $app.getPhrase("SOLUTION_NOT_COMPLETED")	+"\n"	
				} else {
					if(res.REMARKSCOUNT == 0) 
						text += $app.getPhrase("SOLUTION_CORRECT")+"\n"
					else {
						if(element.taskCompleted())
							text += $app.getPhrase("SOLUTION_PASSED")+"\n"		
						else
							text += $app.getPhrase("SOLUTION_FAILED")+"\n"

						text += res.TEXT+'\n';							
					}
				}
 

				if(!res.STANDART)
					nonstandard.push(element.INDEX);

				text += "\n\n";

				

			})

			

			BX.adjust(BX('all-points'), {html: '<table><tr>'+(allPoint.join(' ')).replace(/\./g, ',')+'</tr></table>' }); 

		    if (nonstandard.length == 0 )
		    {
		        BX.adjust(BX('answerType'), {html: $app.getPhrase("TYPE_STANDARD") });		        
		    }
		    else
		    {
		        BX.adjust(BX('answerType'), {html: $app.getPhrase("TYPE_NONSTANDARD") + ": " + nonstandard.join(', ')}); 
		    }

		    $curapp.GPA = Math.round((sum / $curapp.QUESTIONS.length) * 100) / 100; // Вычислим средний балл (до 2-х цифр после запятой)
		    BX.adjust(BX('gpa'), {html: $curapp.GPA });	


		    var isAllTasksCompleted = $app.allTasksCompleted();  //console.log("isAllTasksCompleted: "+isAllTasksCompleted)

		    var failed = true;

		    text += $app.getPhrase("TEXT_RESULT")+": "

		    for(key in $curapp.CRITERIAS) {
		    	//console.log(key+" - "+$curapp.CRITERIAS[key]);
		    	if($curapp.GPA >= $curapp.CRITERIAS[key].MIN && isAllTasksCompleted == $curapp.CRITERIAS[key].PASSED) {
		    		text += $app.getPhrase("TEXT_RESULT_"+key);
		    		failed = false;
		    		BX.adjust(BX("result"), {attrs: {className: "yes"}, html: $app.getPhrase("RESULT_PASSED")})
		    		break;
		    	}		    		
		    }

		   

		    if(failed) {
		    	text += $app.getPhrase("TEXT_RESULT_FAILED");
		    	BX.adjust(BX("result"), {attrs: {className: "no"}, html: $app.getPhrase("RESULT_FAILED")})
			    text +=  link;		    	
		    }



		    BX('answer').value = text;  		
		}

			
		JSQuestionnaire.prototype.allTasksCompleted = function(){
			var $curapp = this;

			var completed = true;

			$curapp.QUESTIONS.forEach(function(q){
				if(completed && !q.taskCompleted()) {
					completed = false;
				}
			})

		    return completed;
		}	

		JSQuestion.prototype.taskCompleted = function(){
			var $curapp = this;
			//console.log($curapp);
		    if(!$curapp.PASSED) {
		    	BX("chck-"+$curapp.INDEX).checked = true;
		        return false;
		    }
		    if($curapp.POINT < 2) {
		    	BX("chck-"+$curapp.INDEX).checked = true;
		        return false;
		    }

		    BX("chck-"+$curapp.INDEX).checked = false;
		    return true;
		}

		JSQuestion.prototype.setPassed = function(passed){
			var $curapp = this;
			$curapp.PASSED = passed == true ? true : false;
			//console.log($curapp);
			$app.getAnswer();
		}
 

	


		JSQuestion.prototype.recalculatePoint = function() {
			var $curapp = this;
			//console.dir($curapp.CHECKLIST.REMARKS);
			var returnObj = {REMARKSCOUNT: 0, STANDART: true, TEXT: "", COMPLETED: true}; 
			var minusPoint = 0;

			$curapp.CHECKLIST.REMARKS.forEach(function(r){
				if(r.CHECKED) {
					//console.log(r);
					minusPoint += r.POINT;
					if(r.TYPE != "not_completed")
						returnObj.REMARKSCOUNT++;
					else
						returnObj.COMPLETED = false;
					if(r.STANDART == false)
						returnObj.STANDART = false;
					returnObj.TEXT  += $app.clean(r.COMMENT)+"\n";
					if(BX("screen-"+r.QINDEX+"-"+r.INDEX) && BX("screen-"+r.QINDEX+"-"+r.INDEX).value.length>0) 
						returnObj.TEXT +=  $app.clean(BX("screen-"+r.QINDEX+"-"+r.INDEX).value) +"\n"				
				}
			})
			//console.log($curapp.INDEX+": minus= "+minusPoint);

			if($curapp.FULL_POINT - minusPoint > 0)
				$curapp.POINT = $curapp.FULL_POINT - minusPoint;
			else
				$curapp.POINT = 0;


			//if($curapp.PASSED == false)
				//returnObj.COMPLETED = false;

			 
			BX.adjust(BX("point-"+$curapp.INDEX), {html: $curapp.POINT+" "});

			 

			return returnObj;
		}			
 
		JSQuestionnaire.prototype.clean = function(str) {
			str = BX.util.htmlspecialcharsback(str);
			/*var replaceObj = {
				"/&quot;/g" : "\"",
				"/&lt;/g" : ">",
				"/&gt;/g" : "<"
			} 
			for(key in replaceObj) {
				str = str.replace(key, replaceObj[key]);
			}*/
			return str;
		}

		$app.build();

		$app.getAnswer();
		

		



	});	


	var logHelper = function(res) {
		print_obj(res, 0);
	}
	var print_obj = function(obj, level) {
		if(typeof obj == "object") {
			for (var key in obj) {
				console.log(("-".repeat(level+1) )+level+" key: "+key);
				print_obj(obj[key], level+1);
			}	
		}
		else 
			console.log(("-".repeat(level+1) )+"obj: "+obj);
	} 