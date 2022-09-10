// Copyright 2022-present 650 Industries. All rights reserved.

import ExpoModulesCore
import SDWebImage

public final class ImageModule: Module {
  lazy var prefetcher = SDWebImagePrefetcher.shared

  public func definition() -> ModuleDefinition {
    Name("ExpoImage")

    View(ImageView.self) {
      Events(
        "onLoadStart",
        "onProgress",
        "onError",
        "onLoad"
      )

      Prop("source") { (view: ImageView, source: ImageSource) in
        view.setSource(source)
      }

      Prop("resizeMode") { (view: ImageView, resizeMode: ImageResizeMode) in
        view.sdImageView.contentMode = resizeMode.toContentMode()
      }

      Prop("transition") { (view: ImageView, transition: ImageTransition?) in
        view.transition = transition
      }
    }

    // MARK: - Prefetching

    Function("prefetch") { (url: URL) -> ImagePrefetchToken? in
      if let token = prefetcher.prefetchURLs([url]) {
        return ImagePrefetchToken(token)
      }
      return nil
    }

    Function("prefetchAsync") { (url: URL, promise: Promise) in
      prefetcher.prefetchURLs([url], progress: nil) { (completed: UInt, skipped: UInt) in
        promise.resolve()
      }
    }

    Property("maxConcurrentPrefetchCount")
      .get { [prefetcher] in
        return prefetcher.maxConcurrentPrefetchCount
      }
      .set { [prefetcher] (newValue: UInt) in
        prefetcher.maxConcurrentPrefetchCount = newValue
      }

    Class("PrefetchToken", ImagePrefetchToken.self) {
      Function("cancel") { (token: ImagePrefetchToken) in
        token.cancel()
      }
    }
  }
}

class ImagePrefetchToken: SharedObject {
  let token: SDWebImagePrefetchToken

  init(_ token: SDWebImagePrefetchToken) {
    self.token = token
    super.init()
  }

  func cancel() {
    token.cancel()
  }
}
