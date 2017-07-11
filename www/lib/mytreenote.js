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
    createTopic(localStorage.getItem(1));
    // おーぷんふらぐ
    updateOpenFlg(localStorage.getItem(2));
    updateCurrentTopicFlg(localStorage.getItem(1));
    
    // 子topic作成
    createTopic(localStorage.getItem(1));
    // 子topic作成
    createTopic(localStorage.getItem(1));
    // 子topic作成
    createTopic(localStorage.getItem(2));
    // 子topic作成
    createTopic(localStorage.getItem(2));
    // 子topic作成
    createTopic(localStorage.getItem(2));
    // 子topic作成
    createTopic(localStorage.getItem(5));
        // 子topic作成
    createTopic(localStorage.getItem(1));
    // 子topic作成
    createTopic(localStorage.getItem(1));
    deleteTopic(localStorage.getItem(2));
    
    
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
// 引数　：json 作成する子topicの親となるtopicJSONオブジェクト
// 戻り値：無し
// 備考：作成topicはローカルストレージに保存（キー：TOPIC_ID）
// ----------------------------------------------------------------
function createTopic(json) {
    // 現在のtopicIdのシーケンスを取得し、最大値+1する
    var id = parseInt(localStorage.getItem("TOPIC_ID"));
    id += 1;

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
// 引数　：json 更新対象のtopicJSONオブジェクト
// 戻り値：無し
// 備考：引数topicはローカルストレージに更新（キー：TOPIC_ID）
// ----------------------------------------------------------------
function updateOpenFlg(json) {

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
// 引数　：json 削除対象のtopicJSONオブジェクト
// 戻り値：無し
// 備考：削除対象topicにぶら下がる子topicも削除する
// ----------------------------------------------------------------
function deleteTopic(json) {

    var jsonParse = JSON.parse(json);
    // 対象topicの削除
    localStorage.removeItem(jsonParse["TOPIC_ID"]);
    
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
            
            if(jsonParse["TOPIC_ID"] == path) {
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
// 引数　：json 更新対象のtopicJSONオブジェクト
// 戻り値：無し
// 備考：  
// ----------------------------------------------------------------
function updateCurrentTopicFlg(json) {
    
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
// 引数　：json 更新対象のtopicJSONオブジェクト
// 戻り値：無し
// 備考：  
// ----------------------------------------------------------------
function updateTopicText(json) {



}


// カレントボタン(上)押下処理
function hierarchyUpMove() {

}


// カレントボタン(下)押下処理
function hierarchyUnderMove() {

}


