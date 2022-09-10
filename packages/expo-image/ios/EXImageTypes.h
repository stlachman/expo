// Copyright 2020-present 650 Industries. All rights reserved.

#import <React/RCTResizeMode.h>

typedef NS_ENUM(NSInteger, EXImageCacheTypeEnum) {
  EXImageCacheUnknown = 0,
  EXImageCacheNone,
  EXImageCacheDisk,
  EXImageCacheMemory
};

@interface EXImageTypes : NSObject

+ (EXImageCacheTypeEnum)convertToCacheTypeEnum:(NSInteger)imageCacheType;
+ (nullable NSString *)sdImageFormatToMediaType:(NSInteger)imageFormat;
+ (UIViewContentMode)resizeModeToContentMode:(RCTResizeMode)resizeMode;

@end

