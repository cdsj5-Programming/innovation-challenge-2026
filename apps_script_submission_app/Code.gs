const SETTINGS = {
  ROOT_FOLDER_ID: '1arv_EIIfHfE2JXSFmdn-QyHxmOtSmrUX',
  SPREADSHEET_ID: '1J4GKtAyeJct4GMfDZUQbwXournHjAlx7fq4l78rLhMY',
  SHEET_NAME: '工作表1',
  ROSTER_SHEET_NAME: '學生名單',
  EVENT_TITLE: '第一屆聖五中學生創意設計挑戰賽',
  EVENT_SCHEDULE_LABEL: '2026 年 4 月 18 日 10:00 至 11:30',
  POSTER_MAX_FILE_SIZE_MB: 10,
  RESUBMISSION_WINDOW_MINUTES: 90,
  TEXT_LIMITS: {
    problemStatement: 200,
    designConcept: 500,
    solutionDetails: 1000,
    aiUsage: 500,
  },
};

const SHEET_HEADERS = [
  'first_submitted_at',
  'last_submitted_at',
  'submission_count',
  'group_key',
  'class_name',
  'member_count',
  'student_id_1',
  'student_id_2',
  'student_id_3',
  'student_name_1',
  'student_name_2',
  'student_name_3',
  'project_title',
  'problem_statement',
  'design_concept',
  'solution_details',
  'ai_usage',
  'science_poster_url',
  'science_poster_name',
  'generated_pdf_url',
  'group_folder_url',
];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('創意設計挑戰賽提交')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function setupSheet() {
  const sheet = getSheet_();
  const headerRange = sheet.getRange(1, 1, 1, SHEET_HEADERS.length);
  headerRange.setValues([SHEET_HEADERS]);
  headerRange.setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, SHEET_HEADERS.length);
}

function getAppBootstrapData() {
  const roster = getRosterData_();
  return {
    eventTitle: SETTINGS.EVENT_TITLE,
    eventScheduleLabel: SETTINGS.EVENT_SCHEDULE_LABEL,
    posterMaxFileSizeMb: SETTINGS.POSTER_MAX_FILE_SIZE_MB,
    resubmissionWindowMinutes: SETTINGS.RESUBMISSION_WINDOW_MINUTES,
    textLimits: SETTINGS.TEXT_LIMITS,
    classes: roster.classes,
    studentsByClass: roster.studentsByClass,
  };
}

function submitSubmission(formObject) {
  setupSheetIfNeeded_();

  const payload = normalizePayload_(formObject);
  validatePayload_(payload);

  const rootFolder = DriveApp.getFolderById(SETTINGS.ROOT_FOLDER_ID);
  const groupFolder = getOrCreateGroupFolder_(rootFolder, payload.groupKey);
  const existingRecord = findExistingSubmission_(payload.groupKey);
  validateResubmission_(existingRecord, payload.submittedAt);

  clearGroupFolderFiles_(groupFolder);
  const posterFile = saveRequiredFile_(
    groupFolder,
    payload.sciencePoster,
    ['image/jpeg', 'image/jpg'],
    ['jpg', 'jpeg'],
    payload.groupKey + '_科學海報'
  );
  const generatedPdf = createSubmissionPdf_(payload, groupFolder, posterFile);

  upsertSubmissionRow_(
    payload,
    {
      sciencePosterUrl: posterFile.getUrl(),
      sciencePosterName: posterFile.getName(),
      generatedPdfUrl: generatedPdf.getUrl(),
      groupFolderUrl: groupFolder.getUrl(),
    },
    existingRecord
  );

  return {
    success: true,
    message: existingRecord
      ? '已更新提交內容，系統已覆蓋為最新版本。'
      : '提交成功，已保存文字內容、科學海報及 PDF。',
    groupFolderUrl: groupFolder.getUrl(),
    generatedPdfUrl: generatedPdf.getUrl(),
    sciencePosterUrl: posterFile.getUrl(),
  };
}

