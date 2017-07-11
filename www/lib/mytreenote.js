/*
 Mytreenote用ファンクション
*/

// 初期処理
(function() {
    localStorage.clear();
    
    
    // topicIdの初期化
    if(localStorage.getItem("TOPIC_ID") == null) {
        // ローカルストレージにtopicIdのシーケンス初期設定
        localStorage.setItem("TOPIC_ID", 0);
    }

    // 親topic作成
    createParentTopic();
    // 子topic作成
    createTopic(1);
    // おーぷんふらぐ
    updateOpenFlg(2);
    updateCurrentTopicFlg(1);
    
    // 子topic作成
    createTopic(1);
    // 子topic作成
    createTopic(1);
    // 子topic作成
    createTopic(2);
    createTopic(2);
    createTopic(2);
    createTopic(5);
    createTopic(1);
    createTopic(1);
    deleteTopic(2);
})();

// ----------------------------------------------------------------
// 関数名：createParentTopic
// 機能　：起点となる（親）topic作成処理
// 引数　：無し
// 戻り値：無し
// 備考：作成topicはローカルストレージに保存（キー：TOPIC_ID）
// ----------------------------------------------------------------
function createParentTopic() {
    // 現在のtopicIdのシーケンスを取得し、最大値+1する
    var id = parseInt(localStorage.getItem("TOPIC_ID"));
    id += 1;
    
    // topicの作成
    var obj = {
        TOPIC_ID:id,
        PARENT_TOPIC_ID:"",
        PATH:"/",
        ORDER:id,
        TOPIC_TEXT:"",
        OPEN_FLG:1,
        CURRENT_TOPIC_FLG:0
    };
    
    // JSON文字列に変換
    var jsonStr = JSON.stringify(obj);
    // ローカルストレージに保存
    localStorage.setItem(obj["TOPIC_ID"], jsonStr);
    
    // ストレージに保存されている親topicIdのシーケンス更新
    localStorage.setItem("TOPIC_ID", id);
}

// ----------------------------------------------------------------
// 関数名：createTopic
// 機能　：子topic作成処理
// 引数　：topicId 作成する子topicの親となるtopicId
// 戻り値：無し
// 備考：作成topicはローカルストレージに保存（キー：TOPIC_ID）
// ----------------------------------------------------------------
function createTopic(topicId) {
    // 現在のtopicIdのシーケンスを取得し、最大値+1する
    var id = parseInt(localStorage.getItem("TOPIC_ID"));
    id += 1;

    var json = localStorage.getItem(topicId);
    var jsonParse = JSON.parse(json);
    var topicId = jsonParse["TOPIC_ID"];
    var path = jsonParse["PATH"];

    // 子topicの作成
    var obj = {
        TOPIC_ID:id,
        PARENT_TOPIC_ID:topicId,
        PATH:path + "~" + topicId,
        ORDER:id,
        TOPIC_TEXT:"",
        OPEN_FLG:1,
        CURRENT_TOPIC_FLG:0
    };
    
    // JSON文字列に変換
    var jsonStr = JSON.stringify(obj);
    // ローカルストレージに保存
    localStorage.setItem(obj["TOPIC_ID"], jsonStr);
    
    // ストレージに保存されている親topicIdのシーケンス更新
    localStorage.setItem("TOPIC_ID", id);
}


// ----------------------------------------------------------------
// 関数名：updateOpenFlg
// 機能　：オープンフラグ更新処理
// 引数　：topicId 更新対象のtopicId
// 戻り値：無し
// 備考：引数topicはローカルストレージに更新（キー：TOPIC_ID）
// ----------------------------------------------------------------
function updateOpenFlg(topicId) {

    var json = localStorage.getItem(topicId);
    var jsonParse = JSON.parse(json);
    
    // 現在のオープンフラグを反転
    if(0 == jsonParse["OPEN_FLG"]) {
        jsonParse["OPEN_FLG"] = 1;
    } else {
        jsonParse["OPEN_FLG"] = 0;        
    }

    // JSON文字列に変換
    var jsonStr = JSON.stringify(jsonParse);
    // ローカルストレージに保存
    localStorage.setItem(jsonParse["TOPIC_ID"], jsonStr);
}



