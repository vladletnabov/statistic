<?php
/**
 * Created by PhpStorm.
 * User: Skif
 * Date: 25.08.2016
 * Time: 14:17
 */
// Здесь нужно сделать все проверки передаваемых файлов и вывести ошибки если нужно
 
// Переменная ответа
 
$data = array();
 
if( isset( $_GET['uploadfiles'] ) ){
    $error = false;
    $files = array();

    $uploaddir = '../src/'; // . - текущая папка где находится submit.php

    // Создадим папку если её нет

    if( ! is_dir( $uploaddir ) ) mkdir( $uploaddir, 0777 );

    // переместим файлы из временной директории в указанную
    $filename='';
    foreach( $_FILES as $file ){
        if( move_uploaded_file( $file['tmp_name'], $uploaddir . basename($file['name']) ) ){
            $files[] = realpath( $uploaddir . $file['name'] );
        }
        else{
            $error = true;
        }
    }

    $filelog =  $uploaddir . "fileUpload.log";
    $fp = fopen($filelog, "w"); // Открываем файл в режиме записи
    $mytext = "file: $files[0]\r\n"; // Исходная строка
    $test = fwrite($fp, $mytext); // Запись в файл boolean
    fclose($fp); //Закрытие файла

    $data = $error ? array('error' => 'Ошибка загрузки файлов.') : array('files' => $files );

    $data['statistic']=getData($files[0]);

    /*foreach($data as $key=>$val){
        error_log("$key", 0);
    }*/
    echo json_encode( $data );
}
if( isset( $_GET['getdata'] ) ){
    $error = false;
    error_log("getdata...", 0);
    $uploaddir = '../src/'; // . - текущая папка где находится submit.php
    $base_file = $uploaddir . 'salesorders.csv';
    $filelog =  $uploaddir . "fileUpload.log";
    error_log("filelog: $filelog",0);
    if (file_exists($filelog)){
        error_log('filelog exist!',0);
        $text = file($filelog);
        error_log('filelog opened!',0);
        foreach ($text as $numLine => $strLine) {
            error_log('filelog readline',0);
            error_log($strLine,0);
            //chomp($strLine);
            $strLine = preg_replace("/\r\n/", '', $strLine);
            $arr = split(": ", $strLine);
            error_log("first: $arr[0], second: $arr[1]");
            if (strcmp($arr[0],"file")==0){
                error_log("key file is right!");
                $base_file = $arr[1];
                error_log("re-write base_file: $base_file",0);
            }
        }
    }
    error_log("current base_file: $base_file", 0);
    $data = $error ? array('error' => 'Ошибка загрузки файлов.') : array('files' => 'Предыдущая версия файла' );

    $data['statistic']=getData($base_file);
    foreach($data as $key=>$val){
        error_log("$key", 0);
    }
    echo json_encode( $data );
}


