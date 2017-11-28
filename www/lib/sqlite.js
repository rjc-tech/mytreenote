// Wait for Cordova to load

if (typeof device === 'undefined') {
    //    document.addEventListener("deviceready", initSqlLite, false);
    //    	initSqlLite();
    testStub();
} else {
    //	initSqlLite();
}

// Cordova is ready
//
function initSqlLite() {
    var db = openDatabase("Database", "1.0", "mytreenote", 200000);
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS topic_info ' + '( topic_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' + ' parent_topic_id INTEGER,' + ' order_no INTEGER,' + ' topic_text TEXT,' + ' open_flg INTEGER,' + ' current_topic_flg INTEGER);', [],
            function () {
                console.log("Populated database OK");
            },
            function (e) {
                console.log("Transaction ERROR: " + e.message);
            }
        );
    });
}

function queryInsertTopicInfo(param) {
    var db = openDatabase("Database", "1.0", "mytreenote", 200000);
    var sql = "INSERT INTO topic_info (parent_topic_id, order_no, topic_text, open_flg, current_topic_flg) VALUES (?,?,?,?,?)";
    db.transaction(function (tx) {
        tx.executeSql(sql, param,
            function (tx, res) {
                console.log("insertId: " + res.insertId + " -- probably 1");
                console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
            },
            function (e) {
                console.log("ERROR: " + e.message);
            }
        );
    });
}


function queryUpdate(sql, param) {
    var db = openDatabase("Database", "1.0", "mytreenote", 200000);
    db.transaction(function (tx) {
        tx.executeSql(sql, param,
            function (tx, res) {
                console.log("updateId: " + res.updateId + " -- probably 1");
                console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
            },
            function (e) {
                console.log("ERROR: " + e.message);
            }
        );
    });
}

function queryDeleteTopicInfo(param) {
    var db = openDatabase("Database", "1.0", "mytreenote", 200000);
    var sql = "DELETE FROM topic_info WHERE topic_id = ?";
    db.transaction(function (tx) {
        tx.executeSql(sql, param, function (tx, res) {
            console.log("deleteId: " + res.deleteId + " -- probably 1");
            console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
        }, function (e) {
            console.log("ERROR: " + e.message);
        });
    });
}

//全トピックを表示順に取得
function queryGetAllTree() {
    var db = openDatabase("Database", "1.0", "mytreenote", 200000);
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM topic_info ORDER BY parent_topic_id, order, topic_id', [],
            function (tx, results) {
                var list = []
                for (i = 0; i < results.rows.length; i++) {
                    list.push({
                        TOPIC_ID: results.rows.item(i).TOPIC_ID,
                        PARENT_TOPIC_ID: results.rows.item(i).PARENT_TOPIC_ID,
                        PATH: results.rows.item(i).PATH,
                        ORDER: results.rows.item(i).ORDER,
                        TOPIC_TEXT: results.rows.item(i).TOPIC_TEXT,
                        OPEN_FLG: results.rows.item(i).OPEN_FLG,
                        CURRENT_TOPIC_FLG: results.rows.item(i).CURRENT_TOPIC_FLG
                    })
                    return list;
                }
            },
            function (e) {
                console.log("ERROR: " + e.message);
            });
        return
    })
};


// 確認用
function testStub() {
    //テーブルクリエイト
    initSqlLite();

    var param1 = [];
    param1.push(2);
    param1.push(3);
    param1.push("てすっと");
    param1.push(1);
    param1.push(null);

    //テーブルインサート
    queryInsertTopicInfo(param1);

    var param2 = [];
    param2.push(3);
    param2.push(4);
    param2.push("ろーど");
    param2.push(null);
    param2.push(1);

    //テーブルインサート
    queryInsertTopicInfo(param2);


    var sql = "UPDATE topic_info SET topic_text=? WHERE topic_id= ?";

    var param3 = [];
    param3.push("あんろーど");
    param3.push(1);

    // テーブルアップデート
    queryUpdate(sql, param3);


    var param4 = [];
    param4.push(2);

    // テーブル削除
    queryDeleteTopicInfo(param4);

}