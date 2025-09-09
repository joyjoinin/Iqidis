// // global.teardown.ts
// import { test as teardown } from "@playwright/test";
// import fs from "fs";
// import path from "path";
// import axios from "axios";

// teardown("send file to slack", async ({}) => {
//   console.log("📤 正在发送测试报告到 Slack...");

//   const projectRoot = process.cwd();
//   const FILE_PATH = path.join(projectRoot, "test-results.json"); // 要发送的文件路径
//   const CHANNEL = "C09E4G46D0C"; // 注意：这里应使用频道 ID，不是 #channel-name（或使用 user_id）
//   const FILE_TITLE = "Test Report"; // 文件标题
//   const INITIAL_COMMENT = "✅ 自动化测试已完成，详见附件"; // 评论

//   // 检查文件是否存在
//   if (!fs.existsSync(FILE_PATH)) {
//     console.error(`❌ 文件不存在: ${FILE_PATH}`);
//     return;
//   }

//   console.log(fs.statSync(FILE_PATH).size, path.basename(FILE_PATH));
//   try {
//     // Step 1: 获取上传 URL
//     const uploadUrlResponse = await axios.post(
//       "https://slack.com/api/files.getUploadURLExternal",
//       {
//         length: 5688,
//         filename: "test.json",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${TOKEN}`,
//         },
//       }
//     );

//     const { upload_url: uploadUrl, file_id: fileId } = uploadUrlResponse.data;

//     if (!uploadUrl) {
//       throw new Error(
//         `Failed to get upload URL: ${uploadUrlResponse.data.error}`
//       );
//     }

//     console.log("✅ 获取上传 URL 成功");

//     // Step 2: 将文件内容 POST 到 upload_url
//     const fileBuffer = fs.readFileSync(FILE_PATH);
//     await axios.post(uploadUrl, fileBuffer, {
//       headers: {
//         "Content-Type": "application/octet-stream",
//       },
//     });

//     console.log("✅ 文件已上传到临时 URL");

//     // Step 3: 完成上传
//     await axios.post(
//       "https://slack.com/api/files.completeUploadExternal",
//       {
//         file_id: fileId,
//         title: FILE_TITLE,
//         initial_comment: INITIAL_COMMENT,
//         channels: [CHANNEL], // 注意：channels 是数组
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${TOKEN}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("🎉 文件已成功上传并发布到 Slack！");
//   } catch (error: any) {
//     console.error("❌ 上传文件到 Slack 失败:", error.message || error);
//     if (error.response) {
//       console.error("Slack API 错误详情:", error.response.data);
//     }
//   }
// });
