/*************** CONFIG ***************/
const CONFIG = {
    API_KEY: "shoppe_affiliate_share_6d2a8eca-3213-4fc3-a3d6-3237171918e5",
    ADMIN_UID: "admin_999",
    DRIVE_FOLDER_ID: "1sUOYnk23W2F1VQDup8UEBL2wMDDKRi_D",
    NOTIFY_EMAIL: "your@email.com"
  };
  
  /*************** INIT ***************/
  function initSheet() {
    const sheet = getTodaySheet();
    setupSheetUI(sheet);
  }
  
  /*************** MAIN ***************/
  function doPost(e) {
    try {
      const action = e.parameter.action;
      const data = JSON.parse(e.postData.contents);
  
      if (data.key !== CONFIG.API_KEY) {
        return json({ error: "Unauthorized" });
      }
  
      if (action === "submit") return submitLink(data);
      if (action === "upload") return uploadImage(data);
  
      return json({ error: "Invalid action" });
  
    } catch (err) {
      return json({ error: err.message });
    }
  }
  
  function doGet(e) {
    const action = e.parameter.action;
    const uid = e.parameter.uid;
  
    if (action === "list") return getUserData(uid);
  
    if (action === "admin" && uid === CONFIG.ADMIN_UID) {
      return getAllData();
    }
  
    return json({ error: "Invalid request" });
  }
  
  /*************** SHEET ***************/
  function getTodaySheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
  
    const today = Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd");
  
    let sheet = ss.getSheetByName(today);
  
    if (!sheet) {
      sheet = ss.insertSheet(today);
    }
  
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Time",
        "UID",
        "Link",
        "Affiliate",
        "Image",
        "ImageSuccess",
        "ProductPrice",
        "CommissionRate",
        "Status",
        "RequestId"
      ]);
  
      setupSheetUI(sheet);
    }
  
    return sheet;
  }
  
  /*************** UI ***************/

  function setColumnWidths(sheet) {
    const widths = [
      160, // Time
      120, // UID
      400, // Link
      300, // Affiliate
      350, // Image
      350, // ImageSuccess
      140, // ProductPrice
      140, // CommissionRate
      150, // Status
      260  // RequestId
    ];
  
    widths.forEach((w, i) => {
      sheet.setColumnWidth(i + 1, w);
    });
  }

  function setupSheetUI(sheet) {
    const lastCol = 10;
  
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(
        ["WAIT_LINK", "DONE", "WAIT_ORDER", "DONE_ORDER"],
        true
      )
      .build();
  
    sheet.getRange("I2:I1000").setDataValidation(rule);
  
    const rules = [
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo("WAIT_LINK")
        .setBackground("#ff4d4d")
        .setRanges([sheet.getRange("I2:I1000")])
        .build(),
  
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo("DONE")
        .setBackground("#ffd966")
        .setRanges([sheet.getRange("I2:I1000")])
        .build(),
  
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo("WAIT_ORDER")
        .setBackground("#4da6ff")
        .setRanges([sheet.getRange("I2:I1000")])
        .build(),
  
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo("DONE_ORDER")
        .setBackground("#66cc66")
        .setRanges([sheet.getRange("I2:I1000")])
        .build()
    ];
  
    sheet.setConditionalFormatRules(rules);
  
    sheet.getRange(1, 1, 1, lastCol).setFontWeight("bold");
    sheet.getRange("A1:J1000").setWrap(true);
    setColumnWidths(sheet);
  }
  
  /*************** SUBMIT ***************/
  function submitLink(data) {
    const sheet = getTodaySheet();
    const requestId = Utilities.getUuid();
  
    sheet.appendRow([
      new Date(),
      data.uid,
      data.link,
      "",
      "",
      "",
      "",
      "",
      "WAIT_LINK",
      requestId
    ]);
  
    highlightNewRow(sheet);
    sortSheet(sheet);
  
    return json({
      success: true,
      requestId: requestId
    });
  }
  
  /*************** UPLOAD IMAGE ***************/
  
  function uploadImage(data) {
    if (!data.image || !data.requestId) {
      return json({ error: "Missing image or requestId" });
    }
  
    const base64 = data.image.split(',')[1];
  
    const blob = Utilities.newBlob(
      Utilities.base64Decode(base64),
      "image/png",
      `${data.type}_${data.requestId}.png`
    );
  
    const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    const fileName = `${data.type}_${data.requestId}.png`;
  
    // 🔥 XÓA FILE CŨ NẾU TRÙNG TÊN
    const files = folder.getFilesByName(fileName);
    while (files.hasNext()) {
      files.next().setTrashed(true);
    }
  
    // ✅ TẠO FILE MỚI
    const file = folder.createFile(blob).setName(fileName);
  
    file.setSharing(
      DriveApp.Access.ANYONE_WITH_LINK,
      DriveApp.Permission.VIEW
    );
  
    const fileId = file.getId();
    const url = `https://lh3.googleusercontent.com/d/${fileId}`;
  
    const sheet = getTodaySheet();
    const dataSheet = sheet.getDataRange().getValues();
  
    let updatedRow = -1;
  
    for (let i = 1; i < dataSheet.length; i++) {
      if (dataSheet[i][9] === data.requestId) {
        updatedRow = i + 1;
  
        // nếu đã DONE_ORDER thì không update nữa
        if (dataSheet[i][8] === "DONE_ORDER") {
          return json({ error: "Already completed" });
        }
  
        if (data.type === "success") {
          sheet.getRange(updatedRow, 6).setValue(url);
          sheet.getRange(updatedRow, 9).setValue("DONE_ORDER");
        } else {
          sheet.getRange(updatedRow, 5).setValue(url);
          sheet.getRange(updatedRow, 9).setValue("DONE");
        }
  
        break;
      }
    }
  
    if (updatedRow === -1) {
      return json({ error: "RequestId not found" });
    }
  
    sortSheet(sheet);
  
    notify(`📸 Image updated: ${data.requestId}`);
  
    return json({ success: true, url });
  }
  
  
  /*************** GET USER ***************/
  function getUserData(uid) {
    const sheet = getTodaySheet();
    const data = sheet.getDataRange().getValues();
  
    const result = data
      .slice(1)
      .filter(row => row[1].toString() === uid.toString())
      .map(formatRow);
  
    return json(result);
  }
  
  /*************** ADMIN ***************/
  function getAllData() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets();
  
    let result = [];
  
    sheets.forEach(sheet => {
      const name = sheet.getName();
  
      if (/^\d{4}-\d{2}-\d{2}$/.test(name)) {
        const data = sheet.getDataRange().getValues();
  
        const rows = data.slice(1).map(row => ({
          date: name,
          uid: row[1],
          link: row[2],
          affiliate: row[3],
          image: row[4],
          imageSuccess: row[5],
          productPrice: row[6],
          commissionRate: row[7],
          status: row[8],
          requestId: row[9],
          time: row[0]
        }));
  
        result = result.concat(rows);
      }
    });
  
    return json(result);
  }
  
  /*************** FORMAT ***************/
  function formatRow(row) {
    return {
      time: row[0],
      uid: row[1],
      link: row[2],
      affiliate: row[3],
      image: row[4],
      imageSuccess: row[5],
      productPrice: row[6],
      commissionRate: row[7],
      status: row[8],
      requestId: row[9]
    };
  }
  
  /*************** HELPER ***************/
  function sortSheet(sheet) {
    const lastRow = sheet.getLastRow();
    if (lastRow <= 2) return;
  
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn())
      .sort({ column: 1, ascending: false });
  }
  
  function highlightNewRow(sheet) {
    const lastRow = sheet.getLastRow();
  
    sheet.getRange(lastRow, 1, 1, sheet.getLastColumn())
      .setBackground("#d9ead3");
  }
  
  function notify(message) {
    MailApp.sendEmail({
      to: CONFIG.NOTIFY_EMAIL,
      subject: "New Submit",
      body: message
    });
  }
  
  function json(data) {
    return ContentService
      .createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }