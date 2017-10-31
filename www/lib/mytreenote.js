/*
 Mytreenote用ファンクション
*/
// ----------------------------------------------------------------
// 関数名：createParentTopic
// 機能　：起点となる（親）topic作成処理
// 引数　：無し
// 戻り値：登録したトピックID
// 備考：作成topicはローカルストレージに保存（キー：TOPIC_ID）
// ----------------------------------------------------------------
function createParentTopic() {
    // 現在のtopicIdのシーケンスを取得し、最大値+1する
    var id = parseInt(localStorage.getItem("TOPIC_ID_SEQ"));
    id += 1;

    // topicの作成
    var obj = {
        TOPIC_ID: id,
        PARENT_TOPIC_ID: "",
        PATH: "/",
        ORDER: id,
        TOPIC_TEXT: "",
        OPEN_FLG: 1,
        CURRENT_TOPIC_FLG: 0
    };

    // JSON文字列に変換
    var jsonStr = JSON.stringify(obj);
    // ローカルストレージに保存
    localStorage.setItem(obj["TOPIC_ID"], jsonStr);

    // ストレージに保存されている親topicIdのシーケンス更新
    localStorage.setItem("TOPIC_ID_SEQ", id);

    return obj["TOPIC_ID"];
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
    var id = parseInt(localStorage.getItem("TOPIC_ID_SEQ"));
    id += 1;

    var json = localStorage.getItem(topicId);
    var jsonParse = JSON.parse(json);
    var topicId = jsonParse["TOPIC_ID"];
    var path = jsonParse["PATH"];

    // 子topicの作成
    var obj = {
        TOPIC_ID: id,
        PARENT_TOPIC_ID: topicId,
        PATH: path + "~" + topicId,
        ORDER: id,
        TOPIC_TEXT: "",
        OPEN_FLG: 1,
        CURRENT_TOPIC_FLG: 0
    };

    // JSON文字列に変換
    var jsonStr = JSON.stringify(obj);
    // ローカルストレージに保存
    localStorage.setItem(obj["TOPIC_ID"], jsonStr);

    // ストレージに保存されている親topicIdのシーケンス更新
    localStorage.setItem("TOPIC_ID_SEQ", id);

    return obj["TOPIC_ID"];
}


