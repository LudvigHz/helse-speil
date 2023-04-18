declare type Extension = {
    code: number;
    [field: string]: any;
};

declare type UUID = string;

declare type Oppgave = {
    id: string;
    erPåVent: boolean;
    tildelt?: Maybe<string>;
    totrinnsvurdering?: Maybe<Totrinnsvurdering>;
};
