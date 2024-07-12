class Format {
    ext?: string;
    url?: string;
    hash?: string;
    mime?: string;
    name?: string;
    path?: string | null;
    size?: number;
    width?: number;
    height?: number;

    constructor(data: any) {
        this.ext = data.ext;
        this.url = data.url;
        this.hash = data.hash;
        this.mime = data.mime;
        this.name = data.name;
        this.path = data.path;
        this.size = data.size;
        this.width = data.width;
        this.height = data.height;
    }
}

class PhotoAttributes {
    name?: string;
    alternativeText?: string | null;
    caption?: string | null;
    width?: number;
    height?: number;
    formats?: {
        large?: Format;
        small?: Format;
        medium?: Format;
        thumbnail?: Format;
    };
    hash?: string;
    ext?: string;
    mime?: string;
    size?: number;
    url?: string;
    previewUrl?: string | null;
    provider?: string;
    provider_metadata?: any;
    createdAt?: string;
    updatedAt?: string;

    constructor(data: any) {
        this.name = data.name;
        this.alternativeText = data.alternativeText;
        this.caption = data.caption;
        this.width = data.width;
        this.height = data.height;
        this.formats = {
            large: data.formats?.large ? new Format(data.formats.large) : undefined,
            small: data.formats?.small ? new Format(data.formats.small) : undefined,
            medium: data.formats?.medium ? new Format(data.formats.medium) : undefined,
            thumbnail: data.formats?.thumbnail ? new Format(data.formats.thumbnail) : undefined
        };
        this.hash = data.hash;
        this.ext = data.ext;
        this.mime = data.mime;
        this.size = data.size;
        this.url = data.url;
        this.previewUrl = data.previewUrl;
        this.provider = data.provider;
        this.provider_metadata = data.provider_metadata;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}

export class PhotoData {
    id?: number;
    attributes?: PhotoAttributes;

    constructor(data: any) {
        this.id = data.id;
        this.attributes = data.attributes ? new PhotoAttributes(data.attributes) : undefined;
    }
}

class DocumentAttributes {
    createdAt?: string;
    updatedAt?: string;
    photo?: { data?: PhotoData[] };
    cin_recto?: { data?: PhotoData[] };
    cin_verso?: { data?: PhotoData[] };
    rib?: { data?: PhotoData[] };

    constructor(data: any) {
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.photo = data.photo?.data ? { data: data.photo.data.map((item: any) => new PhotoData(item)) } : undefined;
        this.cin_recto = data.cin_recto?.data  ? { data: data.cin_recto.data.map((item: any) => new PhotoData(item)) } : undefined;
        this.cin_verso = data.cin_verso?.data  ? { data: data.cin_verso.data.map((item: any) => new PhotoData(item)) } : undefined;
        this.rib = data.rib?.data  ? { data: data.rib.data.map((item: any) => new PhotoData(item)) } : undefined;
    }
}

export class DocumentData {
    id?: number;
    attributes?: DocumentAttributes;

    constructor(data: any) {
        this.id = data.id;
        this.attributes = data.attributes ? new DocumentAttributes(data.attributes) : undefined;
    }
}
