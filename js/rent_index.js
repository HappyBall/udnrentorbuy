var city_dict = {};
// var city_chose_rent = "";
var city_chose_budget = "";
var city_chose_buy = "台北市";
var dist_chose_buy = "萬華區";
var rent_object = {};
var buy_object = {};
var budget_object = {};
var investreturn = 0;
var currencyinflat = 0;
var actual_invest_return = 0;
var tips_dict = {};
var tip_selected_buy = "question-houseinflat";
var tip_selected_rent = "question-rentinflat";
var nav_selected = 0;
var trading_point_arr = [];
// var city_clicked = "";

var taiperDistsList = ["中正區", "大同區", "中山區", "松山區", "大安區", "萬華區", "信義區", "士林區", "北投區", "內湖區", "南港區", "文山區"];

//---------------------------------------------------------------------------

if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 // some code..
 window.location.href = "http://p.udn.com.tw/upf/newmedia/2015_data/20150903_udnrentorbuy/udnrentorbuy_m/index.html";
}

$(document).ready(function(){

	$("#first-cover").css("height", $(window).height());
	$("#first-cover img").css("height", $(window).height());
	
	if($("#first-cover img").width() > $(window).width()){
		var dif = $("#first-cover img").width() - $(window).width();
		$("#first-cover img").css("margin-left", -(dif/2));
	}

	// console.log(rent_object);

	d3.csv("data/tips.csv", function(data_tips){
		for (var i in data_tips){
			var temp = {};
			temp['title'] = data_tips[i]['title'];
			temp['content'] = data_tips[i]['content'];

			tips_dict[data_tips[i]['key']] = temp;
		}

		// console.log(tips_dict);

		$(".question-mark").on("mouseover", function(){

			var key = $(this).attr("id").split("-")[1];

			if($(this).parent().attr("for").split("-")[0] == "rent"){

				if($(this).attr("id") != tip_selected_rent){

					$("#rent-tip-title").html(tips_dict[key]['title']);
					$("#rent-tip-content").html(tips_dict[key]['content']);
					// $("#rent-tip-block").css("display", "table");

					$("#" + tip_selected_rent).css("opacity", 0.5);
					$(this).css("opacity", 1);

					tip_selected_rent = $(this).attr("id");
				}
			}
			else{
				if($(this).attr("id") != tip_selected_buy){

					$("#buy-tip-title").html(tips_dict[key]['title']);
					$("#buy-tip-content").html(tips_dict[key]['content']);
					// $("#buy-tip-block").css("display", "table");

					$("#" + tip_selected_buy).css("opacity", 0.5);
					$(this).css("opacity", 1);

					tip_selected_buy = $(this).attr("id");
				}
			}
		
		});


	});

	d3.csv("data/city_dist_avgmoney_real.csv", function(data_avgmoney){
		// console.log(data_avgmoney);
		for (var i in data_avgmoney){
			// console.log(data_avgmoney[i]);
			if (data_avgmoney[i]['city'] in city_dict == false){
				city_dict[data_avgmoney[i]['city']] = {}
			}

			city_dict[data_avgmoney[i]['city']][data_avgmoney[i]['dist']] = data_avgmoney[i]['avg-square-money'];
		}

		initAllValues();

		rentObjectInit();
		buyObjectInit();
		budgetObjectInit();

		initCal();

		// console.log(city_dict);
		for (var i in Object.keys(city_dict)){
			d3.select(".dropdown-city-rent").append("li").append("a").text(Object.keys(city_dict)[i]);
			d3.select(".dropdown-city-buy").append("li").append("a").text(Object.keys(city_dict)[i]);
			d3.select(".dropdown-budget").append("li").append("a").text(Object.keys(city_dict)[i]);
		}

		$(".dropdown-budget li").click(function(){
			var city_clicked = $(this).find(" a").text();

			if(city_clicked != city_chose_budget){
				$("#dropdownMenu-budget").html(city_clicked + "<span><img src='img/popdown.png'></span>");

				city_chose_budget = city_clicked;
			}

			// console.log(city_chose_budget);
		});

		/*$(".dropdown-city-rent li").click(function(){
			// console.log("hi");
			var city_clicked = $(this).find("a").text();

			if(city_clicked != city_chose_rent){
				$("#dropdownMenu-city-rent").html(city_clicked + "<span class='caret'></span>");

				var myNode = document.getElementsByClassName("dropdown-dist-rent")[0];
				while (myNode.firstChild) {
				    myNode.removeChild(myNode.firstChild);
				}

				// console.log($("#dropdownMenu-city-rent").text());
				for (var j in Object.keys(city_dict[city_clicked])){
					d3.select(".dropdown-dist-rent").append("li").append("a").text(Object.keys(city_dict[city_clicked])[j]);
				}

				$("#dropdownMenu-dist-rent").html("地區 <span class='caret'></span>");


				city_chose_rent = city_clicked;

				$(".dropdown-dist-rent li").click(function(){
					// console.log("hi");
					var dist_clicked = $(this).find("a").text();
					// console.log(dist_clicked);
					$("#dropdownMenu-dist-rent").html(dist_clicked + "<span class='caret'></span>");


				});
			}


		});*/

		$(".dropdown-city-buy li").click(function(){
			// console.log("hi");
			var city_clicked = $(this).find("a").text();

			if(city_clicked != city_chose_buy){
				$("#dropdownMenu-city-buy").html(city_clicked + "<span><img src='img/popdown.png'></span>");

				var myNode = document.getElementsByClassName("dropdown-dist-buy")[0];
				while (myNode.firstChild) {
				    myNode.removeChild(myNode.firstChild);
				}

				// console.log($("#dropdownMenu-city-buy").text());
				for (var j in Object.keys(city_dict[city_clicked])){
					d3.select(".dropdown-dist-buy").append("li").append("a").text(Object.keys(city_dict[city_clicked])[j]);
				}

				$("#dropdownMenu-dist-buy").html("地區 <span><img src='img/popdown.png'></span>");
				$("#buy-money").val("");

				city_chose_buy = city_clicked;

				$(".dropdown-dist-buy li").click(function(){
					// console.log("hi");
					var dist_clicked = $(this).find("a").text();
					// console.log(dist_clicked);

					if(dist_clicked != dist_chose_buy){
						$("#dropdownMenu-dist-buy").html(dist_clicked + "<span><img src='img/popdown.png'></span>");
						// console.log(parseInt($("#buy-square").val()));
						if(!isNaN(parseFloat($("#buy-square").val()))){
							var squs = parseFloat($("#buy-square").val());

							$("#buy-money").val(thousandComma(Math.round(squs * parseFloat(city_dict[city_chose_buy][dist_clicked]))));
						}

						dist_chose_buy = dist_clicked;
					}
				});

				
			}


		});

		$("#buy-square").blur(function(){
			if(!isNaN(parseFloat(city_dict[city_chose_buy][dist_chose_buy])) && !isNaN(parseInt($("#buy-square").val()))){
				var squs = parseFloat($("#buy-square").val());
				$("#buy-money").val(thousandComma(Math.round(squs * parseFloat(city_dict[city_chose_buy][dist_chose_buy]))));
			}
		});

		$("#buy-time").blur(function(){
			if(!isNaN(parseInt($("#buy-time").val().replace(/[,]+/g,"")))){
				$("#rent-time").val(parseInt($("#buy-time").val().replace(/[,]+/g,"")));
			}
			else{
				$("#buy-time").val(parseInt($("#rent-time").val().replace(/[,]+/g,"")));
			}
		});

		$("#rent-time").blur(function(){
			if(!isNaN(parseInt($("#rent-time").val().replace(/[,]+/g,"")))){
				$("#buy-time").val(parseInt($("#rent-time").val().replace(/[,]+/g,"")));
			}
			else{
				$("#rent-time").val(parseInt($("#buy-time").val().replace(/[,]+/g,"")));
			}
		});

		$(".dropdown-dist-buy li").click(function(){
			// console.log("hi");
			var dist_clicked = $(this).find("a").text();
			// console.log(dist_clicked);

			if(dist_clicked != dist_chose_buy){
				$("#dropdownMenu-dist-buy").html(dist_clicked + "<span><img src='img/popdown.png'></span>");
				// console.log(parseInt($("#buy-square").val()));
				if(!isNaN(parseFloat($("#buy-square").val()))){
					var squs = parseFloat($("#buy-square").val());

					$("#buy-money").val(thousandComma(Math.round(squs * parseFloat(city_dict[city_chose_buy][dist_clicked]))));
				}

				dist_chose_buy = dist_clicked;
			}
		});

		$("#cal-btn-rent-buy").click(function(){
			buyObjectInit();
			updateInputValuesBuy();
			rentObjectInit();
			// console.log(rent_object);
			updateInputValuesRent();

			investreturn = isNaN(parseFloat($("#invest-return").val()))? 0 : parseFloat($("#invest-return").val())/100;
			// currencyinflat = isNaN(parseInt($("#currency-inflat").val()))? 0 : parseInt($("#currency-inflat").val())/100;
			actual_invest_return = investreturn;

			updateEnvironment();

			var firstPay = buy_object['money'] * (1 - buy_object['loanlimit']);
			var loan = buy_object['money'] * buy_object['loanlimit'];
			var buyfee = buy_object['money'] * buy_object['buyfee'];
			var loanMonthRate = buy_object['loanrate']/12;

			//calculate buy init cost
			var initCost = firstPay + buyfee;
			$("#buy-initcost").text("$" + thousandComma(Math.round(initCost)));

			//calculate buy total loan

			var totalLoan = 0, loanPerYear = 0, loanPerMonth = 0;

			if(buy_object['loanrate'] == 0){
				if(buy_object['loantime'] == 0) 
					loanPerMonth = 0;
				else
					loanPerMonth = loan/(buy_object['loantime']*12);
				loanPerYear = loanPerMonth*12;
				totalLoan = loan;
			}
			else{
				if(buy_object['loantime'] == 0) 
					loanPerMonth = 0;
				else
					loanPerMonth = (loan * loanMonthRate) / (1 - Math.pow(1 + loanMonthRate, buy_object['loantime']*(-12)));
				loanPerYear = loanPerMonth * 12;
				totalLoan = loanPerYear * Math.min(buy_object['time'], buy_object['loantime']);
			}
			$("#buy-totalloan").text("$" + thousandComma(Math.round(totalLoan)));

			//calculate buy total tax
			var totalTax = buy_object['housetax'] * buy_object['time'];
			$("#buy-totaltax").text("$" + thousandComma(Math.round(totalTax)));

			//calculate buy oppotunity cost
			var initCostOppo = initCost*Math.pow(1+actual_invest_return, buy_object['time']) - initCost;
			var taxOppo =  calculateGeoSeries(1 + actual_invest_return, buy_object['time'] - 1, buy_object['housetax'] * (1 + actual_invest_return)) - buy_object['housetax'] * (buy_object['time'] - 1);

			if(buy_object['loantime'] >= buy_object['time'])
				var loanOppo = calculateGeoSeries(1 + actual_invest_return, buy_object['time'] - 1, loanPerYear * (1 + actual_invest_return)) - loanPerYear * Math.min((buy_object['time'] - 1), buy_object['loantime']);
			else
				var loanOppo = calculateGeoSeries(1 + actual_invest_return, buy_object['loantime'], loanPerYear * Math.pow(1+actual_invest_return, buy_object['time'] - buy_object['loantime'])) - loanPerYear * Math.min((buy_object['time'] - 1), buy_object['loantime']);

			$("#buy-oppotunitycost").text("$" + thousandComma(Math.round(initCostOppo + taxOppo + loanOppo)));

			//calculate buy sell balance
			var sellPrice = buy_object['money'] * Math.pow(1+buy_object['inflat'], buy_object['time']);
			var loanleft = 0;

			if(buy_object['loanrate'] == 0)
				loanleft = Math.max(0, loan - loanPerMonth*buy_object['time']*12);
			else
				loanleft = Math.max(0, loan*Math.pow(1+loanMonthRate, buy_object['time']*12) - loanPerMonth*(Math.pow(1+loanMonthRate, buy_object['time']*12) - 1)/loanMonthRate);

			var sellBalance = sellPrice*(1 - buy_object['sellfee']) - loanleft;
			$("#buy-sellbalance").text("- $" + thousandComma(Math.round(sellBalance)));

			//calculate total cost
			var totalCost = initCost + totalTax + totalLoan + (initCostOppo + taxOppo + loanOppo) - sellBalance;
			$("#buy-totalcost").text("$" + thousandComma(Math.round(totalCost)) );

			//calculate rent init cost
			var initCost_rent = rent_object['money'] * (rent_object['deposit'] + rent_object['fee']);
			$("#rent-initcost").text("$" + thousandComma(Math.round(initCost_rent)));

			//calculate rent total money 
			var totalMoney_rent = calculateGeoSeries(1+rent_object['inflat'], rent_object['time'], rent_object['money']*12);
			$("#rent-totalmoney").text("$" + thousandComma(Math.round(totalMoney_rent)) );

			//calculate rent oppotunity cost
			var initCostOppo_rent = initCost_rent * (Math.pow(1+actual_invest_return, rent_object['time']) - 1);
			var totalMoneyOppo_rent = calculateGeoSeries( (1+actual_invest_return)/(1+rent_object['inflat']), rent_object['time'], rent_object['money']*12*Math.pow(1+rent_object['inflat'], rent_object['time'] - 1)) - totalMoney_rent;
			$("#rent-oppotunitycost").text("$" + thousandComma(Math.round(totalMoneyOppo_rent + initCostOppo_rent)) );

			//calculate rent deposit back
			var depositBack_rent = rent_object['money'] * rent_object['deposit'];
			$("#rent-depositback").text("- $" + thousandComma(Math.round(depositBack_rent)) );

			//calculate total cost
			var totalCost_rent = initCost_rent + initCostOppo_rent + totalMoney_rent + totalMoneyOppo_rent - depositBack_rent;
			$("#rent-totalcost").text("$" + thousandComma(Math.round(totalCost_rent)) );

			if(totalCost > totalCost_rent){
				$("#rent-buy-compare-text-total").text(buy_object["time"] + "年買房比租房多花");
				$("#rent-buy-compare-num-total").html("$" + thousandComma(Math.round(totalCost - totalCost_rent)));
				$("#rent-buy-compare-text-permonth").text("每個月買房比租房多花");
				$("#rent-buy-compare-num-permonth").html("$" + thousandComma(Math.round((totalCost - totalCost_rent)/(buy_object['time']*12))));
				$("#rent-buy-compare-img img").attr("src", "img/rent_better.png");
				$("#buy-check-img img").attr("src", "img/uncheck.png");
				$("#rent-check-img img").attr("src", "img/check.png");
			}

			else{
				$("#rent-buy-compare-text-total").text(buy_object["time"] + "年租房比買房多花");
				$("#rent-buy-compare-num-total").html("$" + thousandComma(Math.round(totalCost_rent - totalCost)));
				$("#rent-buy-compare-text-permonth").text("每個月租房比買房多花");
				$("#rent-buy-compare-num-permonth").html("$" + thousandComma(Math.round((totalCost_rent - totalCost)/(buy_object['time']*12))));
				$("#rent-buy-compare-img img").attr("src", "img/buy_better.png");
				$("#buy-check-img img").attr("src", "img/check.png");
				$("#rent-check-img img").attr("src", "img/uncheck.png");
			}

			$("#rent-buy-result-container").css("display", "table");

			return false;	
		});

		/*$("#cal-btn-rent").click(function(){
			rentObjectInit();
			// console.log(rent_object);
			updateInputValuesRent();

			investreturn = isNaN(parseInt($("#invest-return").val()))? 0 : parseInt($("#invest-return").val())/100;
			// currencyinflat = isNaN(parseInt($("#currency-inflat").val()))? 0 : parseInt($("#currency-inflat").val())/100;
			actual_invest_return = investreturn;

			// console.log("actual_invest_return = " + actual_invest_return);

			updateEnvironment();

			//calculate rent init cost
			var initCost_rent = rent_object['money'] * (rent_object['deposit'] + rent_object['fee']);
			$("#rent-initcost").text(Math.round(initCost_rent) + " 元");

			//calculate rent total money 
			var totalMoney_rent = calculateGeoSeries(1+rent_object['inflat'], rent_object['time'], rent_object['money']*12);
			$("#rent-totalmoney").text(Math.round(totalMoney_rent) + " 元");

			//calculate rent oppotunity cost
			var initCostOppo_rent = initCost_rent * (Math.pow(1+actual_invest_return, rent_object['time']) - 1);
			var totalMoneyOppo_rent = calculateGeoSeries( (1+actual_invest_return)/(1+rent_object['inflat']), rent_object['time'], rent_object['money']*12*Math.pow(1+rent_object['inflat'], rent_object['time'] - 1)) - totalMoney_rent;
			$("#rent-oppotunitycost").text(Math.round(totalMoneyOppo_rent + initCostOppo_rent) + " 元");

			//calculate rent deposit back
			var depositBack_rent = rent_object['money'] * rent_object['deposit'];
			$("#rent-depositback").text(Math.round(depositBack_rent) + " 元");

			//calculate total cost
			var totalCost_rent = initCost_rent + initCostOppo_rent + totalMoney_rent + totalMoneyOppo_rent - depositBack_rent;
			$("#rent-totalcost").text(Math.round(totalCost_rent) + " 元");

			return false;
		});

		$("#cal-btn-buy").click(function(){
			buyObjectInit();
			updateInputValuesBuy();

			investreturn = isNaN(parseInt($("#invest-return").val()))? 0 : parseInt($("#invest-return").val())/100;
			// currencyinflat = isNaN(parseInt($("#currency-inflat").val()))? 0 : parseInt($("#currency-inflat").val())/100;
			actual_invest_return = investreturn;

			updateEnvironment();

			var firstPay = buy_object['money'] * (1 - buy_object['loanlimit']);
			var loan = buy_object['money'] * buy_object['loanlimit'];
			var buyfee = buy_object['money'] * buy_object['buyfee'];
			var loanMonthRate = buy_object['loanrate']/12;

			//calculate buy init cost
			var initCost = firstPay + buyfee;
			$("#buy-initcost").text(Math.round(initCost) + " 元");

			//calculate buy total loan

			var totalLoan = 0, loanPerYear = 0, loanPerMonth = 0;

			if(buy_object['loanrate'] == 0){
				loanPerMonth = loan/(buy_object['loantime']*12)
				loanPerYear = loanPerMonth*12;
				totalLoan = loan;
			}
			else{
				loanPerMonth = (loan * loanMonthRate) / (1 - Math.pow(1 + loanMonthRate, buy_object['loantime']*(-12)));
				loanPerYear = loanPerMonth * 12;
				totalLoan = loanPerYear * Math.min(buy_object['time'], buy_object['loantime']);
			}
			$("#buy-totalloan").text(Math.round(totalLoan) + " 元");

			//calculate buy total tax
			var totalTax = buy_object['money'] * buy_object['housetax'] * buy_object['time'];
			$("#buy-totaltax").text(Math.round(totalTax) + " 元");

			//calculate buy oppotunity cost
			var initCostOppo = initCost*Math.pow(1+actual_invest_return, buy_object['time']) - initCost;
			var taxOppo =  calculateGeoSeries(1 + actual_invest_return, buy_object['time'] - 1, buy_object['money'] * buy_object['housetax'] * (1 + actual_invest_return)) - buy_object['money'] * buy_object['housetax'] * (buy_object['time'] - 1);

			if(buy_object['loantime'] >= buy_object['time'])
				var loanOppo = calculateGeoSeries(1 + actual_invest_return, buy_object['time'] - 1, loanPerYear * (1 + actual_invest_return)) - loanPerYear * Math.min((buy_object['time'] - 1), buy_object['loantime']);
			else
				var loanOppo = calculateGeoSeries(1 + actual_invest_return, buy_object['loantime'], loanPerYear * Math.pow(1+actual_invest_return, buy_object['time'] - buy_object['loantime'])) - loanPerYear * Math.min((buy_object['time'] - 1), buy_object['loantime']);

			$("#buy-oppotunitycost").text(Math.round(initCostOppo + taxOppo + loanOppo) + " 元");

			//calculate buy sell balance
			var sellPrice = buy_object['money'] * Math.pow(1+buy_object['inflat'], buy_object['time']);
			var loanleft = 0;

			if(buy_object['loanrate'] == 0)
				loanleft = Math.max(0, loan - loanPerMonth*buy_object['time']*12);
			else
				loanleft = Math.max(0, loan*Math.pow(1+loanMonthRate, buy_object['time']*12) - loanPerMonth*(Math.pow(1+loanMonthRate, buy_object['time']*12) - 1)/loanMonthRate);

			var sellBalance = sellPrice*(1 - buy_object['sellfee']) - loanleft;
			$("#buy-sellbalance").text(Math.round(sellBalance) + " 元");

			//calculate total cost
			var totalCost = initCost + totalTax + totalLoan + (initCostOppo + taxOppo + loanOppo) - sellBalance;
			$("#buy-totalcost").text(Math.round(totalCost) + " 元");

			return false;	
		});*/

		$("#cal-btn-budget").click(function(){
			budgetObjectInit();

			
			if(budget_object['budgetpermonth'] == 0)
				alert("請輸入正確房貸支出!（不能為0）");
			else if(budget_object['loanlimit'] == 0 || budget_object['loanlimit'] > 100)
				alert("請輸入正確貸款成數!（不能為0也不能超過100）");
			else if(budget_object['loantime'] == 0)
				alert("請輸入正確房貸年限!（不能為0）");
			else if(budget_object['square'] == 0)
				alert("請輸入正確房屋坪數!（不能為0）");
			else if (city_chose_budget == "")
				alert("請選擇想居住的縣市!");
			else{
				updateInputValuesBudget();

				var loanMonthRate = budget_object['loanrate']/12;

				if(budget_object['loanrate'] == 0)
					var loan = budget_object['budgetpermonth'] * budget_object['loantime']*12;
				else
					var loan = budget_object['budgetpermonth'] * (1 - Math.pow(1 + loanMonthRate, budget_object['loantime']*(-12))) / loanMonthRate;

				var house_price = loan / budget_object['loanlimit'];

				var firstPay = house_price * (1 - budget_object['loanlimit']);

				var pricePerSquare = house_price / budget_object['square'];

				// console.log(pricePerSquare);

				var distsArr = [];

				for (var i in city_dict[city_chose_budget]){
					var temp = {};
					temp['dist'] = i;
					temp['pricepsquare'] = parseFloat(city_dict[city_chose_budget][i]);
					distsArr.push(temp);
				}


				distsArr.sort(function(a, b){
					return b.pricepsquare - a.pricepsquare;
				});

				// console.log(distsArr);

				distsStr = "";

				count = 0;

				for (var i in distsArr){
					if(distsArr[i]['pricepsquare'] < pricePerSquare){
						if(count != 0)
							distsStr += "、";
						distsStr += distsArr[i]['dist'];
						count++;
					}
				}

				// console.log(distsStr);

				if(distsStr.length == 0)
					distsStr = "沒有符合的地區";

				$("#budget-result").html("採本息平均攤還法<br>推算可購買的房屋總價為<span class = 'budget-big-font'>" + thousandComma(Math.round(house_price)) + "元</span><br>可貸款金額為<span class = 'budget-big-font'>" + thousandComma(Math.round(loan)) + "元</span><br>須準備自備款<span class = 'budget-big-font'>" + thousandComma(Math.round(firstPay)) + "元</span><br>若想住" + budget_object['square'] + "坪的房屋，估算每坪單價約<span class = 'budget-big-font'>" + thousandComma(Math.round(pricePerSquare)) + "元</span><br><br>" + city_chose_budget + "每坪單價在" + thousandComma(Math.round(pricePerSquare)) + "元以下的地區：<br>" + distsStr );

				$("#budget-result-container").css("display", "table");
			}


			return false;
		});


	});

	/*d3.csv("data/sixcities_dists_equal.csv", function(data_equal_rent){
		console.log(data_equal_rent);

		for (var i in data_equal_rent){
			var dist_chart_container = d3.select("#equal-rent-chart").append("div").attr("class", "dist-chart-container");
			dist_chart_container.append("div").attr("class", "dists fl-left myfont");
			dist_chart_container.append("div").attr("class", "equal-bar fl-left");
		}
	});*/

	d3.csv("data/building_trading.csv", function(data_trading){
		d3.csv("data/house_price_point.csv", function(data_point){
			var arr_trading = [], arr_point = [];

			for(var i = 0; i < 5; i++){
				arr_trading.push([]);
				arr_point.push([]);
			}

			for(var i in data_trading){
				arr_trading[0].push(parseInt(data_trading[i]['台北市']));
				arr_trading[1].push(parseInt(data_trading[i]['新北市']));
				arr_trading[2].push(parseInt(data_trading[i]['桃園市']));
				arr_trading[3].push(parseInt(data_trading[i]['台中市']));
				arr_trading[4].push(parseInt(data_trading[i]['高雄市']));

				arr_point[0].push(parseFloat(data_point[i]['台北市']));
				arr_point[1].push(parseFloat(data_point[i]['新北市']));
				arr_point[2].push(parseFloat(data_point[i]['桃園市']));
				arr_point[3].push(parseFloat(data_point[i]['台中市']));
				arr_point[4].push(parseFloat(data_point[i]['高雄市']));
			}

			for(var i = 0; i < 5; i++){
				var temp = {};
				temp['trading'] = arr_trading[i];
				temp['point'] = arr_point[i];

				trading_point_arr.push(temp);
			}

			console.log(trading_point_arr);

			$(".nav-option").click(function(){
				var click_num = parseInt($(this).attr("id").split("-")[2]);

				

				if(click_num != nav_selected){
					$("#nav-option-" + nav_selected).css("opacity", 0.5);
					$("#nav-option-" + nav_selected).css("border-bottom", "none");
					$(this).css("opacity", 1);
					$(this).css("border-bottom", "2px solid #808080");

					var chart = $('#trading-houseprice-chart').highcharts();

					chart.series[0].setData(trading_point_arr[click_num]['trading']);
					chart.series[1].setData(trading_point_arr[click_num]['point']);

					console.log(chart.series);

					nav_selected = click_num;
				}
			});

			$(".nav-img").click(function(){
				var click_direction = $(this).attr("id").split("-")[1];

				if(click_direction == "left"){
					if(nav_selected != 0){
						$("#nav-option-" + nav_selected).css("opacity", 0.5);
						$("#nav-option-" + nav_selected).css("border-bottom", "none");
						$("#nav-option-" + (nav_selected-1)).css("opacity", 1);
						$("#nav-option-" + (nav_selected-1)).css("border-bottom", "2px solid #808080");

						var chart = $('#trading-houseprice-chart').highcharts();

						chart.series[0].setData(trading_point_arr[nav_selected-1]['trading']);
						chart.series[1].setData(trading_point_arr[nav_selected-1]['point']);

						nav_selected = nav_selected - 1;
					}
				}
				else{
					if(nav_selected != 4){
						$("#nav-option-" + nav_selected).css("opacity", 0.5);
						$("#nav-option-" + nav_selected).css("border-bottom", "none");
						$("#nav-option-" + (nav_selected+1)).css("opacity", 1);
						$("#nav-option-" + (nav_selected+1)).css("border-bottom", "2px solid #808080");

						var chart = $('#trading-houseprice-chart').highcharts();

						chart.series[0].setData(trading_point_arr[nav_selected+1]['trading']);
						chart.series[1].setData(trading_point_arr[nav_selected+1]['point']);

						nav_selected = nav_selected + 1;
					}
				}
			});
		});
	});

	

	$('#trading-houseprice-chart').highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: '建物買賣交易量與信義房價指數變化'
        },
        
        xAxis: [{
            categories: ['2013Q1',	'2013Q2',	'2013Q3',	'2013Q4',	'2014Q1',	'2014Q2',	'2014Q3',	'2014Q4',	'2015Q1',	'2015Q2'],
            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
           
            labels: {
                format: '{value}',
                
               style: {
                    color:'#4D4D4D',
                }
            },
            title: {
                text: '',
               
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }, { // Secondary yAxis
       
            title: {
                text: '棟',
               
                 style: {
                    color:'#00ABC7',
                }
            },
            labels: {
                format: '{value} ',
               
                style: {
                    color:'#00ABC7',
                }
            },
            opposite: true
        }],
        tooltip: {
            shared: true
        },
        legend: {
             reversed: true,
            borderWidth: 0,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        credits:{enabled:false},
        series: [{
            name: '建物買賣交易量',
            type: 'column',
            color: '#00ABC7',
            yAxis: 1,
            data: [9201,	10846,	9918,	9531,	8214,	8480,	7510,	7819,	6478,	6583],
            tooltip: {
                valueSuffix: '棟'
            }

        }, {
            name: '信義房價指數',
            type: 'spline',
            color: '#4D4D4D',
            data: [284.55,
				292.94,
				294.89,
				304.85,
				298.5,
				310.2,
				297.45,
				294.26,
				302.06,
				289.6],
            tooltip: {
                valueSuffix: ''
            }
        }]
    });

});

