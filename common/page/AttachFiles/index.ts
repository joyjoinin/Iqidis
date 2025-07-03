import { type Locator, type Page } from "@playwright/test";

export class AttachFiles {
  page: Page;
  attachFileButton: Locator;
  libraryFilesButton: Locator;
  allDocumentsButton: Locator;
  filterButton: Locator;
  pdfFiles: Locator;
  selectAllCheckbox: Locator;
  attachButton: Locator;
  recentFilesButton: Locator;
  star: Locator;
  yellowStar: Locator;
  favoritesLabel: Locator;
  browseLibraryButton: Locator;
  uploadNewButton: Locator;
  selectFilesButton: Locator;
  waitingButton: Locator;
  uploadButton: Locator;
  attachToChatButton: Locator;
  uploadNewFilesButton: Locator;
  doNotAddDocumentToLibraryCheckbox: Locator;
  closeButton: any;

  constructor(page: Page) {
    this.page = page;
    this.attachFileButton = page.locator(
      "button[data-role='attachments-button']"
    );
    this.libraryFilesButton = page.getByText("Library Files");
    this.allDocumentsButton = page.getByText("All Documents");
    this.filterButton = page.locator(".lucide.lucide-filter");
    this.pdfFiles = page.getByText("PDF Files");
    this.selectAllCheckbox = page.getByRole("checkbox", { name: "Select all" });
    this.attachButton = page.getByRole("button", { name: "Attach" });
    this.recentFilesButton = page.getByText("Recent Files");
    this.star = page.locator(
      'svg[class="lucide lucide-star size-4 cursor-pointer hover:text-yellow-700"]'
    );
    this.yellowStar = page.locator(
      'svg[class="lucide lucide-star size-4 cursor-pointer hover:text-yellow-700 text-yellow-300 fill-current"]'
    );
    this.favoritesLabel = page
      .locator("label")
      .filter({ hasText: "Favorites" });
    this.browseLibraryButton = page.getByRole("button", {
      name: "Browse Library",
    });
    this.uploadNewButton = page.getByRole("button", {
      name: "Upload New",
    });
    this.selectFilesButton = page.getByRole("button", {
      name: "Select files",
      exact: true,
    });
    this.waitingButton = page.getByRole("button", {
      name: "files waiting to upload Add files",
    });
    this.uploadButton = page.getByRole("button", {
      name: "Upload",
      exact: true,
    });

    this.attachToChatButton = page.getByRole("button", {
      name: "Attach to chat",
    });

    this.uploadNewFilesButton = page.getByText("Upload New Files");
    this.doNotAddDocumentToLibraryCheckbox = page.getByRole("checkbox", {
      name: "Do not add document to library",
    });

    this.closeButton = page.locator("button").filter({ hasText: "Close" });
  }

  async clickAttachFilesIcon() {
    await this.attachFileButton.click();
  }

  async clickAllDocuments() {
    await this.allDocumentsButton.click();
  }
  async clickLibraryFiles() {
    await this.libraryFilesButton.click();
  }
  async clickRecentFiles() {
    await this.recentFilesButton.click();
  }
  async clickFilter() {
    await this.filterButton.click();
    await this.filterButton.hover();
  }
  async selectPDF() {
    await this.pdfFiles.click();
    await this.page.waitForTimeout(3000);
  }

  async selectAllFiles() {
    await this.selectAllCheckbox.check();
  }

  async attachFile() {
    await this.attachButton.click();
  }

  async clickFavorites() {
    await this.favoritesLabel.click();
    await this.page.waitForTimeout(3000);
  }

  async clickBrowseLibrary() {
    await this.browseLibraryButton.click();
  }

  async clickUploadNew() {
    await this.uploadNewButton.click();
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

  async clickUploadNewFiles() {
    await this.uploadNewFilesButton.click();
  }

  async doNotAddDocumentToLibrary() {
    await this.doNotAddDocumentToLibraryCheckbox.check();
  }

  async closeUpload() {
    await this.closeButton.click();
  }
}
