/**
 * Created by Skif on 25.08.2016.
 */
var files;


$(document).ready(function () {
    google.charts.load('current', {packages: ['corechart', 'bar']});
    //google.charts.setOnLoadCallback(drawBasic);

    // Вешаем функцию на событие
    // Получим данные файлов и добавим их в переменную

    $('input[type=file]').change(function(){
        files = this.files;
    });

    $('.submit.button').click(function( event ){
        event.stopPropagation(); // Остановка происходящего
        event.preventDefault();  // Полная остановка происходящего

        // Создадим данные формы и добавим в них данные файлов из files

        var data = new FormData();
        $.each( files, function( key, value ){
            data.append( key, value );
        });

        // Отправляем запрос

        $.ajax({
            url: './upload.php?uploadfiles',
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false, // Не обрабатываем файлы (Don't process the files)
            contentType: false, // Так jQuery скажет серверу что это строковой запрос
            success: function( respond, textStatus, jqXHR ){
                console.debug(respond);
                // Если все ОК

                if( typeof respond.error === 'undefined' ){
                    // Файлы успешно загружены, делаем что нибудь здесь

                    // выведем пути к загруженным файлам в блок '.ajax-respond'

                    var files_path = respond.files;
                    var html = '';
                    $.each( files_path, function( key, val ){ html += val +'<br>'; } )
                    $('.ajax-respond').html( html );
                    genTable(respond.statistic);
                }
                else{
                    console.log('ОШИБКИ ОТВЕТА сервера: ' + respond.error );
                }
            },
            error: function( jqXHR, textStatus, errorThrown ){
                console.log('ОШИБКИ AJAX запроса: ' + textStatus );
            }
        });

    });

    $('.get-graph').click(function( event ){
        event.stopPropagation(); // Остановка происходящего
        event.preventDefault();  // Полная остановка происходящего

        // Отправляем запрос

        $.ajax({
            url: './upload.php?getdata',
            type: 'POST',
            data: {'old':'file'},
            cache: false,
            dataType: 'json',
            processData: false, // Не обрабатываем файлы (Don't process the files)
            contentType: false, // Так jQuery скажет серверу что это строковой запрос
            success: function( respond, textStatus, jqXHR ){
                console.debug(respond);
                // Если все ОК

                if( typeof respond.error === 'undefined' ){
                    // Файлы успешно загружены, делаем что нибудь здесь

                    // выведем пути к загруженным файлам в блок '.ajax-respond'

                    var files_path = respond.files;
                    var html = '';
                    html += files_path +'<br>';
                    $('.ajax-respond').html( html );
                    genTable(respond.statistic);
                }
                else{
                    console.log('ОШИБКИ ОТВЕТА сервера: ' + respond.error );
                }
            },
            error: function( jqXHR, textStatus, errorThrown ){
                console.log('ОШИБКИ AJAX запроса: ' + textStatus );
            }
        });

    });
});