function rentObjectInit(){
	// rent_object['square'] = isNaN(parseInt($("#rent-square").val()))? 0 : parseInt($("#rent-square").val());
	rent_object['money'] = isNaN(parseInt($("#rent-money").val().replace(/[,]+/g,"")))? 0 : parseInt($("#rent-money").val().replace(/[,]+/g,""));
	rent_object['time'] = isNaN(parseInt($("#rent-time").val().replace(/[,]+/g,"")))? 0 : parseInt($("#rent-time").val().replace(/[,]+/g,""));
	rent_object['deposit'] = isNaN(parseFloat($("#rent-deposit").val().replace(/[,]+/g,"")))? 0 : parseFloat($("#rent-deposit").val().replace(/[,]+/g,""));
	rent_object['inflat'] = isNaN(parseFloat($("#rent-inflat").val().replace(/[,]+/g,"")))? 0 : parseFloat($("#rent-inflat").val().replace(/[,]+/g,""))/100;
	rent_object['fee'] = isNaN(parseFloat($("#rent-agentfee").val().replace(/[,]+/g,"")))? 0 : parseFloat($("#rent-agentfee").val().replace(/[,]+/g,""))/100;
	// rent_object['investreturn'] = isNaN(parseInt($("#rent-investreturn").val()))? 0 : parseInt($("#rent-investreturn").val());
}

