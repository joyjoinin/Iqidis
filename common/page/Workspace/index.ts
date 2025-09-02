import { type Locator, type Page } from "@playwright/test";

export class Workspace {
  page: Page;
  seatUsage: Locator;
  adminPanel: Locator;
  quickActions: Locator;
  overview: Locator;
  users: Locator;
  workspaces: Locator;
  settings: Locator;
  inviteNewUsers: Locator;
  cancelButton: Locator;
  settingsButton: Locator;
  inviteUserButton: Locator;
  sendInvitationButton: Locator;
  confirmButton: Locator;
  createWorkspaceButton: Locator;
  addMembersButton: Locator;
  saveChangesButton: Locator;
  purchaseMoreSeatsButton: Locator;
  addSeatsButton: Locator;
  payNowButton: Locator;
  manageSubscriptionButton: Locator;
  subscriptionHistory: Locator;
  cancelSubscriptionButton: Locator;
  reactivateSubscriptionButton: Locator;
  yesButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.seatUsage = page.getByText("Seat Usage");
    this.adminPanel = page.getByRole("heading", { name: "Admin Panel" });
    this.quickActions = page
      .locator('div[data-sentry-element="Card"]')
      .getByText("Quick Actions");
    this.overview = page.getByRole("tab", { name: "Overview" });
    this.users = page.getByRole("tab", { name: "Users" });
    this.workspaces = page.getByRole("tab", { name: "Workspaces" });
    this.settings = page.getByRole("tab", { name: "Settings" });
    this.inviteNewUsers = page.getByRole("button", {
      name: "Invite New Users",
    });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
    this.settingsButton = page.getByRole("button", { name: "Settings" });
    this.inviteUserButton = page.getByRole("button", { name: "Invite User" });
    this.sendInvitationButton = page.getByRole("button", {
      name: "Send Invitation",
    });
    this.confirmButton = page.getByRole("button", { name: "OK" });
    this.createWorkspaceButton = page.getByRole("button", {
      name: "Create Workspace",
    });
    this.addMembersButton = page.getByRole("button", { name: "Add Members" });
    this.saveChangesButton = page.getByRole("button", {
      name: "Save Changes",
    });
    this.purchaseMoreSeatsButton = page.getByRole("button", {
      name: "Purchase more seats",
    });

    this.addSeatsButton = page.getByRole("button", { name: "Add Seats" });
    this.payNowButton = page.getByRole("button", { name: "Pay Now" });
    this.manageSubscriptionButton = page.getByRole("button", {
      name: "Manage Subscription",
    });
    this.subscriptionHistory = page.getByRole("tab", {
      name: "Subscription History",
    });
    this.cancelSubscriptionButton = page.getByRole("button", {
      name: "Cancel Subscription",
    });
    this.reactivateSubscriptionButton = page.getByRole("button", {
      name: "Reactivate Subscription",
    });
    this.yesButton = page.getByRole("button", { name: "Yes" });
  }
}
