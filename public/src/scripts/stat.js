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
    str = str + '<p class="phone"><b>Заказы с указанным телефоном: </b><span class="phone">' +  stat.countPhone + '</span></p>';
    str = str + '<p class="email"><b>Заказы только с e-mail: </b><span class="email">' +  stat.countEmail + '</span></p>';
    str = str + '<p class="email-phone"><b>Общее кол-во заказов тел+email: </b><span class="email-phone">' +  stat.countPhoneEmail + '</span></p>';
    str = str + '<p class="broken"><b>Заказы без контактов: </b><span class="broken">' +  stat.countBreakLines + '</span></p>';
    console.debug('str - completed!');
    var fullOrders = parseInt(stat.countPhone) + parseInt(stat.countEmail) + parseInt(stat.countBreakLines);

    str = str + '<br /><br /><h3>Повторные заказы и постоянные клиенты</h3>';
    str = str + '<p class="double-clients"><b>Постоянные клиенты: </b><span class="double-clients">' +  stat.doubleClients + '</span></p>';
    str = str + '<p class="double-orders"><b>Количество заказаов от постоянных клиентов: </b><span class="double-orders">' +  stat.doubleClientsOrders + '</span></p>';
    str = str + '<p class="double-sum"><b>Поступившая сумма от постоянных клиентов: </b><span class="double-sum">' +  stat.doubleClientsSum + '</span></p>';
    str = str + '<p class="double-check"><b>Средняя сумма от клиента: </b><span class="double-check">' +  stat.doubleClientsCheck + '</span></p>';

    var singleOrderClients = fullOrders - parseInt(stat.doubleClientsOrders);
    var dataGraphArr = {
        '1': singleOrderClients
    };

    $('div.table-data').append(str);
    console.debug('str - appended!');
    var tbl = '';
    tbl = tbl + '<table><tr style="font-weight: bold;text-align: center;"><td>Кол-во заказов</td><td>Клиенты</td><td>Сумма, руб</td><td>Сумма на клиента, руб</td></tr>';
    ind =0;
    $.each(stat.orderStat,function (key, val) {
        dataGraphArr[key] = val['clients'];
        if (ind<1){
            tbl=tbl + '<tr style="background-color:#f9f9f9"><td>'+ key + '</td><td style="text-align: right; min-width: 200px;">' + val['clients'] + '</td><td style="text-align: right; min-width: 200px;">' + parseFloat(val['sum']).toFixed(2) + '</td><td style="text-align: right; min-width: 200px;">' + parseFloat(val['sumPerClient']).toFixed(2) + '</td><td>' + '</td></tr>';
            ind++;
        }
        else{
            tbl=tbl + '<tr style="background-color:#ffffff"><td>'+ key + '</td><td style="text-align: right; min-width: 200px;">' + val['clients'] + '</td><td style="text-align: right; min-width: 200px;">' + parseFloat(val['sum']).toFixed(2) + '</td><td style="text-align: right; min-width: 200px;">' + parseFloat(val['sumPerClient']).toFixed(2) + '</td><td>' + '</td></tr>';
            ind=0;
        }

    });
    tbl = tbl + '</table>';
    console.debug('tbl - completed!')
    $('div.table-data').append(tbl);
    console.debug('tbl - appended!');
    drawChart(dataGraphArr);
    drawChart2(dataGraphArr);
    drawChartOneVsDouble({'Разовые клиенты': singleOrderClients,'Постоянные клиенты': stat.doubleClientsOrders})
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
    var options = {'title':'Соотношение разовых и постоянных клиентов',
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