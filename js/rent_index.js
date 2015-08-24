var city_dict = {};
// var city_chose_rent = "";
var city_chose_budget = "";
var city_chose_buy = "";
var dist_chose_buy = "";
var rent_object = {};
var buy_object = {};
var budget_object = {};
var investreturn = 0;
var currencyinflat = 0;
var actual_invest_return = 0;
var house_tax = 0.2*0.012;

var taiperDistsList = ["中正區", "大同區", "中山區", "松山區", "大安區", "萬華區", "信義區", "士林區", "北投區", "內湖區", "南港區", "文山區"];

//---------------------------------------------------------------------------

if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 // some code..
 // window.location.href = "http://p.udn.com.tw/upf/newmedia/2015_data/20150729_tv_data/udn_tv_data_m/index.html";
}

$(document).ready(function(){

	$("#first-cover").height($(window).height());

	rentObjectInit();

	// console.log(rent_object);

	d3.csv("data/city_dist_avgmoney_real.csv", function(data_avgmoney){
		// console.log(data_avgmoney);
		for (var i in data_avgmoney){
			// console.log(data_avgmoney[i]);
			if (data_avgmoney[i]['city'] in city_dict == false){
				city_dict[data_avgmoney[i]['city']] = {}
			}

			city_dict[data_avgmoney[i]['city']][data_avgmoney[i]['dist']] = data_avgmoney[i]['avg-square-money'];
		}

		// console.log(city_dict);
		for (var i in Object.keys(city_dict)){
			d3.select(".dropdown-city-rent").append("li").append("a").text(Object.keys(city_dict)[i]);
			d3.select(".dropdown-city-buy").append("li").append("a").text(Object.keys(city_dict)[i]);
			d3.select(".dropdown-budget").append("li").append("a").text(Object.keys(city_dict)[i]);
		}

		$(".dropdown-budget li").click(function(){
			var city_clicked = $(this).find("a").text();

			if(city_clicked != city_chose_budget){
				$("#dropdownMenu-budget").html(city_clicked + "<span class='caret'></span>");

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
				$("#dropdownMenu-city-buy").html(city_clicked + "<span class='caret'></span>");

				var myNode = document.getElementsByClassName("dropdown-dist-buy")[0];
				while (myNode.firstChild) {
				    myNode.removeChild(myNode.firstChild);
				}

				// console.log($("#dropdownMenu-city-buy").text());
				for (var j in Object.keys(city_dict[city_clicked])){
					d3.select(".dropdown-dist-buy").append("li").append("a").text(Object.keys(city_dict[city_clicked])[j]);
				}

				$("#dropdownMenu-dist-buy").html("地區 <span class='caret'></span>");
				$("#buy-money").val("");

				city_chose_buy = city_clicked;

				$(".dropdown-dist-buy li").click(function(){
					// console.log("hi");
					var dist_clicked = $(this).find("a").text();
					// console.log(dist_clicked);

					if(dist_clicked != dist_chose_buy){
						$("#dropdownMenu-dist-buy").html(dist_clicked + "<span class='caret'></span>");
						// console.log(parseInt($("#buy-square").val()));
						if(!isNaN(parseFloat($("#buy-square").val()))){
							var squs = parseFloat($("#buy-square").val());

							$("#buy-money").val(Math.round(squs * parseFloat(city_dict[city_chose_buy][dist_clicked])));
						}

						dist_chose_buy = dist_clicked;
					}
				});

				$("#buy-square").blur(function(){
					if(!isNaN(parseFloat(city_dict[city_chose_buy][dist_chose_buy])) && !isNaN(parseInt($("#buy-square").val()))){
						var squs = parseFloat($("#buy-square").val());
						$("#buy-money").val(Math.round(squs * parseFloat(city_dict[city_chose_buy][dist_chose_buy])));
					}
				});
			}


		});

		$("#cal-btn-rent").click(function(){
			rentObjectInit();
			// console.log(rent_object);
			updateInputValuesRent();

			investreturn = isNaN(parseInt($("#invest-return").val()))? 0 : parseInt($("#invest-return").val())/100;
			// currencyinflat = isNaN(parseInt($("#currency-inflat").val()))? 0 : parseInt($("#currency-inflat").val())/100;
			actual_invest_return = investreturn*0.85;

			// console.log("actual_invest_return = " + actual_invest_return);

			updateEnvironment();

			//calculate rent init cost
			var initCost = rent_object['money'] * (rent_object['deposit'] + rent_object['fee']);
			$("#rent-initcost").text(Math.round(initCost) + " 元");

			//calculate rent total money 
			var totalMoney = calculateGeoSeries(1+rent_object['inflat'], rent_object['time'], rent_object['money']*12);
			$("#rent-totalmoney").text(Math.round(totalMoney) + " 元");

			//calculate rent oppotunity cost
			var initCostOppo = initCost * (Math.pow(1+actual_invest_return, rent_object['time']) - 1);
			var totalMoneyOppo = calculateGeoSeries( (1+actual_invest_return)/(1+rent_object['inflat']), rent_object['time'], rent_object['money']*12*Math.pow(1+rent_object['inflat'], rent_object['time'] - 1)) - totalMoney;
			$("#rent-oppotunitycost").text(Math.round(totalMoneyOppo + initCostOppo) + " 元");

			//calculate rent deposit back
			var depositBack = rent_object['money'] * rent_object['deposit'];
			$("#rent-depositback").text(Math.round(depositBack) + " 元");

			//calculate total cost
			var totalCost = initCost + initCostOppo + totalMoney + totalMoneyOppo - depositBack;
			$("#rent-totalcost").text(Math.round(totalCost) + " 元");

			return false;
		});

		$("#cal-btn-buy").click(function(){
			buyObjectInit();
			updateInputValuesBuy();

			investreturn = isNaN(parseInt($("#invest-return").val()))? 0 : parseInt($("#invest-return").val())/100;
			// currencyinflat = isNaN(parseInt($("#currency-inflat").val()))? 0 : parseInt($("#currency-inflat").val())/100;
			actual_invest_return = investreturn*0.85;

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
			var totalTax = buy_object['money'] * house_tax * buy_object['time'];
			$("#buy-totaltax").text(Math.round(totalTax) + " 元");

			//calculate buy oppotunity cost
			var initCostOppo = initCost*Math.pow(1+actual_invest_return, buy_object['time']) - initCost;
			var taxOppo =  calculateGeoSeries(1 + actual_invest_return, buy_object['time'] - 1, buy_object['money'] * house_tax * (1 + actual_invest_return)) - buy_object['money'] * house_tax * (buy_object['time'] - 1);

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
		});

		$("#cal-btn-budget").click(function(){
			budgetObjectInit();

			if (city_chose_budget == "")
				alert("請選擇想居住的縣市!");
			else if(budget_object['budgetpermonth'] == 0)
				alert("請輸入正確房貸支出!（不能為0）");
			else if(budget_object['loanlimit'] == 0 || budget_object['loanlimit'] > 100)
				alert("請輸入正確貸款成數!（不能為0也不能超過100）");
			else if(budget_object['loantime'] == 0)
				alert("請輸入正確房貸年限!（不能為0）");
			else if(budget_object['square'] == 0)
				alert("請輸入正確房屋坪數!（不能為0）");
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

				console.log(pricePerSquare);

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

				console.log(distsArr);

				distsStr = "";

				count = 0;

				for (var i in distsArr){
					if(distsArr[i]['pricepsquare'] < pricePerSquare){
						if(count >= 10)
							break;
						if(count != 0)
							distsStr += "、";
						distsStr += distsArr[i]['dist'];
						count++;
					}
				}

				console.log(distsStr);

				if(distsStr.length == 0)
					distsStr = "沒有符合的區域";

				$("#budget-result").html("採本息平均攤還法<br>推算可購買的房屋總價為" + house_price + "元<br>可貸款金額為" + loan + "元，須準備自備款" + firstPay + "元<br>若想住" + budget_object['square'] + "坪的房屋，估算每坪單價約" + pricePerSquare + "元<br>依所選縣市可居住的區域為：" + distsStr + "。" );

			}

			return false;
		});


	});

	d3.json("data/taipei_dists_equal.json", function(data_equal_rent){
		console.log(data_equal_rent);
		// var reverseArr = [];

		/*$('#taipei-equalrent-chart').highcharts({
	        title: {
	            text: 'Monthly Average Temperature',
	            x: -20 //center
	        },
	        credits: {
	        	enabled: false
	        },
	        subtitle: {
	            text: 'Source: WorldClimate.com',
	            x: -20
	        },
	        xAxis: {
	            categories: [10, 15, 20, 25, 30, 35, 40]
	        },
	        yAxis: {
	            title: {
	                text: '租金（元）'
	            },
	            plotLines: [{
	                value: 0,
	                width: 1,
	                color: '#808080'
	            }]
	        },
	        tooltip: {
	            valueSuffix: '元'
	        },
	        legend: {
	            layout: 'vertical',
	            align: 'right',
	            verticalAlign: 'middle',
	            borderWidth: 0
	        },
	        series: data_equal_rent
	    });*/

		$('#taipei-equalrent-chart').highcharts({
	        chart: {
	            type: 'bar'
	        },
	        title: {
	            text: 'Stacked bar chart'
	        },
	        xAxis: {
	            categories: taiperDistsList
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: 'Total fruit consumption'
	            }
	        },
	        legend: {
	            reversed: true
	        },
	        plotOptions: {
	            series: {
	                stacking: 'normal'
	            }
	        },
	        series: data_equal_rent
	    });
	});

});