function genTable(stat){

    console.debug('gentable() start');
    var str = '';
    str = str + '<p class="phone"><b>Заказы с указанным телефоном: </b><span class="phone">' +  addSpaces(stat.countPhone) + '</span></p>';
    str = str + '<p class="email"><b>Заказы только с e-mail: </b><span class="email">' +  addSpaces(stat.countEmail) + '</span></p>';
    str = str + '<p class="email-phone"><b>Общее кол-во заказов тел+email: </b><span class="email-phone">' +  addSpaces(stat.countPhoneEmail) + '</span></p>';
    str = str + '<p class="broken"><b>Заказы без контактов: </b><span class="broken">' +  addSpaces(stat.countBreakLines) + '</span></p>';
    /*
    Данный блок из текстового заменён на табличный
    //str = str + '<p class="orders"><b>Общее количество заказов: </b><span class="orders">' +  addSpaces(parseInt(stat.countBreakLines) + parseInt(stat.countPhoneEmail)) + ' ('  + stat.allOrders+ ')'+ '</span></p>';
    //str = str + '<p class="clients"><b>Общее количество клиентов: </b><span class="single-clients">' +  addSpaces(parseInt(stat.singleClientOrders) + parseInt(stat.doubleClients)) + '</span></p>';
    //str = str + '<p class="check"><b>Оборот: </b><span class="phone">' +  addSpaces(stat.allMoney) + '<i> руб.</i></span></p>';
    //str = str + '<p class="client-sum"><b>Средняя сумма с клиента(по всем заказам): </b><span class="client-sum">' +
    //    addSpaces(parseFloat(parseFloat(stat.allMoney)/(parseInt(stat.singleClientOrders) +
    //        parseInt(stat.doubleClients))).toFixed(2)) + '<i> руб.</i></span></p>';
    //str = str + '<p class="check"><b>Средний чек с заказа(по всем заказам): </b><span class="phone">' +  addSpaces(parseFloat(stat.checkAll).toFixed(2)) + '<i> руб.</i></span></p>';
    */
    console.debug('str - completed!');
    var fullOrders = parseInt(stat.countPhone) + parseInt(stat.countEmail) + parseInt(stat.countBreakLines);

    /*
    Данный блок из текстового заменён на табличный
    //str = str + '<br /><br /><h3>Разовые заказы и разовые клиенты</h3>';
    //str = str + '<p class="single-clients"><b>Разовые клиенты: </b><span class="single-clients">' +  addSpaces(stat.singleClientOrders) + '</span></p>';
    //str = str + '<p class="single-orders"><b>Количество заказов: </b><span class="single-orders">' +  addSpaces(stat.singleClientOrders) + '</span></p>';
    //str = str + '<p class="single-sum"><b>Общая сумма от разовых клиентов: </b><span class="single-sum">' +  addSpaces(stat.singleClientSum) + '<i> руб.</i></span></p>';
    //str = str + '<p class="single-client-sum"><b>Средняя сумма с клиента: </b><span class="single-client-sum">' +  addSpaces(parseFloat(stat.singleClientCheck).toFixed(2)) + '<i> руб.</i></span></p>';
    //str = str + '<p class="single-check"><b>Средний чек: </b><span class="single-check">' +  addSpaces(parseFloat(stat.singleClientCheck).toFixed(2)) + '<i> руб.</i></span></p>';

    //str = str + '<br /><br /><h3>Повторные заказы и постоянные клиенты</h3>';
    //str = str + '<p class="double-clients"><b>Постоянные клиенты: </b><span class="double-clients">' +  addSpaces(stat.doubleClients) + '</span></p>';
    //str = str + '<p class="double-orders"><b>Количество заказов от постоянных клиентов: </b><span class="double-orders">' +  addSpaces(stat.doubleClientsOrders) + '</span></p>';
    //str = str + '<p class="double-sum"><b>Поступившая сумма от постоянных клиентов: </b><span class="double-sum">' +  addSpaces(stat.doubleClientsSum) + '<i> руб.</i></span></p>';
    //str = str + '<p class="double-client-sum"><b>Средняя сумма от клиента: </b><span class="double-client-sum">' +  addSpaces(parseFloat(stat.doubleClientsCheck).toFixed(2)) + '<i> руб.</i></span></p>';
    //str = str + '<p class="double-check"><b>Средний чек: </b><span class="double-check">' +  addSpaces((parseFloat(stat.doubleClientsSum)/parseFloat(stat.doubleClientsOrders)).toFixed(2)) + '<i> руб.</i></span></p>';
    */
    var tableData = '<h3>Сводная таблица</h3><table><tr style="font-weight: bold;text-align: center;"><td>Наименование</td><td>Общие показатели</td><td>Разовые клиенты</td><td>Постоянные клиенты</td></tr>';
    tableData = tableData + '<tr style="background-color:#f9f9f9"><td>Заказы</td><td>' +  addSpaces(stat.allOrders) + '</td><td>'  +
        addSpaces(stat.singleClientOrders) + '</td><td>'  + addSpaces(stat.doubleClientsOrders) + '</td></tr>';

    tableData = tableData + '<tr><td>Клиенты</td><td>' + addSpaces(parseInt(stat.singleClientOrders) + parseInt(stat.doubleClients)) + '</td><td>'  +
            addSpaces(stat.singleClientOrders)+ '</td><td>'  + addSpaces(stat.doubleClients) + '</td></tr>';

    tableData = tableData + '<tr style="background-color:#f9f9f9"><td>Оборот</td><td>' + addSpaces(parseFloat(stat.allMoney).toFixed(2)) + '<i> руб.</i></td><td>'  +
        addSpaces(parseFloat(stat.singleClientSum).toFixed(2)) + '<i> руб.</i></td><td>'  + addSpaces(parseFloat(stat.doubleClientsSum).toFixed(2)) + '<i> руб.</i></td></tr>';

    tableData = tableData + '<tr><td>Сумма с клиента</td><td>' + addSpaces(parseFloat(parseFloat(stat.allMoney)/(parseInt(stat.singleClientOrders) +
            parseInt(stat.doubleClients))).toFixed(2)) + '<i> руб.</i></td><td>'  +
        addSpaces(parseFloat(stat.singleClientCheck).toFixed(2)) + '<i> руб.</i></td><td>'  +
        addSpaces(parseFloat(stat.doubleClientsCheck).toFixed(2)) + '<i> руб.</i></td></tr>';

    tableData = tableData + '<tr style="background-color:#f9f9f9"><td>Средний чек</td><td>' + addSpaces(parseFloat(stat.checkAll).toFixed(2)) + '<i> руб.</i></td><td>'  +
        addSpaces(parseFloat(stat.singleClientCheck).toFixed(2)) + '<i> руб.</i></td><td>'  +
        addSpaces((parseFloat(stat.doubleClientsOrderCheck)).toFixed(2)) + '<i> руб.</i></td></tr>';
    tableData = tableData + '</table>';

    var singleOrderClients = fullOrders - parseInt(stat.doubleClientsOrders);
    var dataGraphArr = {
        '1': singleOrderClients
    };

    //$('div.table-data').empty();

    $('div.table-data').append(str);
    $('div.table-data').append(tableData);
    //console.debug('str - appended!');
    var tbl = '<h3>Постоянные клиенты</h3>';
    tbl = tbl + '<table><tr style="font-weight: bold;text-align: center;"><td>Кол-во заказов</td><td>Клиенты</td><td>Сумма, руб</td><td>Сумма на клиента, руб</td></tr>';
    ind =0;
    $.each(stat.orderStat,function (key, val) {
        dataGraphArr[key] = val['clients'];
        if (ind<1){
            tbl=tbl + '<tr style="background-color:#f9f9f9"><td>'+ key + '</td><td style="text-align: right; min-width: 200px;">' +
                addSpaces(val['clients']) + '</td><td style="text-align: right; min-width: 200px;">' +
                addSpaces(parseFloat(val['sum']).toFixed(2)) + '</td><td style="text-align: right; min-width: 200px;">' +
                addSpaces(parseFloat(val['sumPerClient']).toFixed(2)) + '</td></tr>';
            ind++;
        }
        else{
            tbl=tbl + '<tr style="background-color:#ffffff"><td>'+ key + '</td><td style="text-align: right; min-width: 200px;">' +
                addSpaces(val['clients']) + '</td><td style="text-align: right; min-width: 200px;">' +
                addSpaces(parseFloat(val['sum']).toFixed(2)) + '</td><td style="text-align: right; min-width: 200px;">' +
                addSpaces(parseFloat(val['sumPerClient']).toFixed(2)) + '</td></tr>';
            ind=0;
        }

    });
    tbl = tbl + '</table>';
    console.debug('tbl - completed!');
    //$('div.table-data').empty();
    $('div.table-data').append(tbl);
    console.debug('tbl - appended!');
    drawChart(dataGraphArr);
    drawChart2(dataGraphArr);
    drawChartOneVsDouble({'Разовые клиенты': singleOrderClients,'Постоянные клиенты': stat.doubleClientsOrders})
    drawChartSumOneVsDouble({'Разовые клиенты': stat.singleClientSum,'Постоянные клиенты': stat.doubleClientsSum});
    drawChartSum({'Разовые клиенты': stat.singleClientSum,'Постоянные клиенты': stat.doubleClientsSum, 'Общий Оборот': stat.allMoney});
    drawChartClientSum({'Разовые клиенты': parseFloat(parseFloat(stat.singleClientCheck).toFixed(2)), 'Постоянные клиенты': stat.doubleClientsCheck, 'По всем клиентам': parseFloat(parseFloat(parseFloat(stat.allMoney)/(parseInt(stat.singleClientOrders) +parseInt(stat.doubleClients))).toFixed(2))});
    drawChartClientCheck({'Разовые клиенты': stat.singleClientCheck,'Постоянные клиенты': stat.doubleClientsOrderCheck, 'Общий Оборот': stat.checkAll});
}


