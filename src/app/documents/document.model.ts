export class Document {
  public id: string;
  public name: string;
  public description?: string;

  public url?: string;
  public children?: Document[];
  public firebaseId?: string;

  constructor(
    id: string,
    name: string,
    description: string = '',
    url: string,
    children: Document[] = [],
    firebaseId: string = ''
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.url = url;
    this.children = children;
    this.firebaseId = firebaseId;
  }
}
