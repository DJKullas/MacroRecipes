export class Query {
    private _search: string;

    public get search(): string {
        return this._search;
    }
    public set search(value: string) {
        this._search = value;
    }

    constructor(search: string) {
        this.search = search;
    }

}