function normalizePayload_(formObject) {
  const memberCount = Number(formObject.memberCount || 2);
  const members = [];

  for (let i = 1; i <= 3; i += 1) {
    const selectedMember = parseMemberSelection_(formObject['member' + i]);
    if (selectedMember) {
      members.push(selectedMember);
    }
  }

  members.sort((left, right) => compareStudentIds_(left.studentId, right.studentId));

  const className = sanitizeText_(formObject.className);
  const groupKeyParts = [className]
    .concat(members.map(member => member.studentId))
    .concat(members.map(member => member.studentName))
    .filter(Boolean);

  return {
    submittedAt: new Date(),
    className,
    memberCount,
    members,
    groupKey: sanitizeFolderName_(groupKeyParts.join('_')),
    projectTitle: sanitizeText_(formObject.projectTitle),
    problemStatement: sanitizeText_(formObject.problemStatement),
    designConcept: sanitizeText_(formObject.designConcept),
    solutionDetails: sanitizeText_(formObject.solutionDetails),
    aiUsage: sanitizeText_(formObject.aiUsage),
    sciencePoster: normalizeFileBlob_(formObject.sciencePoster),
  };
}

function validatePayload_(payload) {
  const roster = getRosterData_();

  if (!payload.className) {
    throw new Error('請選擇班級。');
  }

  if (roster.classes.indexOf(payload.className) === -1) {
    throw new Error('所選班級不在學生名單內。');
  }

  if (payload.members.length < 2 || payload.members.length > 3) {
    throw new Error('每組必須為 2 至 3 人。');
  }

  if (payload.memberCount !== payload.members.length) {
    throw new Error('請按組員人數選擇完整名單。');
  }

  const selectedKeys = {};
  const classLookup = getClassRosterLookup_(payload.className);

  payload.members.forEach((member, index) => {
    if (!member.studentId || !member.studentName) {
      throw new Error('請完整選擇第 ' + (index + 1) + ' 位組員。');
    }

    const memberKey = buildMemberKey_(member.studentId, member.studentName);
    if (selectedKeys[memberKey]) {
      throw new Error('不可重複選擇同一位學生。');
    }
    selectedKeys[memberKey] = true;

    if (!classLookup[memberKey]) {
      throw new Error('第 ' + (index + 1) + ' 位組員不屬於所選班級，請重新選擇。');
    }
  });

  [
    ['projectTitle', '作品名稱'],
    ['problemStatement', '問題說明'],
    ['designConcept', '設計理念'],
    ['solutionDetails', '解決方案細節'],
    ['aiUsage', '人工智能使用情況'],
  ].forEach(([key, label]) => {
    if (!payload[key]) {
      throw new Error('請填寫「' + label + '」。');
    }
  });

  validateTextLength_(payload.problemStatement, SETTINGS.TEXT_LIMITS.problemStatement, '問題說明');
  validateTextLength_(payload.designConcept, SETTINGS.TEXT_LIMITS.designConcept, '設計理念');
  validateTextLength_(payload.solutionDetails, SETTINGS.TEXT_LIMITS.solutionDetails, '解決方案細節');
  validateTextLength_(payload.aiUsage, SETTINGS.TEXT_LIMITS.aiUsage, '人工智能使用情況');

  if (!payload.sciencePoster) {
    throw new Error('請上傳科學海報 JPG。');
  }
}

function validateTextLength_(value, maxLength, label) {
  if ((value || '').length > maxLength) {
    throw new Error('「' + label + '」不可超過 ' + maxLength + ' 字。');
  }
}

function validateResubmission_(existingRecord, submittedAt) {
  if (!existingRecord) {
    return;
  }

  const firstSubmittedAt = new Date(existingRecord.firstSubmittedAt);
  const minutesPassed = (submittedAt.getTime() - firstSubmittedAt.getTime()) / 1000 / 60;

  if (minutesPassed > SETTINGS.RESUBMISSION_WINDOW_MINUTES) {
    throw new Error('已超過可修改時限。提交後只可於 ' + SETTINGS.RESUBMISSION_WINDOW_MINUTES + ' 分鐘內更新。');
  }
}