// ----------------------------------------------------------------
// 関数名：updateOpenFlg
// 機能　：オープンフラグ更新処理
// 引数　：topicId 更新対象のtopicId
// 戻り値：無し
// 備考：
// ----------------------------------------------------------------
function updateOpenFlg(topicId) {

    var json = localStorage.getItem(topicId);
    var jsonParse = JSON.parse(json);

    // 現在のオープンフラグを反転
    if (0 == jsonParse["OPEN_FLG"]) {
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
// 備考：削除対象topicにぶら下がる子topicも削除
// ----------------------------------------------------------------
function deleteTopic(topicId) {

    // 対象topicの削除
    localStorage.removeItem(topicId);

    // 対象topicにぶら下がる子topicも合わせて削除
    for (var key in localStorage) {
        var localJson = localStorage.getItem(key);
        var localJsonParse = JSON.parse(localJson);

        if (localJsonParse == null || !(localJsonParse instanceof Object)) {
            continue;
        }

        var pathList = localJsonParse["PATH"].split("~");

        for (var i = 0; i < pathList.length; i++) {
            var path = pathList[i];

            if (topicId == path) {
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
    if (!typeof currentTopicId === "undefined") {
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
// 引数　：topicId 更新対象のtopicId
// 戻り値：無し
// 備考：
// ----------------------------------------------------------------
function hierarchyUpMove(topicId) {

    var json = localStorage.getItem(topicId);
    var jsonParse = JSON.parse(json);
    var path = jsonParse["PATH"];
    var pathList = path.split("~");
    // 自分より一つ上の親のid(path)を取得
    var id = pathList[pathList.length - 2]

    // 起点の状態で押下された場合は処理終了
    if (typeof id === "undefined") {
        return;
    }

    if ("/" == id) {
        // 一番上（起点）になった場合は初期設定
        jsonParse["PARENT_TOPIC_ID"] = "";
        jsonParse["PATH"] = "/";
    } else {
        // 親topicIdをひとつ上の親のidで更新
        jsonParse["PARENT_TOPIC_ID"] = parseInt(id);
        jsonParse["PATH"] = path.substr(0, path.length - 2);
    }

    // JSON文字列に変換
    var jsonParseStr = JSON.stringify(jsonParse);
    // ローカルストレージに保存
    localStorage.setItem(jsonParse["TOPIC_ID"], jsonParseStr);

    // 対象topicにぶら下がる子topicのパスも合わせて更新
    for (var key in localStorage) {
        var localJson = localStorage.getItem(key);
        var localJsonParse = JSON.parse(localJson);

        if (localJsonParse == null || !(localJsonParse instanceof Object)) {
            continue;
        }

        var pathJsonParse = localJsonParse["PATH"];
        var pathList = pathJsonParse.split("~");

        for (var i = 0; i < pathList.length; i++) {
            var localpath = pathList[i];

            if (topicId == localpath) {
                var index = pathJsonParse.indexOf(localpath);
                localJsonParse["PATH"] =
                    pathJsonParse.substr(0, index - 2) + pathJsonParse.substr(index);

                // JSON文字列に変換
                var localJsonParseStr = JSON.stringify(localJsonParse);
                // ローカルストレージに保存
                localStorage.setItem(localJsonParse["TOPIC_ID"], localJsonParseStr);

                break;
            }
        }

    }
}

// ----------------------------------------------------------------
// 関数名：hierarchyUnderMove
// 機能　：カレントボタン（下）押下処理
// 引数　：topicId 更新対象のtopicId
// 戻り値：無し
// 備考：
// ----------------------------------------------------------------
function hierarchyUnderMove(topicId) {

    // 更新対象topic取得
    var json = localStorage.getItem(topicId);
    var jsonParse = JSON.parse(json);
    var path = jsonParse["PATH"];
    var pathList = path.split("~");
    var targetlen = pathList.length;
    var targetOrder = jsonParse["ORDER"];
    var topicList = [];

    // 更新対象topicと同列階層のtopicを抽出
    for (var key in localStorage) {
        var localJson = localStorage.getItem(key);
        var localJsonParse = JSON.parse(localJson);

        if (localJsonParse == null || !(localJsonParse instanceof Object)) {
            continue;
        }

        var pathJsonParse = localJsonParse["PATH"];
        var pathList = pathJsonParse.split("~");
        var len = pathList.length;
        // 更新対象topicと同列階層ではない場合、処理終了
        if (targetlen != len) {
            continue;
        }

        var order = localJsonParse["ORDER"];
        // 表示順が更新対象topic以上の場合、処理終了
        if (parseInt(targetOrder) <= parseInt(order)) {
            continue;
        }

        topicList.push(localJsonParse);
    }

    // 対象topicが存在しない場合、処理終了
    if (parseInt(topicList.length) <= 0) {
        return;
    }

    // 比較用表示順
    var comparisonOrder = "";

    for (var i = 0; i < topicList.length; i++) {
        var topic = topicList[i];

        // 表示順が一番大きいものがぶら下がり先の対象
        if (comparisonOrder != "" &&
            parseInt(comparisonOrder) >= parseInt(topic["ORDER"])) {
            continue;
        } else {
            comparisonOrder = topic["ORDER"];
        }

        // ぶらさがり設定
        jsonParse["PARENT_TOPIC_ID"] = topic["TOPIC_ID"];
        jsonParse["PATH"] = path + "~" + topic["TOPIC_ID"];
    }

    // JSON文字列に変換
    var jsonParseStr = JSON.stringify(jsonParse);
    // ローカルストレージに保存
    localStorage.setItem(jsonParse["TOPIC_ID"], jsonParseStr);

    var newPath = jsonParse["PATH"];

    // 対象topicにぶら下がる子topicのパスも合わせて更新
    for (var key in localStorage) {
        var localJson = localStorage.getItem(key);
        var localJsonParse = JSON.parse(localJson);

        if (localJsonParse == null || !(localJsonParse instanceof Object)) {
            continue;
        }

        var pathJsonParse = localJsonParse["PATH"];
        var pathList = pathJsonParse.split("~");

        for (var i = 0; i < pathList.length; i++) {
            var localpath = pathList[i];

            if (topicId == localpath) {
                localJsonParse["PATH"] =
                    newPath + "~" + localJsonParse["PARENT_TOPIC_ID"];
                // JSON文字列に変換
                var localJsonParseStr = JSON.stringify(localJsonParse);
                // ローカルストレージに保存
                localStorage.setItem(localJsonParse["TOPIC_ID"], localJsonParseStr);

                break;
            }
        }
    }
}