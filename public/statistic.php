<?php 
header('Content-Type: text/html;charset=UTF-8');
?>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Отчётность по ПечатиРУ. Разработано - Асгат Консалтинг.</title>

    <!-- Bootstrap -->
    <link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
    <link href="src/css/jquery-ui.min.css" rel="stylesheet">
    <link href="src/css/jquery-ui.structure.min.css" rel="stylesheet">
    <link href="src/css/jquery-ui.theme.min.css" rel="stylesheet">

    <!--<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>-->
    <script src="src/scripts/jquery.js"></script>
    <script src="src/scripts/stat.js"></script>
    <script src="src/scripts/jquery-ui.min.js"></script>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    
<style>
    td{
        min-width: 200px;
        text-align: right;
    }
</style>

</head>
<body>

<h3>Загрузить файл для обработки</h3>
<input type="file" multiple="multiple"  accept=".csv" class="ui-widget">
<a href="#" class="ui-button ui-widget ui-corner-all submit button">Загрузить файл</a>
<div class="ajax-respond"></div>
<h3>Построить графики по ранее загруженным файлам</h3>
<div><a href="#" class="ui-button ui-widget ui-corner-all get-graph">Построить графики</a></div>
<div class="ui-widget ui-corner-all table-data">
    <!-- -->
</div>
<div id="chart-div" class="ui-widget ui-corner-all graph-data">
    <!-- -->
</div>
<div id="chart2-div" class="ui-widget ui-corner-all graph-data">
    <!-- -->
</div>
<div id="chart3-div" class="ui-widget ui-corner-all graph-data">
    <!-- -->
</div>
<div id="chart4-div" class="ui-widget ui-corner-all graph-data">
    <!-- -->
</div>

<div id="chart5-div" class="ui-widget ui-corner-all graph-data">
    <!-- -->
</div>
<div id="chart6-div" class="ui-widget ui-corner-all graph-data">
    <!-- -->
</div>
<div id="chart7-div" class="ui-widget ui-corner-all graph-data">
    <!-- -->
</div>


<?php
/**
 * Created by PhpStorm.
 * User: Skif
 * Date: 25.08.2016
 * Time: 14:24
 */
?>

</body>
</html>