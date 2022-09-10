export declare enum ImageCacheType {
    UNKNOWN = 0,
    NONE = 1,
    DISK = 2,
    MEMORY = 3
}
export interface ImageLoadEventData {
    cacheType?: ImageCacheType;
    source: {
        url: string;
        width: number;
        height: number;
        mediaType?: string | null;
    };
}
export interface ImageLoadProgressEventData {
    loaded: number;
    total: number;
}
interface AndroidThrowable {
    class: string;
    cause: AndroidThrowable | null;
    message: string;
}
interface AndroidGlideException extends AndroidThrowable {
    origin: AndroidThrowable | null;
    causes: AndroidThrowable[] | null;
}
export interface ImageErrorEventData {
    error: string;
    ios?: {
        code: number;
        domain: string;
        description: string;
        helpAnchor: string | null;
        failureReason: string | null;
        recoverySuggestion: string | null;
    };
    android?: AndroidGlideException | null;
}
export declare type ImageProps = {
    source: any;
    transition: ImageTransition;
};
export declare type ImageTransition = {
    duration?: number;
    timing?: ImageTransitionTiming;
};
export declare enum ImageTransitionTiming {
    EASE_IN_OUT = 1,
    EASE_IN = 2,
    EASE_OUT = 3,
    LINEAR = 4
}
export declare enum ImageTransitionEffect {
    NONE = 0,
    CROSS_DISOLVE = 1,
    FLIP_FROM_LEFT = 2,
    FLIP_FROM_RIGHT = 3,
    FLIP_FROM_TOP = 4,
    FLIP_FROM_BOTTOM = 5,
    CURL_UP = 6,
    CURL_DOWN = 7
}
export {};
//# sourceMappingURL=Image.types.d.ts.map