function rentObjectInit(){
	// rent_object['square'] = isNaN(parseInt($("#rent-square").val()))? 0 : parseInt($("#rent-square").val());
	rent_object['money'] = isNaN(parseInt($("#rent-money").val()))? 0 : parseInt($("#rent-money").val());
	rent_object['time'] = isNaN(parseInt($("#rent-time").val()))? 0 : parseInt($("#rent-time").val());
	rent_object['deposit'] = isNaN(parseFloat($("#rent-deposit").val()))? 0 : parseFloat($("#rent-deposit").val());
	rent_object['inflat'] = isNaN(parseFloat($("#rent-inflat").val()))? 0 : parseFloat($("#rent-inflat").val())/100;
	rent_object['fee'] = isNaN(parseFloat($("#rent-agentfee").val()))? 0 : parseFloat($("#rent-agentfee").val())/100;
	// rent_object['investreturn'] = isNaN(parseInt($("#rent-investreturn").val()))? 0 : parseInt($("#rent-investreturn").val());
}

function buyObjectInit(){
	buy_object['square'] = isNaN(parseInt($("#buy-square").val()))? 0 : parseInt($("#buy-square").val());
	buy_object['money'] = isNaN(parseInt($("#buy-money").val()))? 0 : parseInt($("#buy-money").val());
	buy_object['time'] = isNaN(parseInt($("#buy-time").val()))? 0 : parseInt($("#buy-time").val());
	buy_object['loanlimit'] = isNaN(parseFloat($("#buy-loanlimit").val()))? 0 : parseFloat($("#buy-loanlimit").val())/100;
	buy_object['loantime'] = isNaN(parseInt($("#buy-loantime").val()))? 0 : parseInt($("#buy-loantime").val());
	buy_object['loanrate'] = isNaN(parseFloat($("#buy-loanrate").val()))? 0 : parseFloat($("#buy-loanrate").val())/100;
	buy_object['inflat'] = isNaN(parseFloat($("#buy-houseinflat").val()))? 0 : parseFloat($("#buy-houseinflat").val())/100;
	buy_object['buyfee'] = isNaN(parseFloat($("#buy-buyfee").val()))? 0 : parseFloat($("#buy-buyfee").val())/100;
	buy_object['sellfee'] = isNaN(parseFloat($("#buy-sellfee").val()))? 0 : parseFloat($("#buy-sellfee").val())/100;
}

