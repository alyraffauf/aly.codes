export type GithubProject = {
  title: string;
  source: "github";
  repo: string;
};

export type TangledProject = {
  title: string;
  source: "tangled";
  repo: string;
  repoDid: string;
  language: string;
};

export type Project = GithubProject | TangledProject;

export const projects: Project[] = [
  {
    title: "albedo",
    source: "tangled",
    repo: "okami.mom/albedo",
    repoDid: "did:plc:l7hhzcbqqvpcquau5waryzdu",
    language: "Gleam",
  },
  {
    title: "appherder",
    source: "github",
    repo: "alyraffauf/appherder",
  },
  {
    title: "asterism",
    source: "tangled",
    repoDid: "did:plc:mncsln5prq6hz6qaknecflfq",
    repo: "aly.codes/asterism",
    language: "Go",
  },
  {
    title: "atbbs",
    source: "github",
    repo: "alyraffauf/atbbs",
  },
  {
    title: "citytexture",
    source: "github",
    repo: "alyraffauf/citytexture",
  },
  {
    title: "dewy",
    source: "github",
    repo: "alyraffauf/dewy",
  },
  {
    title: "entwine",
    source: "tangled",
    repo: "aly.codes/entwine",
    repoDid: "did:plc:elmksckjdwbogvbdebsgpava",
    language: "Gleam",
  },
  {
    title: "hoenn",
    source: "github",
    repo: "devon-systems/hoenn",
  },
  {
    title: "kyanite",
    source: "github",
    repo: "alyraffauf/kyanite",
  },
  {
    title: "morsels",
    source: "tangled",
    repo: "aly.codes/morsels",
    repoDid: "did:plc:rdgtjxv7f5jgxvy3hruwv77q",
    language: "Python",
  },
  {
    title: "nynx",
    source: "github",
    repo: "alyraffauf/nynx",
  },
  {
    title: "sinnoh",
    source: "github",
    repo: "devon-systems/sinnoh",
  },
  {
    title: "skytrace",
    source: "tangled",
    repo: "aly.codes/skytrace",
    repoDid: "did:plc:t2ou7sgchlpg4z3nvsyqjzxu",
    language: "TypeScript",
  },
  {
    title: "switchyard",
    source: "github",
    repo: "alyraffauf/switchyard",
  },
  {
    title: "tartarus",
    source: "github",
    repo: "alyraffauf/tartarus",
  },
  {
    title: "tg",
    source: "tangled",
    repo: "aly.codes/tg",
    repoDid: "did:plc:g5uweck3xar3m745g43giuhr",
    language: "Go",
  },
  {
    title: "watsup",
    source: "github",
    repo: "alyraffauf/watsup",
  },
];