function buyObjectInit(){
	buy_object['square'] = isNaN(parseInt($("#buy-square").val().replace(/[,]+/g,"")))? 0 : parseInt($("#buy-square").val().replace(/[,]+/g,""));
	buy_object['money'] = isNaN(parseInt($("#buy-money").val().replace(/[,]+/g,"")))? 0 : parseInt($("#buy-money").val().replace(/[,]+/g,""));
	buy_object['time'] = isNaN(parseInt($("#buy-time").val().replace(/[,]+/g,"")))? 0 : parseInt($("#buy-time").val().replace(/[,]+/g,""));
	buy_object['loanlimit'] = isNaN(parseFloat($("#buy-loanlimit").val().replace(/[,]+/g,"")))? 0 : parseFloat($("#buy-loanlimit").val().replace(/[,]+/g,""))/100;
	buy_object['loantime'] = isNaN(parseInt($("#buy-loantime").val().replace(/[,]+/g,"")))? 0 : parseInt($("#buy-loantime").val().replace(/[,]+/g,""));
	buy_object['loanrate'] = isNaN(parseFloat($("#buy-loanrate").val().replace(/[,]+/g,"")))? 0 : parseFloat($("#buy-loanrate").val().replace(/[,]+/g,""))/100;
	buy_object['inflat'] = isNaN(parseFloat($("#buy-houseinflat").val().replace(/[,]+/g,"")))? 0 : parseFloat($("#buy-houseinflat").val().replace(/[,]+/g,""))/100;
	buy_object['buyfee'] = isNaN(parseFloat($("#buy-buyfee").val().replace(/[,]+/g,"")))? 0 : parseFloat($("#buy-buyfee").val().replace(/[,]+/g,""))/100;
	buy_object['sellfee'] = isNaN(parseFloat($("#buy-sellfee").val().replace(/[,]+/g,"")))? 0 : parseFloat($("#buy-sellfee").val().replace(/[,]+/g,""))/100;
	buy_object['housetax'] = isNaN(parseFloat($("#buy-housetax").val().replace(/[,]+/g,"")))? 0 : parseInt($("#buy-housetax").val().replace(/[,]+/g,""));
}

