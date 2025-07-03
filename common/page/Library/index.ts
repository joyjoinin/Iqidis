import { type Locator, type Page } from "@playwright/test";

export class Library {
  page: Page;
  libraryButton: Locator;
  uploadFileButton: Locator;
  selectFilesButton: Locator;
  waitingButton: Locator;
  uploadButton: Locator;
  attachToChatButton: Locator;
  continueUploadButton: Locator;
  foldersButton: Locator;
  newFoldersButton: Locator;
  createButton: Locator;
  moveFileButton: Locator;
  moveButton: Locator;
  renameButton: Locator;
  deleteMenu: Locator;
  editMenu: Locator;
  deleteButton: Locator;
  shareButton: Locator;
  sharedButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.libraryButton = page.getByRole("button", { name: "Library" });
    this.uploadFileButton = page.getByRole("button", { name: "Upload" });
    this.selectFilesButton = page.getByRole("button", {
      name: "Select files",
      exact: true,
    });
    this.waitingButton = page.getByRole("button", {
      name: "files waiting to upload Add files",
    });
    this.uploadButton = page
      .getByLabel("Upload Documents")
      .getByRole("button", { name: "Upload", exact: true });

    this.attachToChatButton = page.getByRole("button", {
      name: "Attach to chat",
    });
    this.continueUploadButton = page.getByRole("button", {
      name: "Continue Upload",
    });
    this.foldersButton = page.locator("div").filter({ hasText: /^Folders$/ });
    this.newFoldersButton = page.getByRole("button", { name: "New Folder" });
    this.createButton = page.getByRole("button", { name: "Create" });
    this.moveFileButton = page.getByRole("button", { name: "Move Files" });
    this.moveButton = page.getByRole("button", { name: "Move", exact: true });
    this.editMenu = page.getByRole("menuitem", { name: "Edit" });
    this.renameButton = page.getByRole("button", { name: "Rename" });
    this.deleteMenu = page.getByRole("menuitem", { name: "Delete" });
    this.deleteButton = page.getByRole("button", { name: "Delete" });
    this.shareButton = page.getByRole("button", { name: "Share" });
    this.sharedButton = page.getByText("Shared", { exact: true });
  }

  async clickLibrary() {
    await this.libraryButton.click();
  }

  async uploadFile() {
    await this.uploadFileButton.click();
  }

  async clickSelectFiles() {
    await this.selectFilesButton.click();
  }

  async inputFile(file: string = "common/testFiles/UploadFile1.pdf") {
    const file_input = this.page.locator("input[name='file']");
    await file_input.setInputFiles(file);
  }

  async upload() {
    await this.uploadButton.click();
  }

  async attachToChat() {
    await this.attachToChatButton.click({ timeout: 15000 });
  }

  async continueUpload() {
    await this.continueUploadButton.click();
  }

  async clickFolders() {
    await this.foldersButton.click();
  }

  async clickNewFolders() {
    await this.newFoldersButton.click();
  }

  async inputFolderName(folderName: string) {
    await this.page
      .getByPlaceholder("Please input folder name")
      .fill(folderName);
    await this.page.waitForTimeout(3000);
  }

  async inputDescription(description: string) {
    await this.page
      .getByPlaceholder("Please input folder description")
      .fill(description);
    await this.page.waitForTimeout(3000);
  }

  async create() {
    await this.createButton.click();
  }

  async checkFile(index: number) {
    await this.page
      .locator("td input[class='ant-checkbox-input']")
      .nth(index)
      .check();
    await this.page.waitForTimeout(1000);
  }

  async moveFile() {
    await this.moveFileButton.click();
  }

  async move() {
    await this.moveButton.click();
  }

  async selectFolder() {
    await this.page
      .locator(
        ".ant-select.ant-select-outlined.sm\\:w-\\[220px\\] > .ant-select-selector"
      )
      .click();
    await this.page
      .locator('div[class="ant-select-item ant-select-item-option"]')
      .last()
      .click();
    await this.page.waitForTimeout(5000);
  }

  async clickMore() {
    await this.page
      .locator(
        'svg[class="lucide lucide-ellipsis size-4 dark:group-hover:text-white group-hover:text-function-message"]'
      )
      .first()
      .click();
  }

  async edit() {
    await this.editMenu.click();
  }

  async rename() {
    await this.renameButton.click();
  }

  async delete() {
    await this.deleteMenu.click();
  }

  async deleteConfirm() {
    await this.deleteButton.click();
  }
}