function getdata($filename){
    $result=array();
    $phoneArr=array();
    $emailArr=array();
    $fullArrClients=array();
    $text = file($filename);
    //echo "<h1>Список постоянных клиентов</h1>";
    //echo "<table>";
    $countLine=0;
    $countBreakLines=0;
    $countPhone=0;
    $countEmail=0;
    foreach ($text as $numLine => $strLine) {
        $strLine = iconv("CP866", "UTF-8", $strLine);
        $arr = split(";",$strLine);
        if (strcmp($arr[0],'')!=0){
            $arr[2]=phoneReplaceSymbol($arr[2]);
            $arr[3]= strDoCompare($arr[3]);
            if (((float)$arr[6]>0)&&(strcmp($arr[9],"ВИП'S")!=0)&&(strcmp($arr[13],"1")==0)){
                $fullArrClients[$numLine] = $arr;
                if (preg_match("/\d/",$arr[2])){
                    $phoneArr[$arr[2]][$numLine]=$arr;
                    $countPhone++;
                }
                elseif(preg_match("/\@/",$arr[3])){
                    //
                    $emailArr[$arr[3]][$numLine]=$arr;
                    $countEmail++;

                }
                else{
                    $countBreakLines++;
                }
                //
                $countLine++;
            }
            /*if (((float)$arr[6]>0)&&(strcmp($arr[13],"1")==0)){
                $fullArrClients[$numLine] = $arr;
            }*/
        }

    }

    $moneyAll = getAllMoney($fullArrClients);
    $result['allMoney'] = $moneyAll['money'];
    $result['checkAll'] = $moneyAll['check'];
    $result['allOrders'] = $moneyAll['orders'];

    $result['countBreakLines']=$countBreakLines;
    $result['countPhone']=$countPhone;
    $result['countEmail']=$countEmail;
    $result['countPhoneEmail']=$countEmail+$countPhone;


    $doubleClients = doubleClients($phoneArr,$emailArr);
    ksort($doubleClients);


    $sumDouble = getSumm($doubleClients);
    $result['doubleClients'] = $sumDouble['clients'];
    $result['doubleClientsOrders'] = $sumDouble['orders'];
    $result['doubleClientsSum'] = $sumDouble['sum'];
    $result['doubleClientsCheck'] = round (($sumDouble['sum']/$sumDouble['clients']),2);
    //средний чек
    $result['doubleClientsOrderCheck'] = round (($sumDouble['sum']/$sumDouble['orders']),2);

    $result['singleClientOrders'] = $moneyAll['orders'] - $sumDouble['orders'];
    $result['singleClientSum'] = $moneyAll['money'] - $sumDouble['sum'];
    $result['singleClientCheck'] = $result['singleClientSum']/$result['singleClientOrders'];

    $maxOrder = 10;
    $maxOrderLbl = "более " . $maxOrder;
    $result['maxOrder']=$maxOrder;

    $perCountOrderArr=array();
    $i=2;
    while($i<($maxOrder+1)) {
        //error_log("perCountClientsArr element: " . $i,0);
        $perCountOrderArr[((string)$i)] = getClientsHaveOrderCount($doubleClients, $i, 0);
        $i++;

    }
    $perCountOrderArr[$maxOrderLbl]=getClientsHaveOrderCount($doubleClients,$maxOrder,1);

    $arrOrderCounts=array();
    foreach ($perCountOrderArr as $keyOrderCount=>$valOrderArr){
        //echo "<td>$keyOrderCount</td>";
        $clientSum = getSumm($valOrderArr);
        //echo "<td>" . $clientSum['clients'] . "</td><td>" . $clientSum['sum'] . "</td><td>" . round (($clientSum['sum']/$clientSum['clients']),2) . "</td></tr>";
        $arrOrderCounts[(string)$keyOrderCount]['clients'] = $clientSum['clients'];
        $arrOrderCounts[(string)$keyOrderCount]['sum'] = $clientSum['sum'];
        $arrOrderCounts[(string)$keyOrderCount]['sumPerClient'] = round (($clientSum['sum']/$clientSum['clients']),2);
    }
    $result['orderStat'] = $arrOrderCounts;

    return $result;
}

function getAllMoney($arr){
    $result = array('money'=>0,'check'=>0,'orders' => 0);
    foreach ($arr as $key=>$val){
        $result['money'] =$result['money']  + $val[6];
    }
    $result['orders'] = count($arr);
    $result['check'] = $result['money']/$result['orders'];
    return $result;
}

function getSumm($reqArr){
    //
    /*echo "<hr />recived lines:" . countArrayLines($reqArr) . "<br />";
    echo "recived keys:" . countArrayKeys($reqArr) . "<br />";*/
    $clients=0;
    $orders=0;
    $sum = 0;
    $countSingle=0;
    foreach ($reqArr as $key=>$value){
        $orders=$orders + count($reqArr[$key]);
        if (count($reqArr[$key])>1){
            $clients++;
            foreach($value as $valKey => $valValue){
                //
                $sum = $sum + $valValue[6];
            }
        }
        else{
            $countSingle++;
        }
    }

    return array(
        "clients"=>$clients,
        "sum"=>$sum,
        "orders" => $orders
    );
}

function doubleClients($phone, $email){


    $compareArr = comparePhoneEmail($phone,$email);
    $doubleArr=$compareArr['double'];

    $doubleArr = comparePhoneDouble($doubleArr,$phone);


    $doubleArr = compareDoubleEmail($doubleArr,$compareArr['wophone']);

    return $doubleArr;

}