// ----------------------------------------------------------------
// 関数名：deleteTopic
// 機能　：topic削除処理
// 引数　：topicId 削除対象のtopicId
// 戻り値：無し
// 備考：削除対象topicにぶら下がる子topicも削除する
// ----------------------------------------------------------------
function deleteTopic(topicId) {

    // 対象topicの削除
    localStorage.removeItem(topicId);

    // 対象topicにぶら下がる子topicも合わせて削除
    for(var key in localStorage) {
        var localJson = localStorage.getItem(key);
        var localJsonParse = JSON.parse(localJson);
    
        if(localJsonParse == null || !(localJsonParse instanceof Object)) {
            continue;
        }
    
        var pathList = localJsonParse["PATH"].split("~");

        for(var i = 0; i < pathList.length; i++) {
            var path = pathList[i];
            
            if(topicId == path) {
                // 子topicの削除
                localStorage.removeItem(localJsonParse["TOPIC_ID"]);
                break;
            }
        }    

    }
}

// ----------------------------------------------------------------
// 関数名：updateCurrentTopicFlg
// 機能　：カレントトピックフラグ更新処理
// 引数　：topicId 更新対象のtopicId
// 戻り値：無し
// 備考：  
// ----------------------------------------------------------------
function updateCurrentTopicFlg(topicId) {
    
    // 現在のカレントトピックフラグが立っているtopicIdを取得
    var currentTopicId = 
        localStorage.getItem("CURRENT_TOPIC_ID");
    
    // 現在のカレントトピックフラグを落とす
    if(!typeof currentTopicId === "undefined") {
        var currentJson = localStorage.getItem(currentTopicId);
        var currentJsonParse = JSON.parse(currentJson);
        currentJsonParse["CURRENT_TOPIC_FLG"] = 0;

        // JSON文字列に変換
        var currentJsonParseStr = JSON.stringify(currentJsonParse);
        // ローカルストレージに保存
        localStorage.setItem(
            currentJsonParseStr["TOPIC_ID"], currentJsonParseStr);
    }
    
    // 更新対象topicのカレントトピックフラグを立てる
    var json = localStorage.getItem(topicId);
    var jsonParse = JSON.parse(json);
    jsonParse["CURRENT_TOPIC_FLG"] = 1;
    
    // 現在のカレントトピックフラグが立っているtopicIdをローカルストレージに保存
    localStorage.setItem("CURRENT_TOPIC_ID", jsonParse["TOPIC_ID"]);

    // JSON文字列に変換
    var jsonParseStr = JSON.stringify(jsonParse);
    // ローカルストレージに保存
    localStorage.setItem(jsonParse["TOPIC_ID"], jsonParseStr);
}


// ----------------------------------------------------------------
// 関数名：updateTopicText
// 機能　：トピックテキスト更新処理
// 引数　：topicId 更新対象のtopicId
//        str  更新テキスト
// 戻り値：無し
// 備考：  
// ----------------------------------------------------------------
function updateTopicText(topicId, str) {
    
    var json = localStorage.getItem(topicId);
    var jsonParse = JSON.parse(json);
    
    // 更新テキストの内容で更新
    jsonParse["TOPIC_TEXT"] = str;

    // JSON文字列に変換
    var jsonParseStr = JSON.stringify(jsonParse);
    // ローカルストレージに保存
    localStorage.setItem(jsonParse["TOPIC_ID"], jsonParseStr);
}


// ----------------------------------------------------------------
// 関数名：hierarchyUpMove
// 機能　：カレントボタン（上）押下処理
// 引数　：json 更新対象のtopicJSONオブジェクト
// 戻り値：無し
// 備考：
// ----------------------------------------------------------------
function hierarchyUpMove(json) {
    
    var jsonParse = JSON.parse(json);
    var pathList = jsonParse["PATH"].split("~");
    // 自分より一つ上の親のid(path)を取得
    var id = pathList[pathList.length - 2]

    if("/" == id) {
        // 一番上（起点）になった場合は空設定
        jsonParse["PARENT_TOPIC_ID"] = "";
    } else {
        // 親topicIdをひとつ上の親のidで更新
        jsonParse["PARENT_TOPIC_ID"] = id;        
    }
    
    var path = "";
    // path再作成
    for(var i = 0; i < pathList.length -2; i++) {
        path += pathList[i];
    }
    jsonParse["PATH"] = path;
    
    // JSON文字列に変換
    var jsonParseStr = JSON.stringify(jsonParse);
    // ローカルストレージに保存
    localStorage.setItem(jsonParse["TOPIC_ID"], jsonParseStr);
}


// カレントボタン(下)押下処理
function hierarchyUnderMove() {

}