function drawChart(receiveData) {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Клиенты');
    /*data.addRows([
        ['Mushrooms', 3],
        ['Onions', 1],
        ['Olives', 1],
        ['Zucchini', 1],
        ['Pepperoni', 2]
    ]);*/
    var rows = new Array();
    $.each(receiveData,function (key,value) {
        //

        rows.push([key, value,]);
    });

    data.addRows(rows);
    // Set chart options
    var options = {'title':'Соотношение клиентов по количеству заказов',
        'width':1000,
        'height':600,
        vAxis: {
            title: 'Клиенты'
        },
        hAxis: {
            title: 'Кол-во заказов'
        }
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.ColumnChart(document.getElementById('chart-div'));
    chart.draw(data, options);
}

function drawChart2(receiveData) {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Клиенты');
    /*data.addRows([
     ['Mushrooms', 3],
     ['Onions', 1],
     ['Olives', 1],
     ['Zucchini', 1],
     ['Pepperoni', 2]
     ]);*/
    var rows = new Array();
    $.each(receiveData,function (key,value) {
        //
        if (key.localeCompare('1')!=0){
            rows.push([key, value,]);            
        }
    });

    data.addRows(rows);
    // Set chart options
    var options = {'title':'Соотношение клиентов по количеству заказов без разовых клиентов',
        'width':1000,
        'height':600,
        vAxis: {
            title: 'Клиенты'
        },
        hAxis: {
            title: 'Кол-во заказов'
        }
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.ColumnChart(document.getElementById('chart2-div'));
    chart.draw(data, options);
}

function drawChartOneVsDouble(receiveData) {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Клиенты');
    /*data.addRows([
     ['Mushrooms', 3],
     ['Onions', 1],
     ['Olives', 1],
     ['Zucchini', 1],
     ['Pepperoni', 2]
     ]);*/
    var rows = new Array();
    $.each(receiveData,function (key,value) {
        //
        if (key.localeCompare('1')!=0){
            rows.push([key, value,]);
        }
    });

    data.addRows(rows);
    // Set chart options
    var options = {'title':'Соотношение заказов от разовых и постоянных клиентов',
        'width':1000,
        'height':600,
        vAxis: {
            title: 'Клиенты'
        },
        hAxis: {
            title: 'Кол-во заказов'
        }
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart3-div'));
    chart.draw(data, options);
}
function drawChartSumOneVsDouble(receiveData) {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Клиенты');
    /*data.addRows([
     ['Mushrooms', 3],
     ['Onions', 1],
     ['Olives', 1],
     ['Zucchini', 1],
     ['Pepperoni', 2]
     ]);*/
    var rows = new Array();
    $.each(receiveData,function (key,value) {
        //
        if (key.localeCompare('1')!=0){
            rows.push([key, value,]);
        }
    });

    data.addRows(rows);
    // Set chart options
    var options = {'title':'Соотношение оборота от разовых и постоянных клиентов',
        'width':1000,
        'height':600,
        vAxis: {
            title: 'Клиенты'
        },
        hAxis: {
            title: 'Кол-во заказов'
        }
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart5-div'));
    chart.draw(data, options);
}

function drawChartSum(receiveData) {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Оборот');
    /*data.addRows([
     ['Mushrooms', 3],
     ['Onions', 1],
     ['Olives', 1],
     ['Zucchini', 1],
     ['Pepperoni', 2]
     ]);*/
    var rows = new Array();
    $.each(receiveData,function (key,value) {
        //
        if (key.localeCompare('1')!=0){
            rows.push([key, value,]);
        }
    });

    data.addRows(rows);
    // Set chart options
    var options = {'title':'Оборот',
        'width':1000,
        'height':600,
        vAxis: {
            title: 'Сумма'
        },
        hAxis: {
            title: 'Канал поступления'
        }
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.ColumnChart(document.getElementById('chart4-div'));
    chart.draw(data, options);
}

function drawChartClientSum(receiveData) {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Сумма с клиента');
    /*data.addRows([
     ['Mushrooms', 3],
     ['Onions', 1],
     ['Olives', 1],
     ['Zucchini', 1],
     ['Pepperoni', 2]
     ]);*/
    var rows = new Array();
    $.each(receiveData,function (key,value) {
        //
        if (key.localeCompare('1')!=0){
            rows.push([key, value,]);
        }
    });

    data.addRows(rows);
    // Set chart options
    var options = {'title':'Сумма с клиента',
        'width':1000,
        'height':600,
        vAxis: {
            title: 'Сумма'
        },
        hAxis: {
            title: 'Канал поступления'
        }
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.ColumnChart(document.getElementById('chart6-div'));
    chart.draw(data, options);
}

function drawChartClientCheck(receiveData) {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Средний чек');
    /*data.addRows([
     ['Mushrooms', 3],
     ['Onions', 1],
     ['Olives', 1],
     ['Zucchini', 1],
     ['Pepperoni', 2]
     ]);*/
    var rows = new Array();
    $.each(receiveData,function (key,value) {
        //
        if (key.localeCompare('1')!=0){
            rows.push([key, value,]);
        }
    });

    data.addRows(rows);
    // Set chart options
    var options = {'title':'Чек',
        'width':1000,
        'height':600,
        vAxis: {
            title: 'Сумма'
        },
        hAxis: {
            title: 'Канал поступления'
        }
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.ColumnChart(document.getElementById('chart7-div'));
    chart.draw(data, options);
}


function addSpaces(nStr){
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ' ' + '$2');
    }
    return x1 + x2;
};