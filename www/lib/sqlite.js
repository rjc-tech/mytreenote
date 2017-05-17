// Wait for Cordova to load
if(typeof device === 'undefined'){
//    document.addEventListener("deviceready", initSqlLite, false);
    	initSqlLite();
}else{
	initSqlLite();
}

// Cordova is ready
//
function initSqlLite() {
    var db = window.sqlitePlugin.openDatabase("Database", "1.0", "mytreenote", 200000);
    db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS topic_info (topic_id integer primary key autoincrement not null, parent_topic_id integer, order integer, topic_text text, open_flg integer, current_topic_flg integer)");
    }, function(error) {
   console.log('Transaction ERROR: ' + error.message);
}, function() {
   console.log('Populated database OK');});
}

function queryInsertTopicInfo(param) {
    var db = window.sqlitePlugin.openDatabase("Database", "1.0", "mytreenote", 200000);
	var sql = "INSERT INTO topic_info (parent_topic_id, order, topic_text, open_flg, current_topic_flg) VALUES (?,?,?,?,?)";
    db.transaction(function(tx) {
        tx.executeSql(sql, param, function(tx, res) {
            console.log("insertId: " + res.insertId + " -- probably 1");
            console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
        }, function(e) {
            console.log("ERROR: " + e.message);
        });
    });
}

function queryUpdate(sql, param) {
    var db = window.sqlitePlugin.openDatabase("Database", "1.0", "mytreenote", 200000);
    db.transaction(function(tx) {
        tx.executeSql(sql, param, function(tx, res) {
            console.log("updateId: " + res.updateId + " -- probably 1");
            console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
        }, function(e) {
            console.log("ERROR: " + e.message);
        });
    });
}
function queryDeleteTopicInfo(param) {
    var db = window.sqlitePlugin.openDatabase("Database", "1.0", "mytreenote", 200000);
	var sql = "DELETE FROM topic_info WHERE topic_id = ?";   
    db.transaction(function(tx) {
        tx.executeSql(sql, param, function(tx, res) {
            console.log("deleteId: " + res.deleteId + " -- probably 1");
            console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
        }, function(e) {
            console.log("ERROR: " + e.message);
        });
    });
}