function budgetObjectInit(){
	budget_object['budgetpermonth'] = isNaN(parseInt($("#budget-budgetpermonth").val().replace(/[,]+/g,"")))? 0 : parseInt($("#budget-budgetpermonth").val().replace(/[,]+/g,""));
	budget_object['loanlimit'] = isNaN(parseFloat($("#budget-loanlimit").val().replace(/[,]+/g,"")))? 0 : parseFloat($("#budget-loanlimit").val().replace(/[,]+/g,""))/100;
	budget_object['loantime'] = isNaN(parseInt($("#budget-loantime").val().replace(/[,]+/g,"")))? 0 : parseInt($("#budget-loantime").val().replace(/[,]+/g,""));
	budget_object['loanrate'] = isNaN(parseFloat($("#budget-loanrate").val().replace(/[,]+/g,"")))? 0 : parseFloat($("#budget-loanrate").val().replace(/[,]+/g,""))/100;
	budget_object['square'] = isNaN(parseInt($("#budget-square").val().replace(/[,]+/g,"")))? 0 : parseInt($("#budget-square").val().replace(/[,]+/g,""));
}

function updateInputValuesRent(){
	// $("#rent-square").val(rent_object['square'] + " 坪");
	$("#rent-money").val(thousandComma(rent_object['money']) );
	$("#rent-time").val(thousandComma(rent_object['time']) );
	$("#rent-deposit").val(thousandComma(rent_object['deposit']) );
	$("#rent-inflat").val(thousandComma(rent_object['inflat']*100) );
	$("#rent-agentfee").val(thousandComma(rent_object['fee']*100) );
	// $("#rent-investreturn").val(rent_object['investreturn'] + " %");
}

