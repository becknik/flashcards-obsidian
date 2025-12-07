import dedent from 'dedent';
import { Settings } from './types/settings';

export const DEFAULT_SETTINGS: Settings = {
  initializedOnHosts: [],
  ankiConnectPermissions: [],
  includeSourceLink: false,
  flashcardsTag: 'card',
  inlineSeparator: '::',
  inlineSeparatorReversed: ':::',
  pathBasedDeckGlobal: true,
  deckNameGlobal: 'Default',
  applyFrontmatterTagsGlobal: false,
  applyHeadingContextTagsGlobal: false,
  headingContextModeGlobal: true,
  headingContextSeparator: ' > ',
  transferMediaFiles: false,
  defaultAnkiTag: 'Obsidian',
  ankiTagsToPreserve: ['leech'],
} as const;

export const FLASHCARDS_TAG_SUFFIXES = ['/reverse', '-reverse'];

// Related to Obsidian
export const STYLE_FILE_NAME = 'anki-card.css';
export const SCRIPTS_FOLDER_NAME = 'scripts';
export const ANKI_MEDIA_FOLDER_IMPORTS_PREFIX = '_obsidian-';

// Related to Anki

export const CARD_TEMPLATES = {
  basic: {
    Front: dedent`
      <div class="context">
        {{Context}}
      </div>

      {{Front}}

      <div class="tags">{{Tags}}</div>
    `,
    Back: dedent`
      {{FrontSide}}

      <hr id="answer">

      <div>
        {{Back}}
      </div>
    `,
  },
  reversed: {
    Front: dedent`
      <div class="context">
        {{Context}}
      </div>

      {{Back}}

      <div class="tags">{{Tags}}</div>
    `,
    Back: dedent`
      {{FrontSide}}

      <hr id="answer">

      <div>
        {{Front}}
      </div>
    `,
  },
  cloze: {
    Front: dedent`
      <div class="context">
        {{Context}}
      </div>

      {{cloze:Text}}
    `,
    Back: dedent`
      {{cloze:Text}}

      <br>

      {{Extra}}
    `,
  },
  memo: {
    Front: dedent`
      <div class="context">
        {{Context}}
      </div>

      {{Prompt}}

      <div class="tags">{{Tags}}</div>
    `,
    Back: dedent`
      {{FrontSide}}

      <hr id="answer">

      Memorzation review done.
    `,
  },
} as const;

export const CARD_TEMPLATE_SOURCE_SUFFIX = dedent`
<details class="source-section">
  <summary>Source</summary>
  {{Source}}
</details>
`;