function parseMemberSelection_(rawValue) {
  const value = sanitizeText_(rawValue);
  if (!value) {
    return null;
  }

  const parts = value.split('|||');
  if (parts.length !== 2) {
    throw new Error('組員資料格式不正確，請重新選擇。');
  }

  return {
    studentId: sanitizeText_(parts[0]),
    studentName: sanitizeText_(parts[1]),
  };
}

function normalizeFileBlob_(maybeFile) {
  if (!maybeFile || typeof maybeFile === 'string') {
    return null;
  }
  return maybeFile;
}

function saveRequiredFile_(folder, blob, allowedMimeTypes, allowedExtensions, renameBase) {
  if (!blob) {
    throw new Error('缺少必交檔案。');
  }

  const sizeMb = bytesToMb_(blob.getBytes().length);
  if (sizeMb > SETTINGS.POSTER_MAX_FILE_SIZE_MB) {
    throw new Error('科學海報不可超過 ' + SETTINGS.POSTER_MAX_FILE_SIZE_MB + ' MB。');
  }

  const originalName = blob.getName() || 'science-poster.jpg';
  const extension = (originalName.split('.').pop() || '').toLowerCase();
  const mimeType = blob.getContentType();

  if (
    allowedExtensions.indexOf(extension) === -1 &&
    allowedMimeTypes.indexOf(mimeType) === -1
  ) {
    throw new Error('科學海報格式必須為 JPG。');
  }

  const finalExtension = extension === 'jpeg' ? 'jpg' : (extension || 'jpg');
  const finalName = renameBase + '.' + finalExtension;
  return folder.createFile(blob).setName(finalName);
}

function clearGroupFolderFiles_(folder) {
  const files = folder.getFiles();
  while (files.hasNext()) {
    files.next().setTrashed(true);
  }
}

function createSubmissionPdf_(payload, folder, posterFile) {
  const doc = DocumentApp.create(payload.groupKey + '_作品介紹');
  const body = doc.getBody();

  body.appendParagraph(SETTINGS.EVENT_TITLE).setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('作品介紹提交記錄');
  body.appendParagraph('提交時間：' + formatDate_(payload.submittedAt));
  body.appendParagraph('活動時間：' + SETTINGS.EVENT_SCHEDULE_LABEL);
  body.appendParagraph('組別：' + payload.groupKey);
  body.appendParagraph('');

  appendSection_(body, '班級', payload.className);
  appendSection_(body, '作品名稱', payload.projectTitle);
  appendSection_(body, '組員', payload.members.map(member => member.studentId + ' ' + member.studentName).join('\n'));
  appendSection_(body, '問題說明', payload.problemStatement);
  appendSection_(body, '設計理念', payload.designConcept);
  appendSection_(body, '解決方案細節', payload.solutionDetails);
  appendSection_(body, '人工智能使用情況', payload.aiUsage);
  appendSection_(body, '科學海報檔名', posterFile.getName());

  doc.saveAndClose();

  const docFile = DriveApp.getFileById(doc.getId());
  const pdfBlob = docFile.getAs(MimeType.PDF).setName(payload.groupKey + '_作品介紹.pdf');
  const pdfFile = folder.createFile(pdfBlob);

  docFile.setTrashed(true);
  return pdfFile;
}

function appendSection_(body, heading, content) {
  body.appendParagraph(heading).setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph(content || '無');
  body.appendParagraph('');
}

function upsertSubmissionRow_(payload, fileLinks, existingRecord) {
  const firstSubmittedAt = existingRecord ? new Date(existingRecord.firstSubmittedAt) : payload.submittedAt;
  const submissionCount = existingRecord ? Number(existingRecord.submissionCount || 1) + 1 : 1;
  const row = [
    firstSubmittedAt,
    payload.submittedAt,
    submissionCount,
    payload.groupKey,
    payload.className,
    payload.members.length,
    payload.members[0] ? payload.members[0].studentId : '',
    payload.members[1] ? payload.members[1].studentId : '',
    payload.members[2] ? payload.members[2].studentId : '',
    payload.members[0] ? payload.members[0].studentName : '',
    payload.members[1] ? payload.members[1].studentName : '',
    payload.members[2] ? payload.members[2].studentName : '',
    payload.projectTitle,
    payload.problemStatement,
    payload.designConcept,
    payload.solutionDetails,
    payload.aiUsage,
    fileLinks.sciencePosterUrl,
    fileLinks.sciencePosterName,
    fileLinks.generatedPdfUrl,
    fileLinks.groupFolderUrl,
  ];

  const sheet = getSheet_();
  if (existingRecord) {
    sheet.getRange(existingRecord.rowIndex, 1, 1, row.length).setValues([row]);
    return;
  }
  sheet.appendRow(row);
}