function budgetObjectInit(){
	budget_object['budgetpermonth'] = isNaN(parseInt($("#budget-budgetpermonth").val()))? 0 : parseInt($("#budget-budgetpermonth").val());
	budget_object['loanlimit'] = isNaN(parseFloat($("#budget-loanlimit").val()))? 0 : parseFloat($("#budget-loanlimit").val())/100;
	budget_object['loantime'] = isNaN(parseInt($("#budget-loantime").val()))? 0 : parseInt($("#budget-loantime").val());
	budget_object['loanrate'] = isNaN(parseFloat($("#budget-loanrate").val()))? 0 : parseFloat($("#budget-loanrate").val())/100;
	budget_object['square'] = isNaN(parseInt($("#budget-square").val()))? 0 : parseInt($("#budget-square").val());
}

function updateInputValuesRent(){
	// $("#rent-square").val(rent_object['square'] + " 坪");
	$("#rent-money").val(rent_object['money'] + " 元");
	$("#rent-time").val(rent_object['time'] + " 年");
	$("#rent-deposit").val(rent_object['deposit'] + " 個月");
	$("#rent-inflat").val(rent_object['inflat']*100 + " %");
	$("#rent-agentfee").val(rent_object['fee']*100 + " %");
	// $("#rent-investreturn").val(rent_object['investreturn'] + " %");
}

function updateInputValuesBuy(){
	$("#buy-square").val(buy_object['square'] + " 坪");
	$("#buy-money").val(buy_object['money'] + " 元");
	$("#buy-time").val(buy_object['time'] + " 年");
	$("#buy-loanlimit").val(buy_object['loanlimit']*100 + " %");
	$("#buy-loantime").val(buy_object['loantime'] + " 年");
	$("#buy-loanrate").val(buy_object['loanrate']*100 + " %");
	$("#buy-houseinflat").val(buy_object['inflat']*100 + " %");
	$("#buy-buyfee").val(buy_object['buyfee']*100 + " %");
	$("#buy-sellfee").val(buy_object['sellfee']*100 + " %");
}

function updateInputValuesBudget(){
	$("#budget-budgetpermonth").val(budget_object['budgetpermonth'] + " 元");
	$("#budget-loanlimit").val(budget_object['loanlimit']*100 + " %");
	$("#budget-loantime").val(budget_object['loantime'] + " 年");
	$("#budget-loanrate").val(budget_object['loanrate']*100 + " %");
	$("#budget-square").val(budget_object['square'] + " 坪");
}

function updateEnvironment(){
	$("#invest-return").val(investreturn*100 + " %");
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
