import type {
  DatasetsType,
  IndicatorsType,
  InitiativeType,
  NavItem,
  TabActions,
} from "@/types/configuration.type";

export const NAV_ITEMS: NavItem[] = [
  { label: "Tableau de Bord", path: "/" },
  {
    label: "Configuration",
    children: [
      {
        label: "Initiatives",
        path: "/configuration/initiatives",
      },
      {
        label: "Datasets",
        path: "/configuration/datasets",
      },
      {
        label: "Indicateurs",
        path: "/configuration/indicators",
      },
    ],
  },
  {
    label: "Participations",
    children: [
      {
        label: "Participants",
        path: "/participation/participants",
      },
      {
        label: "Assignations",
        path: "/participation/assignations",
      },
    ],
  },

  { label: "Chats", path: "/chats" },
];

export const TABS_INDICATORS: TabActions<IndicatorsType>[] = [
  {
    label: "Tous",
    value: "all",
    action: (data: IndicatorsType) => {
      return data.id != null;
    },
  },
  {
    label: "This Month",
    value: "active",
    action: (i: IndicatorsType) => {
      return (
        new Date(i.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
    },
  },
  {
    label: "Old",
    value: "old",
    action: (i: IndicatorsType) => {
      return (
        new Date(i.createdAt) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
    },
  },
];

// Tabs pour les datasets
export const TABS_DATASETS = [
  { value: "all", label: "Tous", action: (data: DatasetsType) => data != null },
  {
    value: "with_indicators",
    label: "Avec indicateurs",
    action: (data: DatasetsType) => (data.indicateurs?.length ?? 0) > 0,
  },
  {
    value: "with_initiatives",
    label: "Avec initiatives",
    action: (data: DatasetsType) => data.initiative != null,
  },
  {
    value: "empty",
    label: "Vides",
    action: (data: DatasetsType) =>
      (data.indicateurs?.length ?? 0) === 0 &&
      typeof data.initiative !== "object",
  },
];

// Tabs pour les initiatives
export const TABS_INITIATIVES = [
  {
    value: "all",
    label: "Toutes",
    action: (data: InitiativeType) => data != null,
  },
  {
    value: "2024",
    label: "2024",
    action: (data: InitiativeType) => data.periode.includes("2024"),
  },
  {
    value: "2025",
    label: "2025",
    action: (data: InitiativeType) => data.periode.includes("2025"),
  },
  {
    value: "with_datasets",
    label: "Avec datasets",
    action: (data: InitiativeType) => !!data.dataset,
  },
];

export const TABS_PARTICIPANTS = [
  { value: "all", label: "Tous", action: () => true },
  // Vous pouvez ajouter d'autres onglets si nécessaire
];