function updateInputValuesBuy(){
	$("#buy-square").val(thousandComma(buy_object['square']) );
	$("#buy-money").val(thousandComma(buy_object['money']) );
	$("#buy-time").val(thousandComma(buy_object['time']) );
	$("#buy-loanlimit").val(thousandComma(buy_object['loanlimit']*100) );
	$("#buy-loantime").val(thousandComma(buy_object['loantime']) );
	$("#buy-loanrate").val(thousandComma(buy_object['loanrate']*100) );
	$("#buy-houseinflat").val(thousandComma(buy_object['inflat']*100) );
	$("#buy-buyfee").val(thousandComma(buy_object['buyfee']*100) );
	$("#buy-sellfee").val(thousandComma(buy_object['sellfee']*100) );
	$("#buy-housetax").val(thousandComma(Math.round(buy_object['housetax'])) );
}

function updateInputValuesBudget(){
	$("#budget-budgetpermonth").val(thousandComma(budget_object['budgetpermonth']) );
	$("#budget-loanlimit").val(thousandComma(budget_object['loanlimit']*100) );
	$("#budget-loantime").val(thousandComma(budget_object['loantime']) );
	$("#budget-loanrate").val(thousandComma(budget_object['loanrate']*100) );
	$("#budget-square").val(thousandComma(budget_object['square']) );
}

