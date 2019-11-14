<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();
/** @var array $arParams */
/** @var array $arResult */
/** @global CMain $APPLICATION */
/** @global CUser $USER */
/** @global CDatabase $DB */
/** @var CBitrixComponentTemplate $this */
/** @var string $templateName */
/** @var string $templateFile */
/** @var string $templateFolder */
/** @var string $componentPath */
/** @var CBitrixComponent $component */
$this->setFrameMode(true);
?>
<?
	//echo "<pre>"; print_r($arResult); echo "</pre>";
?>
<script type="text/javascript">
	
	var QUESTIONS = [];  
	var CHECKLIST_COLUMNS = null;
	
	<?foreach($arResult["ITEMS"] as $k => $arItem):?>
		
			var question = <?=CUtil::PhpToJSObject($arItem)?>;
			question.CHECKLIST_RESULT = <?=CUtil::PhpToJSObject($arItem["DISPLAY_PROPERTIES"]["CHECK_LIST"]["VALUE"])?>;
			QUESTIONS.push(question);

			if(CHECKLIST_COLUMNS == null)
				CHECKLIST_COLUMNS = <?=CUtil::PhpToJSObject($arItem["DISPLAY_PROPERTIES"]["CHECK_LIST"]["USER_TYPE_SETTINGS"]["COLUMNS"])?>;
		
	<?endforeach;?>
	  


	var $app = new JSQuestionnaire(
		'<?=LANGUAGE_ID?>',
		QUESTIONS,
		CHECKLIST_COLUMNS,
		'questions_wrap', 
		'question', 
		{
			"TASK" : "Задание",		
			"NOT_COUNT" : "Не засчитано",
			"SKIP" : "пропустить",
			"TOGGLE" : "свернуть/развернуть",
			"CHECKLIST" : "Чек-лист",
			"OTHER" : "Другое",
			"OTHER_TEXT" : "Текст замечания",
			"OTHER_FEE" : "Штраф",
			"OTHER_ENTER_COMMENT" : "Введите комментарий!",
			"MARK" : "Оценка за задание",
			"SOLUTION_CORRECT" : "Решение засчитано, все верно!",
			"SOLUTION_PASSED" : "Решение засчитано, отметим:",
			"SOLUTION_FAILED" : "Решение не засчитано, отметим:",
			"SOLUTION_NOT_COMPLETED" : "Решение не выполнено",
			"ITOG" : "Итог работы",
			"RESULT" : "Результат",
			"RESULT_PASSED" : "работа сдана",
			"RESULT_FAILED" : "работа не сдана",
			"TYPE" : "тип ответа",
			"TYPE_STANDARD" : "все стандартно",
			"TYPE_NONSTANDARD" : "нестандартно в вопросах",
			"BALLS" : "Баллы по заданиям",
			"BALL_M" : "Средний балл",
			"COMMENT" : "Комментарий",
			"SCREENS" : "скриншоты, пояснения",
			"TEXT_HEADER" : "Уважаемый слушатель!", //,
			"TEXT_ITOG" : "Итог проверки дипломной работы:",
			"TEXT_RESULT" : "Результат",
			"TEXT_RESULT_EXCELLENT" : "отлично",
			"TEXT_RESULT_GOOD" : "хорошо",
			"TEXT_RESULT_SATISFY" : "удовлетворительно",
			"TEXT_RESULT_FAILED" : "не сдана",
			"TEXT_RESULT_FAILED_LINK" : "Требования к работе - ",
			"SEND_TO_GOOGLE" : "Отправить в таблицу Google", 
			"SEND_TO_GOOGLE_ID" : "ID",
			"SEND_TO_GOOGLE_GO" : "Поехали!"
		}
	);
	console.log($app);	
</script>

<div id="questions_wrap"></div>



 

<div class="news-list"   id="questions_wrap1"  > 
	<button class="btn-clipboard" data-clipboard-target="#answer">Скопировать</button>
	<button onclick="javascript:location.reload();">Сбросить</button>
		<button onclick="javascript:loadSheetsApi();">Отправить в Google (beta)</button>
		<div id="authorize-div" style="display: none">
			<span>Authorize access to Google Sheets API</span>
			<!--Button for the user to click to initiate auth sequence -->
			<button id="authorize-button" onclick="handleAuthClick(event)">
				Authorize
			</button>
		</div>
		<pre id="output"></pre>
</div> 
