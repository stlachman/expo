// Copyright 2022-present 650 Industries. All rights reserved.

import SDWebImage
import ExpoModulesCore

public final class ImageView: ExpoView {
  let sdImageView = SDAnimatedImageView(frame: .zero)
  let imageManager = SDWebImageManager()

  var transition: ImageTransition?

  // MARK: - Events

  @Event
  var onLoadStart: Callback<Any>

  @Event
  var onProgress: Callback<Any>

  @Event
  var onError: Callback<Any>

  @Event
  var onLoad: Callback<Any>

  // MARK: - ExpoView

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)

    clipsToBounds = true
    sdImageView.contentMode = .scaleAspectFill
    sdImageView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    sdImageView.layer.masksToBounds = true

    addSubview(sdImageView)
  }

  // MARK: - Implementation

  func setSource(_ source: ImageSource) {
    var context = [SDWebImageContextOption: Any]()

    if imageManager.isRunning {
      imageManager.cancelAll()
    }

    onLoadStart([:])

    imageManager.loadImage(with: source.uri,
                           context: context,
                           progress: self.imageLoadProgress(_:_:_:),
                           completed: self.imageLoadCompleted(_:_:_:_:_:_:))
  }

  // MARK: - Loading

  func imageLoadProgress(_ receivedSize: Int, _ expectedSize: Int, _ imageUrl: URL?) {
    log.trace("Image load progress \(receivedSize) / \(expectedSize)")
    onProgress([
      "loaded": receivedSize,
      "total": expectedSize
    ])
  }

  func imageLoadCompleted(
    _ image: UIImage?,
    _ data: Data?,
    _ error: Error?,
    _ cacheType: SDImageCacheType,
    _ finished: Bool,
    _ imageUrl: URL?
  ) {
    if let error = error {
      onError(["error": error.localizedDescription])
      return
    }
    guard finished else {
      log.debug("Loading the image has been canceled")
      return
    }
    log.trace("Image load completed")

    if let transition = transition, transition.duration > 0 {
      let options = transition.toAnimationOptions()
      UIView.transition(with: sdImageView, duration: transition.duration, options: options) { [weak sdImageView] in
        sdImageView?.image = image
      }
    } else {
      sdImageView.image = image
    }
  }
}