function initAllValues(){
	city_chose_buy = "台北市";
	dist_chose_buy = "萬華區";

	$("#dropdownMenu-city-buy").html(city_chose_buy + "<span><img src='img/popdown.png'></span>");

	for (var j in Object.keys(city_dict[city_chose_buy])){
		d3.select(".dropdown-dist-buy").append("li").append("a").text(Object.keys(city_dict[city_chose_buy])[j]);
	}

	$("#dropdownMenu-dist-buy").html("萬華區 <span><img src='img/popdown.png'></span>");

	$("#rent-money").val(thousandComma(30000));
	$("#rent-time").val("20");
	$("#rent-deposit").val("1");
	$("#rent-inflat").val("1");
	$("#rent-agentfee").val("50");

	$("#buy-square").val("30");
	$("#buy-time").val("20");
	$("#buy-money").val(thousandComma(Math.round(parseFloat(city_dict[city_chose_buy]['萬華區']) * 30)));
	$("#buy-loanlimit").val("70");
	$("#buy-loantime").val("20");
	$("#buy-loanrate").val("2");
	$("#buy-houseinflat").val("0");
	$("#buy-buyfee").val("2");
	$("#buy-sellfee").val("4");

	$("#invest-return").val("1");

	city_chose_budget = "新北市";
	$("#budget-budgetpermonth").val(thousandComma(30000));
	$("#budget-loanlimit").val("70");
	$("#budget-loantime").val("20");
	$("#budget-loanrate").val("2");
	$("#budget-square").val("30");
	$("#dropdownMenu-budget").html("新北市<span><img src='img/popdown.png'></span>");

}