function getOrCreateGroupFolder_(rootFolder, folderName) {
  const folders = rootFolder.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return rootFolder.createFolder(folderName);
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SETTINGS.SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SETTINGS.SHEET_NAME);
  if (!sheet) {
    throw new Error('找不到工作表：' + SETTINGS.SHEET_NAME);
  }
  return sheet;
}

function getRosterSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SETTINGS.SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SETTINGS.ROSTER_SHEET_NAME);
  if (!sheet) {
    throw new Error('找不到工作表：' + SETTINGS.ROSTER_SHEET_NAME);
  }
  return sheet;
}

function setupSheetIfNeeded_() {
  const sheet = getSheet_();
  const currentHeaders = sheet.getRange(1, 1, 1, SHEET_HEADERS.length).getValues()[0];
  const shouldSetup = SHEET_HEADERS.some((header, index) => currentHeaders[index] !== header);
  if (shouldSetup) {
    setupSheet();
  }
}

function getRosterData_() {
  const sheet = getRosterSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    throw new Error('學生名單工作表沒有資料。');
  }

  const values = sheet.getRange(2, 1, lastRow - 1, 3).getDisplayValues();
  const studentsByClass = {};
  const classes = [];

  values.forEach(row => {
    const className = sanitizeText_(row[0]);
    const studentId = sanitizeText_(row[1]);
    const studentName = sanitizeText_(row[2]);

    if (!className || !studentId || !studentName) {
      return;
    }

    if (!studentsByClass[className]) {
      studentsByClass[className] = [];
      classes.push(className);
    }

    studentsByClass[className].push({
      studentId,
      studentName,
      value: buildMemberKey_(studentId, studentName),
      label: studentId + ' - ' + studentName,
    });
  });

  classes.forEach(className => {
    studentsByClass[className].sort((a, b) => compareStudentIds_(a.studentId, b.studentId));
  });

  return {
    classes,
    studentsByClass,
  };
}

function getClassRosterLookup_(className) {
  const roster = getRosterData_();
  const students = roster.studentsByClass[className] || [];
  const lookup = {};
  students.forEach(student => {
    lookup[student.value] = true;
  });
  return lookup;
}

function findExistingSubmission_(groupKey) {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return null;
  }

  const data = sheet.getRange(2, 1, lastRow - 1, SHEET_HEADERS.length).getValues();
  for (let index = 0; index < data.length; index += 1) {
    const row = data[index];
    if (row[3] === groupKey) {
      return {
        rowIndex: index + 2,
        firstSubmittedAt: row[0],
        lastSubmittedAt: row[1],
        submissionCount: row[2],
      };
    }
  }
  return null;
}

function sanitizeText_(value) {
  return String(value || '').trim();
}

function sanitizeFolderName_(value) {
  return sanitizeText_(value).replace(/[\\/:*?"<>|#%\[\]]+/g, '_');
}

function buildMemberKey_(studentId, studentName) {
  return sanitizeText_(studentId) + '|||' + sanitizeText_(studentName);
}

function compareStudentIds_(left, right) {
  const leftNumber = Number(left);
  const rightNumber = Number(right);
  if (!isNaN(leftNumber) && !isNaN(rightNumber)) {
    return leftNumber - rightNumber;
  }
  return String(left).localeCompare(String(right), 'zh-Hant');
}

function bytesToMb_(bytes) {
  return bytes / 1024 / 1024;
}

function formatDate_(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
}