function getDoubleVsSinglePhone($arr, $doubleArr){
    $singleArr=array();
    foreach($arr as $key=>$val){
        if (count($arr[$key])>1){
            //
            $doubleArr[$key]=$val;
        }
        else{
            $singleArr[$key]=$val;
        }
    }
    return array('single'=>$singleArr,'double'=>$doubleArr);
}
//Сравниваем массив email где собраны только записибез телефона с массивом phone на поиск совпадения email
//Возвращает два массива: массив совпадений и массив мыл без совпадений с телефонами
function comparePhoneEmail($phone, $email){
    $doubleArr= array();
    $woPhoneArr=array();
    foreach($email as $keyEmail=>$valEmail){
        foreach ($valEmail as $numEmail=>$valArrEmail){
            //перебираем $phone
            $resCompare = phoneConsistEmail($phone, $valArrEmail[3]);
            if($resCompare['result']==true){
                //
                //error_log((($resCompare['result'])? 'true' : 'false'),0);
                //записываем все, мыла, которые имеют совпадения в массиве телефонов
                $doubleArr[$resCompare['phoneNumber']][$numEmail]=$valArrEmail;
            }else {
                //error_log((($resCompare['result'])? 'true' : 'false'),0);
                //сюда пишем все мыла, которые не имеют совпадения в массиве телефонов
                $woPhoneArr[$valArrEmail[3]][$numEmail]=$valArrEmail;
            }
        }
    }
    return array('double'=>$doubleArr,
        'wophone'=>$woPhoneArr);
}
// сравниваем чистый массив телефонов и получиный на предудыщей иттерации массив дубликатов
function comparePhoneDouble($double,$phone){
    foreach ($phone as $keyPhone=>$keyVal){
        //
        if (count($phone[$keyPhone])>1) {
            foreach ($keyVal as $numLinePhone=>$arrLinePhone){
                $double[$keyPhone][$numLinePhone]=$arrLinePhone;
            }
        }
        else {
            foreach($double as $keyDouble=>$valDouble){
                if (strcmp($keyPhone,$keyDouble)==0){
                    foreach ($keyVal as $numLinePhone=>$arrLinePhone){
                        $double[$keyPhone][$numLinePhone]=$arrLinePhone;
                    }
                }
            }
        }
    }
    return $double;
}
//проверяет наличие дубликатов в чистом массиве мыл без совпадений с телефонами и загоняет дублирующиеся в массив дуликатов
function compareDoubleEmail($double,$email){
    foreach($email as $key=>$val){
        if (count($email[$key])>1){
            $double[$key]=$val;
        }
    }
    return $double;
}


//$phone массив телфонов $email = конкретный адрес почты
function phoneConsistEmail($phone, $email){
    //$email =strDoCompare($email);
    $result = array('result'=>false,
        'phoneNumber'=>'',
        'numLine'=>null);
    foreach($phone as $key=>$val){
        foreach ($val as $numLine=>$valPhoneArr){
            if(strcmp($valPhoneArr[3],$email)==0){
                $result['result']=true;
                $result['phoneNumber']=$valPhoneArr[2];
                $result['numLine']=$numLine;
                //error_log($result['phoneNumber'] . ' ' . $result['numLine'] . ' ' . (($result['result']) ? 'true' : 'false'),0);
                return $result;
            }
        }
    }
    return $result;
}

//Убираем пробелы и переводим в нижний регистр слово
function strDoCompare($str){
    $str =strtolower($str);
    $str = preg_replace("/\s/",'',$str);
    return $str;
}

//удаляем лишние символы из поля телефона, приводим первый символ к 7 если там 8 и добавляем 7 если отсуствует
function phoneReplaceSymbol($str){
    if (strcmp($str,'')!=0){
        $str =strtolower($str);
        $str = preg_replace("/\s/",'',$str);
        $str = preg_replace("/\+/",'',$str);
        $str = preg_replace("/\(/",'',$str);
        $str = preg_replace("/\)/",'',$str);
        $str = preg_replace("/\-/",'',$str);

        if ((strcmp(mb_substr($str,0,1),'7')!=0)&&(strcmp(mb_substr($str,0,1),'8')!=0)){
            $str = '7' . $str;
        }
        else {
            $str = substr_replace($str, '7', 0, 1);
        }
    }

    return $str;
}

function countArrayLines($arr){
    $count=0;
    foreach($arr as $key=>$val){
        $count= $count + count($arr[$key]);
    }
    return $count;
}

function countArrayKeys($arr){
    $count=0;
    foreach($arr as $key=>$val){
        $count++;
    }
    return $count;
}

// список записей поаторных клиентов HEADER Номер + телефон/мыло, а ниже список заказов от этого клиента
//$showRecords показывать заказы: 1 не показывать:0
function tblClients($arr, $showRecords){
    echo "<hr /><hr /><table>";
    $count=0;
    foreach($arr as $key=>$val){
        $count++;
        echo "<tr><td style='background-color: #2e6da4; color: #c4e3f3; font-size: 16px; font-weight: bold; text-align: center'>$count</td><td colspan='13' style='background-color: #99cb84; font-size: 16px; font-weight: bold; text-align: center'>$key</td></tr>";
        if ($showRecords==1) {
            foreach($val as $numLine=>$arrLine){
                echo "<tr><td>$numLine</td>". tblStrClients($arrLine) . "</tr>";
            }
        }
    }
    echo "</table>";
}

function tblStrClients($arr){
    $str ='';
    foreach ($arr as $key=>$val){
        $str = $str . "<td>$val</td>";
    }
    return $str;
}


// $equalOrMore = 0 , > 1
function getClientsHaveOrderCount($clients, $ordersFromClient, $equalOrMore){
    $retArray = array();
    foreach ($clients as $key=>$val){
        if($equalOrMore>0) {
            if(count($clients[$key])>$ordersFromClient){
                $retArray[$key]=$val;
            }
        }
        else {
            if(count($clients[$key])==$ordersFromClient){
                $retArray[$key]=$val;
            }
        }
    }
    return $retArray;
}