function updateEnvironment(){
	$("#invest-return").val(thousandComma(investreturn*100) );
	// $("#currency-inflat").val(currencyinflat*100 + " %");
	// $("#actual-return").text(actual_invest_return*100 + " %");
}

function calculateGeoSeries(commonRatio, years, firstEle){
	var total = 0;

	for (var i = 0; i < years; i++){
		total += firstEle * Math.pow(commonRatio, i);
	}

	return total;
}

function thousandComma(number){

	 var num = number.toString();
	 var pattern = /(-?\d+)(\d{3})/;
	  
	 while(pattern.test(num))
	 {
	  num = num.replace(pattern, "$1,$2");
	  
	 }
	 return num;
 
}

function initCal (){
			buyObjectInit();
			updateInputValuesBuy();
			rentObjectInit();
			// console.log(rent_object);
			updateInputValuesRent();

			investreturn = isNaN(parseFloat($("#invest-return").val()))? 0 : parseFloat($("#invest-return").val())/100;
			// currencyinflat = isNaN(parseInt($("#currency-inflat").val()))? 0 : parseInt($("#currency-inflat").val())/100;
			actual_invest_return = investreturn;

			updateEnvironment();

			var firstPay = buy_object['money'] * (1 - buy_object['loanlimit']);
			var loan = buy_object['money'] * buy_object['loanlimit'];
			var buyfee = buy_object['money'] * buy_object['buyfee'];
			var loanMonthRate = buy_object['loanrate']/12;

			//calculate buy init cost
			var initCost = firstPay + buyfee;
			$("#buy-initcost").text("$" + thousandComma(Math.round(initCost)));

			//calculate buy total loan

			var totalLoan = 0, loanPerYear = 0, loanPerMonth = 0;

			if(buy_object['loanrate'] == 0){
				if(buy_object['loantime'] == 0) 
					loanPerMonth = 0;
				else
					loanPerMonth = loan/(buy_object['loantime']*12);
				loanPerYear = loanPerMonth*12;
				totalLoan = loan;
			}
			else{
				if(buy_object['loantime'] == 0) 
					loanPerMonth = 0;
				else
					loanPerMonth = (loan * loanMonthRate) / (1 - Math.pow(1 + loanMonthRate, buy_object['loantime']*(-12)));
				loanPerYear = loanPerMonth * 12;
				totalLoan = loanPerYear * Math.min(buy_object['time'], buy_object['loantime']);
			}
			$("#buy-totalloan").text("$" + thousandComma(Math.round(totalLoan)));

			//calculate buy total tax
			var totalTax = buy_object['housetax'] * buy_object['time'];
			$("#buy-totaltax").text("$" + thousandComma(Math.round(totalTax)));

			//calculate buy oppotunity cost
			var initCostOppo = initCost*Math.pow(1+actual_invest_return, buy_object['time']) - initCost;
			var taxOppo =  calculateGeoSeries(1 + actual_invest_return, buy_object['time'] - 1, buy_object['housetax'] * (1 + actual_invest_return)) - buy_object['housetax'] * (buy_object['time'] - 1);

			if(buy_object['loantime'] >= buy_object['time'])
				var loanOppo = calculateGeoSeries(1 + actual_invest_return, buy_object['time'] - 1, loanPerYear * (1 + actual_invest_return)) - loanPerYear * Math.min((buy_object['time'] - 1), buy_object['loantime']);
			else
				var loanOppo = calculateGeoSeries(1 + actual_invest_return, buy_object['loantime'], loanPerYear * Math.pow(1+actual_invest_return, buy_object['time'] - buy_object['loantime'])) - loanPerYear * Math.min((buy_object['time'] - 1), buy_object['loantime']);

			$("#buy-oppotunitycost").text("$" + thousandComma(Math.round(initCostOppo + taxOppo + loanOppo)));

			//calculate buy sell balance
			var sellPrice = buy_object['money'] * Math.pow(1+buy_object['inflat'], buy_object['time']);
			var loanleft = 0;

			if(buy_object['loanrate'] == 0)
				loanleft = Math.max(0, loan - loanPerMonth*buy_object['time']*12);
			else
				loanleft = Math.max(0, loan*Math.pow(1+loanMonthRate, buy_object['time']*12) - loanPerMonth*(Math.pow(1+loanMonthRate, buy_object['time']*12) - 1)/loanMonthRate);

			var sellBalance = sellPrice*(1 - buy_object['sellfee']) - loanleft;
			$("#buy-sellbalance").text("- $" + thousandComma(Math.round(sellBalance)));

			//calculate total cost
			var totalCost = initCost + totalTax + totalLoan + (initCostOppo + taxOppo + loanOppo) - sellBalance;
			$("#buy-totalcost").text("$" + thousandComma(Math.round(totalCost)) );

			//calculate rent init cost
			var initCost_rent = rent_object['money'] * (rent_object['deposit'] + rent_object['fee']);
			$("#rent-initcost").text("$" + thousandComma(Math.round(initCost_rent)));

			//calculate rent total money 
			var totalMoney_rent = calculateGeoSeries(1+rent_object['inflat'], rent_object['time'], rent_object['money']*12);
			$("#rent-totalmoney").text("$" + thousandComma(Math.round(totalMoney_rent)) );

			//calculate rent oppotunity cost
			var initCostOppo_rent = initCost_rent * (Math.pow(1+actual_invest_return, rent_object['time']) - 1);
			var totalMoneyOppo_rent = calculateGeoSeries( (1+actual_invest_return)/(1+rent_object['inflat']), rent_object['time'], rent_object['money']*12*Math.pow(1+rent_object['inflat'], rent_object['time'] - 1)) - totalMoney_rent;
			$("#rent-oppotunitycost").text("$" + thousandComma(Math.round(totalMoneyOppo_rent + initCostOppo_rent)) );

			//calculate rent deposit back
			var depositBack_rent = rent_object['money'] * rent_object['deposit'];
			$("#rent-depositback").text("- $" + thousandComma(Math.round(depositBack_rent)) );

			//calculate total cost
			var totalCost_rent = initCost_rent + initCostOppo_rent + totalMoney_rent + totalMoneyOppo_rent - depositBack_rent;
			$("#rent-totalcost").text("$" + thousandComma(Math.round(totalCost_rent)) );

			if(totalCost > totalCost_rent){
				$("#rent-buy-compare-text-total").text(buy_object["time"] + "年買房比租房多花");
				$("#rent-buy-compare-num-total").html("$" + thousandComma(Math.round(totalCost - totalCost_rent)));
				$("#rent-buy-compare-text-permonth").text("每個月買房比租房多花");
				$("#rent-buy-compare-num-permonth").html("$" + thousandComma(Math.round((totalCost - totalCost_rent)/(buy_object['time']*12))));
				$("#rent-buy-compare-img img").attr("src", "img/rent_better.png");
				$("#buy-check-img img").attr("src", "img/uncheck.png");
				$("#rent-check-img img").attr("src", "img/check.png");
			}

			else{
				$("#rent-buy-compare-text-total").text(buy_object["time"] + "年租房比買房多花");
				$("#rent-buy-compare-num-total").html("$" + thousandComma(Math.round(totalCost_rent - totalCost)));
				$("#rent-buy-compare-text-permonth").text("每個月租房比買房多花");
				$("#rent-buy-compare-num-permonth").html("$" + thousandComma(Math.round((totalCost_rent - totalCost)/(buy_object['time']*12))));
				$("#rent-buy-compare-img img").attr("src", "img/buy_better.png");
				$("#buy-check-img img").attr("src", "img/check.png");
				$("#rent-check-img img").attr("src", "img/uncheck.png");
			}

			$("#rent-buy-result-container").css("display", "table");

			budgetObjectInit();

			updateInputValuesBudget();

				var loanMonthRate = budget_object['loanrate']/12;

				if(budget_object['loanrate'] == 0)
					var loan = budget_object['budgetpermonth'] * budget_object['loantime']*12;
				else
					var loan = budget_object['budgetpermonth'] * (1 - Math.pow(1 + loanMonthRate, budget_object['loantime']*(-12))) / loanMonthRate;

				var house_price = loan / budget_object['loanlimit'];

				var firstPay = house_price * (1 - budget_object['loanlimit']);

				var pricePerSquare = house_price / budget_object['square'];

				// console.log(pricePerSquare);

				var distsArr = [];

				for (var i in city_dict[city_chose_budget]){
					var temp = {};
					temp['dist'] = i;
					temp['pricepsquare'] = parseFloat(city_dict[city_chose_budget][i]);
					distsArr.push(temp);
				}


				distsArr.sort(function(a, b){
					return b.pricepsquare - a.pricepsquare;
				});

				// console.log(distsArr);

				distsStr = "";

				count = 0;

				for (var i in distsArr){
					if(distsArr[i]['pricepsquare'] < pricePerSquare){
						if(count != 0)
							distsStr += "、";
						distsStr += distsArr[i]['dist'];
						count++;
					}
				}

				// console.log(distsStr);

				if(distsStr.length == 0)
					distsStr = "沒有符合的地區";

				$("#budget-result").html("採本息平均攤還法<br>推算可購買的房屋總價為<span class = 'budget-big-font'>" + thousandComma(Math.round(house_price)) + "元</span><br>可貸款金額為<span class = 'budget-big-font'>" + thousandComma(Math.round(loan)) + "元</span><br>須準備自備款<span class = 'budget-big-font'>" + thousandComma(Math.round(firstPay)) + "元</span><br>若想住" + budget_object['square'] + "坪的房屋，估算每坪單價約<span class = 'budget-big-font'>" + thousandComma(Math.round(pricePerSquare)) + "元</span><br><br>" + city_chose_budget + "每坪單價在" + thousandComma(Math.round(pricePerSquare)) + "元以下的地區：<br>" + distsStr );

				$("#budget-result-container").css("display", "table");
}
