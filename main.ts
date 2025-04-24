import Icon from "assets/icon.svg";
import { addIcon, Notice, Plugin, TFile } from "obsidian";
import { NOTICE_TIMEOUT } from "src/conf/constants";
import { SettingsTab } from "src/gui/settings-tab";
import { Anki } from "src/services/anki";
import { CardsService } from "src/services/cards";
import { Settings } from "src/types/settings";

const DEFAULT_SETTINGS: Settings = {
  contextAwareMode: true,
  sourceSupport: false,
  codeHighlightSupport: false,
  inlineID: false,
  contextSeparator: " > ",
  deck: "Default",
  folderBasedDeck: true,
  flashcardsTag: "card",
  inlineSeparator: "::",
  inlineSeparatorReverse: ":::",
  defaultAnkiTag: "obsidian",
  ankiConnectPermission: false,
} as const;

export default class ObsidianFlashcard extends Plugin {
  private settings: Settings;
  private cardsService: CardsService;

  async onload() {
    await this.loadSettings();

    addIcon("flashcards", Icon);

    // TODO test when file did not insert flashcards, but one of them is in Anki already
    const anki = new Anki();
    this.cardsService = new CardsService(this.app, this.settings);

    const statusBar = this.addStatusBarItem();

    this.addCommand({
      id: "generate-flashcard-current-file",
      name: "Generate for current file",
      checkCallback: (checking: boolean) => {
        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile) return false;

        if (!checking) {
          this.generateCards(activeFile);
        }
        return true;
      },
    });

    this.addRibbonIcon("flashcards", "Generate flashcards", () => {
      const activeFile = this.app.workspace.getActiveFile();
      if (activeFile) {
        this.generateCards(activeFile);
      } else {
        new Notice("Open a file before");
      }
    });

    this.addSettingTab(new SettingsTab(this.app, this));

    this.registerInterval(
      window.setInterval(
        () =>
          anki
            .ping()
            .then(() => statusBar.setText("Anki Active ⚡️"))
            .catch(() => statusBar.setText("Anki Connection Failed ❌")),
        // TODO has this to be so low?? Might this be the reason for the Anki syslog spamming?
        15 * 1000
      )
    );
  }

  onunload() {
    this.saveData(this.settings);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  private generateCards(activeFile: TFile) {
    this.cardsService
      .execute(activeFile)
      .then((res) => {
        for (const r of res) {
          new Notice(r, NOTICE_TIMEOUT);
        }
        console.log(res);
      })
      .catch((err) => {
        Error(err);
      });
  }
}
