import * as Redux from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
import { FanchartSettings } from '../Store/Fanchart';
import { PedigreeSettings } from '../Store/Pedigree';
import { RadialSettings } from '../Store/Radial';
import { QuiltsSettings } from '../Store/Quilts';
import { PersonSet } from '../Store/Person';
import { SourceSet } from '../Store/Source';
import { HistoryItem } from '../Store/History';
import { actionCreator } from '../Store/Actions';
import { GenealogyEventSet } from '../Store/Event';
import { PersonaListSettings } from '../Store/PersonaList';
import { PlaceSet } from '../Store/Place';
import { QuiltsResult } from '../Server/Quilts';
import { ResearcherSet } from '../Store/Researcher';
import { StatsSettings } from '../Store/Stats';
import { JSONCount } from '../Server/Stats';
import * as GP_JSON from '../Server/JSON';

export type DatabaseObjectsCount = JSONCount;

export interface AppState {
   pedigree: PedigreeSettings;
   fanchart: FanchartSettings;
   radial: RadialSettings;
   personalist: PersonaListSettings;
   quilts: QuiltsSettings;
   quiltsLayout: {
      layout?: QuiltsResult,
   };
   stats: StatsSettings;
   count: DatabaseObjectsCount|undefined;
   persons: PersonSet;        // details for all persons
   places: PlaceSet;          // details for all places
   events: GenealogyEventSet; // all known events
   sources: SourceSet;
   history: HistoryItem[];    // id of persons recently visited
   csrf: string;              // CSRF token for Django
   researchers: ResearcherSet;

   lastFetchedTheme: number,
   // id of the last theme used when fetching personas. We might have to
   // reload when the theme is computed on the server.

   metadata: GP_JSON.Metadata;
}

export type GPDispatch = Redux.Dispatch<AppState>;
export type GPStore = Redux.Store<AppState>;

/**
 * Given an id, returns the name of the corresponding theme.
 */
export const themeNameGetter = (s: AppState) =>
   (id: GP_JSON.ColorSchemeId): string => {
      const m = s.metadata.themes.find(e => e.id == id);
      return m ? m.name : '';
   };

/**
 * Rehydrate action generated by redux-persist
 */
export const rehydrate = actionCreator<AppState>(REHYDRATE);
rehydrate.type = REHYDRATE;   // no prefix
